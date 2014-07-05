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

$callback = isset($_GET['callback']) ? $_GET['callback'] : null;
$teams = isset($_GET['teams']) ? $_GET['teams'] : null;

$calculatorTS = new TwoTeamTrueSkillCalculator();
$gameInfoTS = new GameInfo();
$teamsTS = null;
$ranking = null;

foreach ($teams as $teamId => $team) {
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
  $ranking[] = - $teams[$teamId]['score']; # negate scores to get rank
}

$newRatingsWinLoseTS = $calculatorTS->calculateNewRatings($gameInfoTS, $teamsTS, $ranking);

foreach ($teams as $teamId => $team) {
  foreach ($teams[$teamId]['players'] as $playerId => $player) {
    $rating = $newRatingsWinLoseTS->getRating($players[$teamId][$playerId]->playerTS);
    $response[] = array(
      # TODO: think of a better response format... (in main JS controller)
      $players[$teamId][$playerId]->name => array(
        'sigma' => $rating->getMean(),
        'mu' => $rating->getStandardDeviation(),
      )
    );
  }
}

if ($callback) {
  header('Content-Type: text/javascript; charset=utf8');
  #header('Access-Control-Allow-Origin: ...'); # TODO: set Access-Control-Allow-Origin ?
  header('Access-Control-Max-Age: 3628800');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  echo $callback . "(" . json_encode($response) . ")";
} else {
  header('Content-Type: application/json; charset=utf8');
  echo $response;
}

?>