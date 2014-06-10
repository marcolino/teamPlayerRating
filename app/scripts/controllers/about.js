'use strict';

app.controller('AboutCtrl', function ($scope) {
  $scope.title = 'Team player rating system';
  $scope.author = {};
  $scope.author.name = 'Marco Solari';
  $scope.author.email = 'marcosolari@gmail.com';
  $scope.description = '... TrueSkill<sup>&reg;</sup> ...';
});