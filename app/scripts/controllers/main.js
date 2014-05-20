'use strict';
app.controller('MainCtrl', function ($scope, playerFactory) {
  $scope.team1 = [];
  $scope.team2 = [];
 
  $scope.sports = [
    { 'name': 'Calcio a 5', 'players': 5 },
    { 'name': 'Calcio a 7', 'players': 7 },
    { 'name': 'Calcio a 8', 'players': 8 },
    { 'name': 'Calcio',     'players': 11 },
    { 'name': 'Rugby',      'players': 15 },
  ];

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
    { 'name': 'Nordin',    'skill': 99, 'drag': true },
    { 'name': 'Nordin2',    'skill': 99, 'drag': true },
    { 'name': 'Nordin3',    'skill': 99, 'drag': true },
    { 'name': 'Nordin4',    'skill': 99, 'drag': true },
    { 'name': 'Nordin5',    'skill': 99, 'drag': true }
  ];
console.log($scope.players);
  $scope.players = playerFactory.all;
console.log($scope.players);

/*
  angular.forEach($scope.players,
    function(player) {
      if (typeof player === 'object') {
        angular.forEach(player, function(o) {
          console.log(o);
        });
      }
    });
*/
/*
  for (var key in $scope.players) {
    if (typeof key === 'object') {
      console.log('object:', $scope.players[key]);
    }
  }
*/

  // limit items to be dropped in teams
  $scope.optionsTeam1 = {
    accept: function(/*dragEl*/) {
      if ($scope.team1.length >= 5) {
        return false;
      } else {
        return true;
      }
    }
  };
});