'use strict';

app.controller('SetupCtrl', function ($scope, stateFactory, sportFactory, playerFactory) {
  $scope.match = stateFactory.match;
  $scope.teams = stateFactory.teams;
  $scope.players = stateFactory.players;
console.log('setup - $scope.teams:', $scope.teams);
/*
  $scope.$watch('match', function (newVal, oldVal) {
    $scope.match = newVal;
  });
  $scope.$watch('teams', function (newval, oldval) {
    $scope.teams = newval;
console.log('setup watch - $scope.teams:', $scope.teams);
  });
*/

//  $scope.teams = {};
  $scope.sports = sportFactory.all;
  $scope.players = playerFactory.all;
  //$scope.players = playerFactory.all;
  //console.info('$scope.players', $scope.players);

  $scope.sports.$on('loaded', function() { 
    //console.info('Sports loaded.');
    $scope.sports = sportFactory.all;
    if ($scope.sports.$value === null) {
      console.info("$scope.sports.$value === null, POPULATING...");
      $scope.populateSports();
      $scope.sports = sportFactory.all;
    }
  });

  $scope.players.$on('loaded', function() { 
    //console.info('Players loaded.');
    $scope.players = playerFactory.all;
    if ($scope.players.$value === null) {
      console.info("$scope.players.$value === null, POPULATING...");
      $scope.populatePlayers();
      $scope.players = playerFactory.all;
    }
  });

  $scope.playerDefault = { name: '', skill: 50 };
  $scope.playerNew = angular.copy($scope.playerDefault);

  $scope.addPlayer = function() {
    console.log('setup: addPlayer(): ', $scope.playerNew);
    playerFactory.add($scope.playerNew);
    $scope.playerNew = angular.copy($scope.playerDefault);
  };

  $scope.removePlayer = function(id) {
    console.log('setup: removePlayer()');
    playerFactory.remove(id);
  };
  $scope.removeAll = function() {
    console.log('setup: removeAll()');
    playerFactory.delete();
  };

  $scope.populateSports = function() {
    console.info('POPULATING SPORTS');
    $scope.sportsDefault = [
      { 'name': 'Calcio a 5', 'playersMax': 5 },
      { 'name': 'Calcio a 7', 'playersMax': 7 },
      { 'name': 'Calcio a 8', 'playersMax': 8 },
      { 'name': 'Calcio',     'playersMax': 11 },
      { 'name': 'Rugby',      'playersMax': 15 },
    ];
    // store the object
    $scope.sportsDefault.forEach(function(sport) {
      sportFactory.add(sport);
    });
  };

  $scope.populatePlayers = function() {
    console.info('POPULATING PLAYERS');
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
      { 'name': 'Nordin',    'skill': 50 },
      { 'name': 'Hermes',    'skill': 50 },
      { 'name': 'Cavallero', 'skill': 50 },
      { 'name': 'Aleandro',  'skill': 50 }
    ];
    // store the object
    $scope.playersDefault.forEach(function(player) {
      console.log('player:', player);
      playerFactory.add(player);
    });
  };

});