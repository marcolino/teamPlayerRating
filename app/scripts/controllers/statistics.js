'use strict';

app.controller('StatisticsCtrl', function ($scope, stateFactory) {
  var share = stateFactory;
  $scope.share = share;
});