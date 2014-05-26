'use strict';

app.controller('MainCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, notificationFactory) {
  $scope.match = stateFactory.match;
  $scope.teams = stateFactory.teams;
  console.log('main - $scope.teams:', $scope.teams);
/*
  $scope.$watch('match', function (newval, oldval) {
    $scope.match = newval;
  });
  $scope.$watch('teams', function (newval, oldval) {
    $scope.teams = newval;
    console.log('main watch - $scope.teams:', $scope.teams);
  });
*/
  $scope.init = function () {
    if (objectLength($scope.teams) === 0) {
console.info("DOING INIT...");
      $scope.teams['A'] = { name: 'Oranges', selected: false };
      $scope.teams['B'] = { name: 'Blues', selected: false };
      $scope.teams['A']['players'] = {};
      $scope.teams['B']['players'] = {};
      $scope.teams.selected = null;
      $scope.teams.completed = false;
      $scope.teams.closed = false;

      $scope.match.sport = "Calcio a 5";

      $scope.sports = sportFactory.all;

      $scope.players = playerFactory.all;
    }
else {
  console.info("NOT DOING INIT...");
  console.info('$scope.teams:', $scope.teams);
}

    sportFactory.ref.on('value', function(snapshot) {
      var ids = snapshot.val();
      $scope.playersMax = ids[$scope.match.sport].players;
    });
    playerFactory.ref.on('value', function(snapshot) {
      var ids = snapshot.val();
      $scope.playersAvailable = angular.copy(ids);
    });
  };
  
  $scope.reset = function () {
    console.info("DOING RESET...");
    /*
    delete $scope.teams['A'].players;
    delete $scope.teams['A'];
    delete $scope.teams['B'].players;
    delete $scope.teams['B'];
    $scope.teams.selected = null;
    $scope.teams.completed = false;
    $scope.teams.closed = false;
    delete $scope.teams.selected;
    delete $scope.teams.completed;
    delete $scope.teams.closed;
    delete $scope.teams;
    */
    objectDelete($scope.teams);
    delete $scope.match;
    //delete $scope.sports;
    //delete $scope.players;
  };
  
  $scope.teamSelect = function (element) {
    if ($scope.teams.closed) {
      return false; // avoid selecting a team when teams are closed
    }
    var id = element.target.id;
    if (id) { // selected a team
      $scope.teamSetSelected(id);
      $scope.teams.selected = id.replace(/^team/, '');
    } else {
      var name = element.target.firstChild.data;
      if (name) { // selected a player in team to remove it
        var idParentTeam = element.target.parentElement.id.replace(/^team/, '');
        if (name in $scope.teams[idParentTeam].players) {
          $scope.playersAvailable[name] = $scope.teams[idParentTeam].players[name];
          delete $scope.teams[idParentTeam].players[name];
        }
        $scope.teams.completed = $scope.checkTeamsCompleted();
      } else { // this shouldn't happen...
        notificationFactory.error('Selected element in team with empty first child data: ', element.target.firstChild, ' !');
        return false;
      }
    }
    return true;
  };

  $scope.isTeamSelected = function (id) {
    return ($scope.teams.selected === id) || $scope.teams.closed;
  };

  $scope.playerSelect = function (element) {
    if ($scope.teams.closed) {
      return false; // avoid selecting a player when teams are closed
    }
    var name = element.target.firstChild.data;
    if (name) {
      if (!$scope.teams.selected) {
        notificationFactory.warning("Please select a team!");
        return false;
      }
      if (objectLength($scope.teams[$scope.teams.selected].players) >= $scope.playersMax) {
        notificationFactory.info('This team is "complete"');
        return false;
      }
      $scope.teams[$scope.teams.selected].players[name] = $scope.playersAvailable[name];
      delete $scope.playersAvailable[name];
    } else { // this shouldn't happen...
      notificationFactory.error('Empty name element target: ', element.target);
      return false;
    }
    $scope.teams.completed = $scope.checkTeamsCompleted();
    return true;
  };

  $scope.checkTeamsCompleted = function () {
    // check if all teams are completed
    if (
      (objectLength($scope.teams['A'].players) === $scope.playersMax) &&
      (objectLength($scope.teams['B'].players) === $scope.playersMax)
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
/*
    $("div[id^='team']").css({ opacity: '0.3' });
    $("input[id^='label-team']").css({ opacity: '0.3' });
    $("div[id='" + id + "']").css({ opacity: '1.0' });
    $("input[id='label-" + id + "']").css({ opacity: '1.0' });
*/
    //$scope.teamSelected = (id === 'teamA' ? $scope.teamA : $scope.teamB);
    $scope.teams.selected = $scope.teams[id.replace(/^team/, '')];
    console.info('Selected team ', id.replace(/^team/, ''));
  };

  $scope.teamsSetClosed = function () {
    $("div[id^='team']").css({ opacity: '1.0' });
    $("input[id^='label-team']").css({ opacity: '1.0' });
    $('input[id^="label-team"]').attr("disabled", true);
    $scope.teams.closed = true;
    console.info('Teams closed');
  };

  $scope.matchClose = function () {
    if (!$scope.teams.closed) {
      return;
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