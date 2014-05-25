'use strict';

app.controller('SetupCtrl', function ($scope, stateFactory, sportFactory, playerFactory) {
  $scope.match = stateFactory.match;
  //$scope.s = stateFactory.state;
  $scope.$watch('match', function (newVal, oldVal) {
    console.info('SETUP WATCH - new state:', newVal, 'old state:', oldVal);
    $scope.match = newVal;
  });

  $scope.teams = {};

  $scope.team1 = [];
  $scope.team2 = [];

  $scope.sports = sportFactory.all;
  $scope.players = playerFactory.all;
  //$scope.players = playerFactory.all;
  //console.info('$scope.players', $scope.players);

  $scope.sports.$on('loaded', function() { 
    console.info('Sports loaded.');
    $scope.sports = sportFactory.all;
    console.info($scope.sports);
    if (0) { // TODO: how to check if sports are empty?
      $scope.populateSports();
      $scope.sports = sportFactory.all;
    }
  });

  $scope.players.$on('loaded', function() { 
    console.info('Players loaded.');
    $scope.players = playerFactory.all;
    if (0) { // TODO: how to check if players are empty?
      $scope.populatePlayers();
      $scope.players = playerFactory.all;
    }
  });

/*
    //console.info('$scope.allPlayers', playerFactory.allPlayers());
    var keys = $scope.players.$getIndex();
    console.info('keys:', keys);
    ["-JNOkKzl7CEGb-hY1PVG"].forEach(function(element) {
      //$scope.messages.push("Test for " + element + ": " + (keys.indexOf(element) !== -1));
      console.info("Test for " + element + ": " + (keys.indexOf(element) !== -1));
    });
*/

  /*
  function clone(obj) {
    var target = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
    return target;
  }
  */

  $scope.playerDefault = { name: '', drag: true, skill: 50 };
  //$scope.playerNew = clone($scope.playerDefault);
  $scope.playerNew = angular.copy($scope.playerDefault);

  $scope.addPlayer = function() {
    console.log('setup: addPlayer(): ', $scope.playerNew);
    playerFactory.add($scope.playerNew);
    //$scope.playerNew = clone($scope.playerDefault);
    $scope.playerNew = angular.copy($scope.playerDefault);
  };

  $scope.removePlayer = function(id) {
    console.log('setup: removePlayer()');
    playerFactory.remove(id);
  };
  $scope.removeAll = function() {
    playerFactory.delete();
  };

  $scope.populateSports = function() {
    console.info('NO SPORTS, POPULATING...');
    $scope.sportsDefault = [
      { 'name': 'Calcio a 5', 'players': 5 },
      { 'name': 'Calcio a 7', 'players': 7 },
      { 'name': 'Calcio a 8', 'players': 8 },
      { 'name': 'Calcio',     'players': 11 },
      { 'name': 'Rugby',      'players': 15 },
    ];
    // store the object
    $scope.sportsDefault.forEach(function(sport) {
      sportFactory.add(sport);
    });
  };

  $scope.populatePlayers = function() {
    console.info('NO PLAYERS, POPULATING...');
    $scope.playersDefault = [
      { 'name': 'Frinks',    'skill': 50 },
      { 'name': 'Lucio',     'skill': 50 },
      { 'name': 'Soletta',   'skill': 50 },
      { 'name': 'Paoloalgo', 'skill': 50 },
      { 'name': 'Marcotono', 'skill': 50 },
      { 'name': 'Attila',    'skill': 50 },
      { 'name': 'Puntone',   'skill': 50 },
      { 'name': 'Bonnie',    'skill': 50 },
      { 'name': 'Remi',      'skill': 50 },
      { 'name': 'Grigio',    'skill': 50 },
      { 'name': 'Mosso',     'skill': 50 },
      { 'name': 'Nordin',    'skill': 50 }
    ];
    // store the object
    $scope.playersDefault.forEach(function(player) {
      console.log('player:', player);
      playerFactory.add(player);
    });
  };

});