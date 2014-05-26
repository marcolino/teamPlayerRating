'use strict';

app.controller('StatisticsCtrl', function ($scope, stateFactory) {
  $scope.match = stateFactory.match;
  $scope.teams = stateFactory.teams;
console.log('statistics - $scope.teams:', $scope.teams);
/*
  $scope.$watch('match', function (newVal, oldVal) {
    $scope.match = newVal;
  });
  $scope.$watch('teams', function (newval, oldval) {
    $scope.teams = newval;
console.log('statistics watch - $scope.teams:', $scope.teams);
  });
*/
});