'use strict';

app.controller('SetupCtrl', function ($scope) {
  $scope.colors = [
    {name:'black', shade:'dark'},
    {name:'white', shade:'light'},
    {name:'red', shade:'dark'},
    {name:'blue', shade:'dark'},
    {name:'yellow', shade:'light'}
  ];
  $scope.myColor = $scope.colors[2]; // red
});