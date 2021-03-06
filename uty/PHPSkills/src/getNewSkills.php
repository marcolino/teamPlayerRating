<?php
/**
 * Get a match in input and respond with new ratings JSON
 */
require_once(dirname(__FILE__) . "/Moserware/Skills/GameInfo.php");
require_once(dirname(__FILE__) . "/Moserware/Skills/Player.php");
require_once(dirname(__FILE__) . "/Moserware/Skills/Rating.php");
require_once(dirname(__FILE__) . "/Moserware/Skills/Team.php");
require_once(dirname(__FILE__) . "/Moserware/Skills/Teams.php");
require_once(dirname(__FILE__) . "/Moserware/Skills/SkillCalculator.php");
require_once(dirname(__FILE__) . "/Moserware/Skills/TrueSkill/TwoTeamTrueSkillCalculator.php");

use Moserware\Skills\GameInfo;
use Moserware\Skills\Player;
use Moserware\Skills\Rating;
use Moserware\Skills\Team;
use Moserware\Skills\Teams;
use Moserware\Skills\SkillCalculator;
use Moserware\Skills\TrueSkill\TwoTeamTrueSkillCalculator;

$charset = 'utf8';
$callback = isset($_GET['callback']) ? $_GET['callback'] : null;
$teams = isset($_GET['teams']) ? $_GET['teams'] : null;

$calculatorTS = new TwoTeamTrueSkillCalculator();
$gameInfoTS = new GameInfo();
$teamsTS = null;
$ranking = null;

# user-sort teams, since ranks array (3rd parameters of calculateNewRatings())
# apparently does not work as expected;
# negate scores difference to get rankinks, requested by calculateNewRatings();
usort($teams, function($a, $b) { return - ($a['score'] - $b['score']); });

foreach ($teams as $teamId => $team) {
#print("==============" . $teamId . "===============<br>\n");
  $teams[$teamId]['teamTS'] = new Team();
  foreach ($teams[$teamId]['players'] as $playerId => $player) {
    $players[$teamId][$playerId]->name = $player['name'];
    $players[$teamId][$playerId]->playerTS = new Player($player['name']);
    $players[$teamId][$playerId]->ratingTS = new Rating(
      $player['skill']['sigma'], # TODO: ['rating']['mean'] (in main JS controller)
      $player['skill']['mu'], # TODO: ['rating']['standardDeviation'] (in main JS controller)
      Rating::CONSERVATIVE_STANDARD_DEVIATION_MULTIPLIER
    );
    $teams[$teamId]['teamTS']->addPlayer(
      $players[$teamId][$playerId]->playerTS,
      $players[$teamId][$playerId]->ratingTS
    );
  }
  $teamsTS = $teamsTS ?
    Teams::concat($teamsTS, $teams[$teamId]['teamTS']) :
    $teams[$teamId]['teamTS']
  ;
#  $ranking[] = $teams[$teamId]['score']; # negate scores to get rank
#print_r($teamsTS); print "<br>\n";
#print_r($teamId); print "<br>\n";
#print_r($ranking); print "<br>\n";
#print("==============" . "<br>\n");
}
#$ranking[0] = 2;
#$ranking[1] = 1;

#print_r($teams); print "--------<br>\n";

$newRatingsWinLoseTS = $calculatorTS->calculateNewRatings($gameInfoTS, $teamsTS, array(1, 2));

foreach ($teams as $teamId => $team) {
  foreach ($teams[$teamId]['players'] as $playerId => $player) {
    $rating = $newRatingsWinLoseTS->getRating($players[$teamId][$playerId]->playerTS);
#print "name: " . $players[$teamId][$playerId]->name . ": " . $rating->getMean() . "<br>\n";
    $response[] = array(
      'id' => $playerId,
      'name' => $players[$teamId][$playerId]->name,
      'rating' => array(
        'sigma' => $rating->getMean(),
        'mu' => $rating->getStandardDeviation(),
      ),
    );
  }
}
#exit;

if ($callback) {
  header('Content-Type: text/javascript; charset='.$charset);
  header('Access-Control-Max-Age: 3628800');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  #header('Access-Control-Allow-Origin: ...'); # we do not set Access-Control-Allow-Origin
  echo $callback . "(" . json_encode($response) . ")";
} else {
  header('Content-Type: application/json; charset='.$charset);
  echo $response;
}

?>