'use strict';

app.controller('MainCtrl', function ($scope, $timeout) {
    $scope.team1 = [];
    $scope.team2 = [];
   
    $scope.players = [
      { 'title': 'Frinks',    'drag': true },
      { 'title': 'Lucio',     'drag': true },
      { 'title': 'Soletta',   'drag': true },
      { 'title': 'Paoloalgo', 'drag': true },
      { 'title': 'Marcotono', 'drag': true },
      { 'title': 'Attila',    'drag': true },
      { 'title': 'Puntone',   'drag': true },
      { 'title': 'Bonnie',    'drag': true },
      { 'title': 'Remi',      'drag': true },
      { 'title': 'Grigio',    'drag': true },
      { 'title': 'Mosso',     'drag': true },
      { 'title': 'Nordin',    'drag': true }
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