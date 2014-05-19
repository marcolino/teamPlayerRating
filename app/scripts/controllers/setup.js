'use strict';

app.controller('SetupCtrl', function ($scope, playersFactory) {

  $scope.team1 = [];
  $scope.team2 = [];
  $scope.sports = [];
  //$scope.players = [];
  $scope.players = playersFactory.getAllplayers();
  console.info($scope.players);

  //fireService.setListToScope($scope, 'players');
  $scope.newPlayer = { name: 'me' };

  $scope.addPlayer = function() {
    console.log("setup: addPlayer()");
    console.info($scope.newPlayer);
    playersFactory.addPlayer($scope.newPlayer);
    $scope.newPlayer = { name: 'me', text: 'NEW' };
    //$scope.newPlayer.text = 'NEW';
  };
/*
  $scope.removePlayer = function(id) {
    console.log("setup: addNewPlayer()");
    fireService.removeItem(id);
  };
  $scope.removeAll = function() {
    fireService.removeAll();
  };
*/
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
  $scope.setup = function () {
    $scope.sports = [
      { 'name': 'Calcio a 5', 'players': 5 },
      { 'name': 'Calcio a 7', 'players': 7 },
      { 'name': 'Calcio a 8', 'players': 8 },
      { 'name': 'Calcio',     'players': 11 },
      { 'name': 'Rugby',      'players': 15 },
    ];
    $scope.load();
    // JUST TO DEBUG...
    if ($scope.players === null) {
      $scope.players = [
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
      // put the object to storage
      $scope.store();
    }
    //

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