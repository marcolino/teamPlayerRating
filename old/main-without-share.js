'use strict';

app.controller('MainCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, notificationFactory) {
  var share = stateFactory;
  //$scope.match = stateFactory.match;
  //$scope.teams = stateFactory.teams;
  $scope.sports = stateFactory.sports;
  $scope.players = stateFactory.players;
  $scope.playersAvailable = share.playersAvailable;
  console.log('main - $scope.playersAvailable:', $scope.playersAvailable);

/*
  console.log('main - share.teams:', share.teams);
  $scope.$watch('match', function (newval, oldval) {
    share.match = newval;
  });
  $scope.$watch('teams', function (newval, oldval) {
    share.teams = newval;
  });
  $scope.$watch('playersAvailable', function (newval, oldval) {
    $scope.playersAvailable = newval;
    console.log('main - $scope.playersAvailable:', $scope.playersAvailable);
  });
*/

  $scope.init = function () {
    if (!share.teams.initialized) {
    //if (objectLength(share.teams) === 0) {
console.info("DOING INIT...");
      share.teams['A'] = { name: 'Oranges', selected: false };
      share.teams['B'] = { name: 'Blues', selected: false };
      share.teams['A']['players'] = {};
      share.teams['B']['players'] = {};
      share.teams.initialized = true;
      share.teams.selected = null;
      share.teams.completed = false;
      share.teams.closed = false;

      share.main.match.sport = "Calcio a 5";

      $scope.sports = sportFactory.all;

      $scope.players = playerFactory.all;

      sportFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        share.teams.playersMax = ids[share.main.match.sport].playersMax;
console.info('teams.playersMax:', share.teams.playersMax);
      });
      playerFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        $scope.playersAvailable = angular.copy(ids);
        share.playersAvailable = $scope.playersAvailable;
        console.log("COPYING PLAYERS TO PLAYERS AVAILABLE");
      });
    }
else {
  console.info("NOT DOING INIT...");
  console.info('share.teams:', share.teams);
}

  };
  
  $scope.reset = function () {
    console.info("DOING RESET...");
    /*
    delete share.teams['A'].players;
    delete share.teams['A'];
    delete share.teams['B'].players;
    delete share.teams['B'];
    share.teams.selected = null;
    share.teams.completed = false;
    share.teams.closed = false;
    delete share.teams.selected;
    delete share.teams.completed;
    delete share.teams.closed;
    delete share.teams;
    */
    share.teams.initialized = false;
    /*
    objectDelete(share.teams);
    objectDelete(share.match);
    objectDelete($scope.playersMax);
    objectDelete($scope.playersAvailable);
    */
  };
  
  $scope.teamSelect = function (element) {
    if ($scope.checkTeamsClosed()) {
    //if ($scope.teams.closed) {
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
          $scope.playersAvailable[name] = share.teams[idParentTeam].players[name];
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
    var name = element.target.firstChild.data;
    if (name) {
      if (!share.teams.selected) {
        notificationFactory.warning("Please select a team!");
        return false;
      }
      if (objectLength(share.teams[share.teams.selected].players) >= share.teams.playersMax) {
        notificationFactory.info('This team is "complete"');
        return false;
      }
console.info('share.teams[share.teams.selected].players[name]:', share.teams[share.teams.selected].players[name]);
      share.teams[share.teams.selected].players[name] = $scope.playersAvailable[name];
console.info('share.teams[share.teams.selected].players[name]:', share.teams[share.teams.selected].players[name]);
      delete $scope.playersAvailable[name];
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
    // check if all teams are completed
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
      share.teamsSetClosed();
    }
  };

  $scope.teamSetSelected = function (id) {
/*
    $("div[id^='team']").css({ opacity: '0.3' });
    $("input[id^='label-team']").css({ opacity: '0.3' });
    $("div[id='" + id + "']").css({ opacity: '1.0' });
    $("input[id='label-" + id + "']").css({ opacity: '1.0' });
*/
    //share.teamselected = (id === 'teamA' ? $scope.teamA : $scope.teamB);
    share.teams.selected = share.teams[id.replace(/^team/, '')];
    console.info('Selected team ', id.replace(/^team/, ''));
  };

  $scope.teamsSetClosed = function () {
/*
    $("div[id^='team']").css({ opacity: '1.0' });
    $("input[id^='label-team']").css({ opacity: '1.0' });
    $('input[id^="label-team"]').attr("disabled", true);
*/
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

  $scope.matchConfirm = function () {
    if (!share.teams.closed) {
      return false;
    }
    if (!$scope.checkMatchClosed()) {
      return false;
    }

    // TODO: update scores! ...

    $scope.reset();
    $location.path('/statistics');
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

});