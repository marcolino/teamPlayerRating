'use strict';

app.controller('AboutCtrl', function ($scope, stateFactory) {
  var share = stateFactory;
  $scope.share = share;
});