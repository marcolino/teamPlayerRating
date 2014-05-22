'use strict';

app.controller('NavCtrl', function ($scope, $location) {
  $scope.isCollapsed = true;
  $scope.$on('$routeChangeSuccess', function () {
    $scope.isCollapsed = true;
  });
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
});