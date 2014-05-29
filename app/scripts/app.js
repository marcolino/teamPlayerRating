'use strict';

var app = angular.module('teamplayerratingApp', [
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'firebase'
  ])
  .constant('FIREBASE_URL', 'https://teamplayerrating.firebaseio.com')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/setup', {
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl'
      })
      .when('/statistics', {
        templateUrl: 'views/statistics.html',
        controller: 'StatisticsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run(function (stateFactory) {
  stateFactory.match = {};
  stateFactory.match.date = new Date();
  stateFactory.match.status = 'starting';
  stateFactory.teams = {};
});