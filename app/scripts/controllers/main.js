'use strict';

app.controller('MainCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, notificationFactory, $timeout) {
  var share = stateFactory;
  $scope.share = share;

  $scope.init = function () {
    if (!share.initialized) {
      console.info("DOING INIT...");
      share.teams['A'] = { name: 'Oranges', selected: false };
      share.teams['B'] = { name: 'Blues', selected: false };
      share.teams['A']['players'] = {};
      share.teams['B']['players'] = {};
      share.teams.initialized = true;
      share.teams.selected = null;
      share.teams.completed = false;
      share.teams.closed = false;
      share.match.sport = 'Calcio a 5';
      share.sports = sportFactory.all;
      share.players = playerFactory.all;
      share.dateFormat = 'yyyy-MM-dd';

      sportFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        share.teams.playersMax = ids[share.match.sport].playersMax;
      });
      playerFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        share.playersAvailable = angular.copy(ids);
        //console.info(share.playersAvailable);
/*
        angular.forEach(share.playersAvailable, function(value, key) {
          console.info(value, key);
          console.info('Name of player ' + key + ' width: ',  $('#' + 'player-' + key).width());
        });
*/
      });
      share.initialized = true;
    } else { console.info("NOT DOING INIT..."); }
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
    // TODO: ...
  };

  function objectLength (obj) {
    var length = 0;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        ++length;
      }
    }
    return length;
  }

  function objectIsEmpty (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  function objectDelete (obj, stack) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] == 'object') {
          objectDelete(obj[prop], stack + '.' + prop);
          delete obj[prop];
        } else {
          console.log(prop + ": " + obj[prop]);
          delete obj[prop];
        }
      }
    }
  }

  $scope.init();


  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = false;
  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.disabled = function(date, mode) {
    //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    return false;
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': 0

  };

  //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  //$scope.format = 'DD, d MM, yy';

});