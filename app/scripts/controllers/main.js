'use strict';

app.controller('MainCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, notificationFactory, $timeout) {
  var share = stateFactory;
  $scope.share = share;

  $scope.init = function () { // first load
    if (!share.initialized) {
      share.spinner = new jSpinner();
      share.spinner.show();
 
      share.teams['A'] = { name: 'Oranges', selected: false };
      share.teams['B'] = { name: 'Blues', selected: false };
      share.teams['A']['players'] = {};
      share.teams['B']['players'] = {};
      share.teams.initialized = true;
      share.teams.selected = null;
      share.teams.completed = false;
      share.teams.closed = false;
      share.match.sport = 'Calcio a 5';
      share.match.dateFormat = 'yyyy-MM-dd';
      share.match.dateOptions = {};
      share.match.dateOptions['starting-day'] = 1;
      share.match.dateOptions['showWeeks'] = 0;
      share.sports = sportFactory.all;
      share.players = playerFactory.all;

      sportFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        share.teams.playersMax = ids[share.match.sport].playersMax;
      });
      playerFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        share.playersAvailable = angular.copy(ids);
        share.spinner.hide();
      });
      share.initialized = true;
    } else {
      share.spinner.hide();
    }
  };
  
  $scope.reset = function () {
    share.initialized = false;
  };
  
  $scope.teamSelect = function (element) {
    if ($scope.checkTeamsClosed()) {
      return false; // avoid selecting a team when teams are closed
    }
    var id = element.target.id;
    if (id) { // selected a team
      $scope.teamSetSelected(id);
      share.teams.selected = id.replace(/^team/, '');
    } else {
      var name = element.target.firstChild.data;
      if (name) { // selected a player in team to remove it
        var idParentTeam = element.target.parentElement.id.replace(/^team/, '');
        if (name in share.teams[idParentTeam].players) {
          share.playersAvailable[name] = share.teams[idParentTeam].players[name];
          delete share.teams[idParentTeam].players[name];
        }
        share.teams.completed = $scope.checkTeamsCompleted();
      } else { // this shouldn't happen...
        notificationFactory.error('Selected element in team with empty first child data: ', element.target.firstChild, ' !');
        return false;
      }
    }
    return true;
  };

  $scope.isTeamSelected = function (id) {
    return (share.teams.selected === id) || share.teams.closed;
  };

  $scope.playerSelect = function (element) {
    if ($scope.checkTeamsClosed()) {
      return false; // avoid selecting a player when teams are closed
    }
    var name = element.currentTarget.firstElementChild.innerHTML;
    if (name) {
      if (!share.teams.selected) {
        notificationFactory.warning("Please select a team!");
        return false;
      }
      if (objectLength(share.teams[share.teams.selected].players) >= share.teams.playersMax) {
        notificationFactory.info('This team is "complete"');
        return false;
      }
      share.teams[share.teams.selected].players[name] = share.playersAvailable[name];
      delete share.playersAvailable[name];
    } else { // this shouldn't happen...
      notificationFactory.error('Empty name element target: ', element.target);
      return false;
    }
    share.teams.completed = $scope.checkTeamsCompleted();
    return true;
  };

  $scope.checkTeamsClosed = function () {
    return share.teams.closed;
  };

  $scope.checkTeamsCompleted = function () {
    if (
      (objectLength(share.teams['A'].players) === share.teams.playersMax) &&
      (objectLength(share.teams['B'].players) === share.teams.playersMax)
    ) {
      console.info('All teams are complete');
      return true;
    }
    return false;
  };

  $scope.teamsClose = function () {
    if ($scope.checkTeamsCompleted()) {
      $scope.teamsSetClosed();
    }
  };

  $scope.teamSetSelected = function (id) {
    share.teams.selected = share.teams[id.replace(/^team/, '')];
    console.info('Selected team ', id.replace(/^team/, ''));
  };

  $scope.teamsSetClosed = function () {
    share.teams.closed = true;
    console.info('Teams closed');
  };

  $scope.checkMatchClosed = function () {
    if (
      (typeof share.teams['A'].score == 'undefined') ||
      (typeof share.teams['B'].score == 'undefined')
    ) {
      return false;
    }
    return true;
  };

  $scope.checkMatchConfirmed = function () {
    return share.match.confirmed;
  };

  $scope.matchConfirm = function () {
    if (!share.teams.closed) {
      return false;
    }
    if (!$scope.checkMatchClosed()) {
      return false;
    }

    $scope.updateScores();

    $location.path('/statistics');
    $timeout(function () {
      share.match.confirmed = true;
    }, 0, false);
  };

  $scope.updateScores = function () {
    // TODO: ... :-)
  };

  $scope.matchDateDisabled = function(date, mode) {
    //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    return false;
  };

  $scope.matchDateOpen = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.init();

});