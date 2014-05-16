'use strict';

app.controller('MainCtrl', function ($scope, $timeout) {
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
      { 'name': 'Nordin',    'drag': true }
    ];

    // limit items to be dropped in list1
    $scope.optionsList1 = {
      accept: function(dragEl) {
        if ($scope.team1.length >= 5) {
          return false;
        } else {
          return true;
        }
      }
    };
  });