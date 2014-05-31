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
  })
.directive('limitTextLength', function() {
  return function(scope, element, attrs) {
    var maxlen = attrs.len;
console.info('maxlen:', maxlen);
//console.info(element);
//console.info(element.children().children());
    var el = element.children().children();//.find​("[id^=player]");
//console.info(el.html());
//console.info('Name of player ' + el.id + ' width: ', el[0].childNodes[0].textContent.width());
    if (0 || el.width() > maxlen) { // check text width is not too much
      while (el.width() > maxlen) {
console.info(el.width());
        var nameTruncated = el.html();
        nameTruncated = nameTruncated.substring(0, nameTruncated.length - 1);
        el.html(nameTruncated);
      }
      el.append('&hellip;');
console.info(el.html());
    }
  };
})
  ;
/*
  .config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
      // todo start the spinner here
      $('#loading').show();
      return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
  })
  // register the interceptor as a service, intercepts ALL angular ajax http calls
  .factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
      return promise.then(function (response) {
        // hide the spinner on success
        $('#loading').hide();
        return response;
      }, function (response) {
        // hide the spinner on error
        $('#loading').hide();
        return $q.reject(response);
      });
    };
  })
*/

app.run(function (stateFactory) {
  stateFactory.match = {};
  stateFactory.match.date = new Date();
  stateFactory.match.status = 'starting';
  stateFactory.teams = {};
});