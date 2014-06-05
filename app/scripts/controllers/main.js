'use strict';

app.controller('MainCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, matchFactory, notificationFactory, sysFactory, spinnerFactory) {
  var share = stateFactory;
  $scope.share = share;

  $scope.init = function () { // first load
    if (!share.initialized) {
      if (!share.spinner) {
        share.spinner = spinnerFactory;
        share.spinner.show();
      }
      share.main = {};
      share.main.teamsInitialized = true;
      share.main.teamSelected = null;
      share.main.teamsCompleted = false;
      share.main.teamsClosed = false;
      share.main.matchConfirmed = false;
      share.main.dateFormat = 'yyyy-MM-dd';
      share.main.dateOptions = {};
      share.main.dateOptions['starting-day'] = 1;
      share.main.dateOptions['showWeeks'] = 0;
      share.main.sports = sportFactory.all;
      //share.players = playerFactory.all;
      share.match = {};
      //share.match.date;
      share.match.date = new Date();
      share.match.teams = {};
      share.match.teams['A'] = {
        name: 'Oranges',
        score: -1,
        players: {}
      };
      share.match.teams['B'] = {
        name: 'Blues',
        score: -1,
        players: {}
      };
      console.info('IN share.match.teams[A]', share.match.teams['A']);

/*
      sportFactory.ref.on('value', function() {
        share.main.sportselected = sportFactory.isSelected();
      });
*/
      playerFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        share.playersAvailable = angular.copy(ids);
        share.spinner.hide();
      });
      share.mainInitialized = true;
    }
  };
  
  $scope.reset = function () {
    share.mainInitialized = false;
  };
  
  $scope.teamSelect = function (event) {
    if ($scope.teamsCheckClosed()) {
      return false; // avoid selecting a team when teams are closed
    }
    var id = event.target.id;
    id = id.replace(/^label-/, ''); // could come from a label
    if (id) { // selected a team
      $scope.teamSetSelected(id);
      share.main.teamSelected = id.replace(/^team/, '');
    } else {
      var name = event.target.firstChild.data;
      if (name) { // selected a player in team to remove it
        var idParentTeam = event.target.parentElement.id.replace(/^team/, '');
        angular.forEach(share.match.teams[idParentTeam].players, function(value, key) {
          if (value.name === name) {
            share.playersAvailable[key] = share.match.teams[idParentTeam].players[key];
            delete share.match.teams[idParentTeam].players[key];
          } else { // this shouldn't happen...
            notificationFactory.error('Selected element name not found in team', idParentTeam, '!');
            return false;
          }
        });
        share.main.teamsCompleted = $scope.teamsCheckCompleted();
      } else { // this shouldn't happen...
        notificationFactory.error('Selected element in team with empty first child data: ', event.target.firstChild, '!');
        return false;
      }
    }
    return true;
  };

  $scope.isTeamSelected = function (id) {
    return (share.main.teamSelected === id); // || share.main.teamsClosed;
  };

  $scope.playerSelect = function (element) {
    if ($scope.teamsCheckClosed()) {
      return false; // avoid selecting a player when teams are closed
    }
    var name = element.currentTarget.firstElementChild.innerHTML;
    if (name) {
      if (!share.main.teamSelected) {
        notificationFactory.warning('Please select a team!');
        return false;
      }
      console.log('share.main.teamSelected:', share.main.teamSelected);
      console.log('$scope.sportSelectedPlayersMax():', $scope.sportSelectedPlayersMax());
      if (sysFactory.objectLength(share.match.teams[share.main.teamSelected].players) >= $scope.sportSelectedPlayersMax()) {
        notificationFactory.info('This team is complete');
        return false;
      }
      var id = playerFactory.findByProperty('name', name);
      if (!id) {
        // this shouldn't happen...
        notificationFactory.error('Selected player name "', name, '" not found!');
        return false;
      }
      share.match.teams[share.main.teamSelected].players[id] = share.playersAvailable[id];
      delete share.playersAvailable[id];
    } else { // this shouldn't happen...
      notificationFactory.error('Empty name element target: ', element.target);
      return false;
    }
    share.main.teamsCompleted = $scope.teamsCheckCompleted();
    if (!share.main.teamsCompleted && sysFactory.objectLength(share.playersAvailable) === 0) {
      notificationFactory.warning('The number of players is insufficient to play a match. Please add some players!');
    }
    return true;
  };

  $scope.teamsCheckClosed = function () {
    return share.main.teamsClosed;
  };

  $scope.teamsCheckCompleted = function () {
    if (
      (sysFactory.objectLength(share.match.teams['A'].players) === $scope.sportSelectedPlayersMax()) &&
      (sysFactory.objectLength(share.match.teams['B'].players) === $scope.sportSelectedPlayersMax())
    ) {
      console.info('All teams are complete');
      return true;
    }
    return false;
  };

  $scope.teamsClose = function () {
    if ($scope.teamsCheckCompleted()) {
      $scope.teamsSetClosed();
    }
  };

  $scope.teamSetSelected = function (id) {
    share.main.teamSelected = share.match.teams[id.replace(/^team/, '')];
    console.info('Selected team with id', id);
  };

  $scope.teamsSetClosed = function () {
    share.main.teamsClosed = true;
    console.info('Teams closed');
  };

  $scope.matchCheckClosed = function () {
    console.info('CC share.match.teams[A]', share.match.teams['A']);
    return (
      (typeof share.match.teams['A'].score !== 'undefined') &&
      (typeof share.match.teams['B'].score !== 'undefined')
    );
  };

  $scope.matchCheckConfirmed = function () {
    return share.main.matchConfirmed;
  };

  $scope.matchConfirm = function () {
    if (!share.main.teamsClosed) {
      return false;
    }
    if (!$scope.matchCheckClosed()) {
      return false;
    }

    $scope.updateScores();
    /* TODO: but, shoul use promise / then... to keep $location.path() and share.main.matchConfirmed here...
    $scope.updateScores().then(function (id) {
      $location.path('/statistics');
      share.main.matchConfirmed = true;
    });
    */
  };

  $scope.updateScores = function () {
    // TODO: ... :-)

    //var match = {};
    //match.date = share.match.date;

    // TODO: move share.match.teams to share.match.teams ...
    //share.match.teams = [];
    //share.match.teams['A'] = share.match.teams['A'];
    //share.match.teams['B'] = share.match.teams['B'];

    matchFactory.add(share.match).then(function (id) {
      console.info('added match id:', id);
      share.main.matchConfirmed = true;
      $location.path('/statistics');
    });

  };

  $scope.matchDateDisabled = function(/*date, mode*/) {
    //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    return false;
  };

  $scope.matchDateOpen = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.sportSelected = function () { // TODO: directly use sportFactory.isSelected(); (or rename it sportFactory.selected(); )
    // return selected sport
    return sportFactory.isSelected();
  };

  $scope.sportSelectedPlayersMax = function() {
    var sport = $scope.sportSelected();
    var ret = 0;
    angular.forEach(share.main.sports, function(value) {
      if (value.name === sport) {
        ret = parseInt(value.playersMax);
      }
    });
    return ret;
  };

  $scope.init();

});