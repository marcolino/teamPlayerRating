'use strict';

app.controller('SetupCtrl', function($scope, sportFactory, playerFactory) {
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
    if (0) {
      $scope.populateSports();
      $scope.sports = sportFactory.all;
    }
  });

  $scope.players.$on('loaded', function() { 
    console.info('Players loaded.');
    $scope.players = playerFactory.all;
    if (0) {
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
      { 'name': 'Frinks',    'drag': true },
      { 'name': 'Lucio',     'drag': true },
      { 'name': 'Soletta',   'drag': true },
      { 'name': 'Paoloalgo', 'drag': true },
      { 'name': 'Marcotono', 'drag': true },
      { 'name': 'Attila',    'drag': true },
      { 'name': 'Puntone',   'drag': true },
      { 'name': 'Bonnie',    'drag': true },
      { 'name': 'Remi',      'drag': true },
      { 'name': 'Grigio',    'drag': true },
      { 'name': 'Mosso',     'drag': true },
      { 'name': 'Nordin',    'drag': true }
    ];
    // store the object
    $scope.playersDefault.forEach(function(player) {
      console.log('player:', player);
      playerFactory.add(player);
    });
  };

});

/*
var MainCtrl = function($scope, fireService) {
  itemService.setListToScope($scope, 'items');
  $scope.newItem = {};

  $scope.addNewItem = function() {
    itemService.addItem($scope.newItem);
    $scope.newItem = {};
  };
  $scope.deleteItem = function(id){
    itemService.deleteItem(id);
  };
  $scope.removeAll = function() {
    itemService.removeAll(); 
  };
};
*/

/*
    $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light'},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark'},
      {name:'yellow', shade:'light'}
    ];
    $scope.myColor = $scope.colors[2]; // red
  };

  $scope.addPlayer = function(name) {
    console.info(name);
    $scope.players.push({ name: name, drag: true });
    $scope.store();
  };

  $scope.removePlayer = function() {
    $scope.store();
  };

  $scope.load = function() {
    var players = localStorageService.get('players');
    console.log(players);
    //$scope.players = players;
  };

  $scope.store = function() {
    localStorageService.remove(players);
    localStorageService.set('players', JSON.stringify($scope.players));
  };

  $scope.setup();

*/