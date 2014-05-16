'use strict';

app.controller('SetupCtrl', function ($scope) {

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

  $scope.colors = [
    {name:'black', shade:'dark'},
    {name:'white', shade:'light'},
    {name:'red', shade:'dark'},
    {name:'blue', shade:'dark'},
    {name:'yellow', shade:'light'}
  ];
  $scope.myColor = $scope.colors[2]; // red
});