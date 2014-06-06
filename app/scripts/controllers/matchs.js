'use strict';

app.controller('MatchsCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, matchFactory, notificationFactory, sysFactory, spinnerFactory) {
  var share = stateFactory;
  $scope.share = share;

  $scope.init = function () { // first load
    if (!share.matchsInitialized) {
      console.info(' * INITIALIZING');
      if (!share.spinner) {
        share.spinner = spinnerFactory;
        share.spinner.show();
      }

      share.main = {};
      share.main.dateFormat = 'yyyy-MM-dd'; // TODO: why need to be set here and also in main.js? Put this in shareFactory?

      share.sports = sportFactory.all;
      share.players = playerFactory.all;
      share.matchs = matchFactory.all;

      share.matchsEditMode = false;
      share.matchsCollapsed = true;
      share.matchsOrderByPredicate = 'date';

      share.matchs.$on('loaded', function () {
        share.spinner.hide();
        console.info(share.matchs);
      });

      share.matchsInitialized = true;
    } else {
      share.spinner.hide();
    }
  };

  $scope.matchUpdate = function (id, match) {
    if (match && !match.name) {
      notificationFactory.warning('Name can\'t be empty. To remove a match please use trash button.');
      return false;
    }
    share.matchs[id].editMode = !share.matchs[id].editMode;
    match.editMode = !match.editMode;
    matchFactory.set(id, match);

    if (share.matchs[id].editMode) {
      share.matchEdit = angular.copy(match);
    }

    return true;
  };

  $scope.matchRemove = function (id) {
    matchFactory.remove(id);
  };

  $scope.matchsRemoveAll = function () {
    matchFactory.remove();
  };

  $scope.goto = function (route) {
    $location.path(route);
  };

  $scope.toggleCollapse = function () {
    share.matchsCollapsed = !share.matchsCollapsed;
    console.info('share.matchsCollapsed:', share.matchsCollapsed);
  };

/*
  $scope.matchToggleEditMode = function (id) {
    share.matchs[id].editMode = !share.matchs[id].editMode;
/ *
    if (share.matchs[id].editMode) {
      share.matchEdit = angular.copy(match);
    }
* /
  };
*/

  $scope.init();

});