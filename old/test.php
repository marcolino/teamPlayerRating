<?php
/**
 * Get a match in input and respond with new ratings JSON
 */
require_once(dirname(__FILE__) . "/../../Skills/GameInfo.php");
require_once(dirname(__FILE__) . "/../../Skills/Player.php");
require_once(dirname(__FILE__) . "/../../Skills/Rating.php");
require_once(dirname(__FILE__) . "/../../Skills/Team.php");
require_once(dirname(__FILE__) . "/../../Skills/Teams.php");
require_once(dirname(__FILE__) . "/../../Skills/SkillCalculator.php");
require_once(dirname(__FILE__) . "/../../Skills/TrueSkill/TwoTeamTrueSkillCalculator.php");

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
      # TODO: think of a better response format...
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

/*
$player1a = new Player($playersA[0]->name);
$player2a = new Player($playersA[1]->name);
$player3a = new Player($playersA[2]->name);
$player4a = new Player($playersA[3]->name);
$player5a = new Player($playersA[4]->name);

$player1b = new Player($playersB[0]->name);
$player2b = new Player($playersB[1]->name);
$player3b = new Player($playersB[2]->name);
$player4b = new Player($playersB[3]->name);
$player5b = new Player($playersB[4]->name);

$team1 = new Team();
$team1->addPlayer($player1a, $gameInfo->getDefaultRating());
$team1->addPlayer($player2a, $gameInfo->getDefaultRating());
$team1->addPlayer($player3a, $gameInfo->getDefaultRating());
$team1->addPlayer($player4a, $gameInfo->getDefaultRating());
$team1->addPlayer($player5a, $gameInfo->getDefaultRating());

$team2 = new Team();
$team2->addPlayer($player1b, $gameInfo->getDefaultRating());
$team2->addPlayer($player2b, $gameInfo->getDefaultRating());
$team2->addPlayer($player3b, $gameInfo->getDefaultRating());
$team2->addPlayer($player4b, $gameInfo->getDefaultRating());
$team2->addPlayer($player5b, $gameInfo->getDefaultRating());

$teams = Teams::concat($team1, $team2);

$newRatingsWinLose = $calculatorTS->calculateNewRatings($gameInfoTS, $teamsTS, array(1, 2));

$response =
"[" .
  "{ '" . $playersA[0]->name . "': {" . $newRatingsWinLose->getRating($player1a) . "}}," .
  "{ '" . $playersA[1]->name . "': {" . $newRatingsWinLose->getRating($player2a) . "}}," .
  "{ '" . $playersA[2]->name . "': {" . $newRatingsWinLose->getRating($player3a) . "}}," .
  "{ '" . $playersA[3]->name . "': {" . $newRatingsWinLose->getRating($player4a) . "}}," .
  "{ '" . $playersA[4]->name . "': {" . $newRatingsWinLose->getRating($player5a) . "}}," .
  "{ '" . $playersB[0]->name . "': {" . $newRatingsWinLose->getRating($player1b) . "}}," .
  "{ '" . $playersB[1]->name . "': {" . $newRatingsWinLose->getRating($player2b) . "}}," .
  "{ '" . $playersB[2]->name . "': {" . $newRatingsWinLose->getRating($player3b) . "}}," .
  "{ '" . $playersB[3]->name . "': {" . $newRatingsWinLose->getRating($player4b) . "}}," .
  "{ '" . $playersB[4]->name . "': {" . $newRatingsWinLose->getRating($player5b) . "}}," .
"]";
$response = preg_replace("/=/", ":", $response);
#print_r($response); exit;

*/
?>