'use strict';

app.controller('MainCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, notificationFactory) {
  //$scope.s = stateFactory.state;
  $scope.match = stateFactory.match;
  $scope.$watch('match', function (newVal, oldVal) {
    console.info('SETUP WATCH - new state:', newVal, 'old state:', oldVal);
    $scope.match = newVal;
  });
/*
  $scope.setup = function() {
    $scope.s.match = {};
    $scope.s.match.status = 'starting';
  };
*/
  $scope.teamA = [];
  $scope.teamB = [];
  $scope.teamAname = 'Oranges';
  $scope.teamBname = 'Blues';
  $scope.teamAresult = '';
  $scope.teamBresult = '';
  $scope.teamSelected = null;
  $scope.teamsCompleted = false;
  $scope.teamsClosed = false;
  $scope.sportSelected = "Calcio a 5";
  $scope.sports = sportFactory.all;
  $scope.players = playerFactory.all;
  
  //$scope.players.$bind($scope, "modelName"); // 3-way data binding

  sportFactory.ref.on('value', function(snapshot) {
    var ids = snapshot.val();
    $scope.sportsAvailable = getObjects(ids);
    console.info('$sportsAvailable:', $scope.sportsAvailable);
    console.info('sportsAvailable.containsProperty:', $scope.sportsAvailable.containsProperty);
    $scope.playersMax = $scope.sportsAvailable.containsProperty('name', $scope.sportSelected).players;
  });
  playerFactory.ref.on('value', function(snapshot) {
    var ids = snapshot.val();
    $scope.playersAvailable = getObjects(ids);
  });
 
  $scope.teamSelect = function(element) {
//notificationFactory.success("OK!!!");
    if ($scope.teamsClosed) return;
    var id = element.target.id;
    if (id) { // selected a team
      $scope.teamSetSelected(id);
    } else {
      var name = element.target.firstChild.data;
      if (name) { // selected a player in team to remove it
        // remove this player from his team, and put it in players available
        var obj = null;
        if ($scope.teamA.containsProperty('name', name)) {
          obj = $scope.teamA.removeObjectByProperty('name', name);
        }
        if ($scope.teamB.containsProperty('name', name)) {
          obj = $scope.teamB.removeObjectByProperty('name', name);
        }
        if (obj) {
          $scope.playersAvailable.push(obj);
          $scope.teamsCompleted = $scope.checkTeamsCompleted();
        } else { // this shouldn't happen...
          notificationFactory.error('Selected element in team not found in team!');
        }
      } else { // this shouldn't happen...
        notificationFactory.error('Selected element in team with empty first child data: ' + JSON.stringify(element.target.firstChild) + ' !');
      }
    }
  }

  $scope.playerSelect = function(element) {
    if ($scope.teamsClosed) return;
    var name = element.target.firstChild.data;
    if (name) {
      if (!$scope.teamSelected) { // TODO: better handle error...
        notificationFactory.warning("Please select a team!");
        return false;
      }
      if ($scope.teamSelected.length >= $scope.playersMax) {
        notificationFactory.info('This team is "complete"');
        return false;
      }
      $scope.player = { 'name': name, 'drag': true }; // TODO: add all properties...
      $scope.teamSelected.push($scope.player);
      $scope.playersAvailable.removeObjectByProperty('name', name);
      console.log('Player [' + name + '] assigned to ' + $scope.teamSelected);
    } else { // this shouldn't happen...
      console.error('empty name element.target:', element.target, '!');
      notificationFactory.error('Empty name element target: ', element.target);
      return false;
    }
    $scope.teamsCompleted = $scope.checkTeamsCompleted();
    return true;
  }

  $scope.checkTeamsCompleted = function() {
    // check if all teams are completed
    if (
      ($scope.teamA.length === $scope.playersMax) &&
      ($scope.teamB.length === $scope.playersMax)
    ) {
      console.info('All teams are complete');
      return true;
    }
    return false;
  }

  $scope.teamsClose = function() {
    if ($scope.checkTeamsCompleted()) {
      $scope.teamsSetClosed();
    }
  };

  $scope.teamSetSelected = function(id) {
    $("div[id^='team']").css({ opacity: '0.3' });
    $("input[id^='label-team']").css({ opacity: '0.3' });
    $("div[id='" + id + "']").css({ opacity: '1.0' });
    $("input[id='label-" + id + "']").css({ opacity: '1.0' });
    $scope.teamSelected = (id === 'teamA' ? $scope.teamA : $scope.teamB);
    console.info('Team', id, 'selected');
  };

  $scope.teamsSetClosed = function() {
    $("div[id^='team']").css({ opacity: '1.0' });
    $("input[id^='label-team']").css({ opacity: '1.0' });
    $('input[id^="label-team"]').attr("disabled", true);
    $scope.teamsClosed = true;
    console.info('Teams Closed');
  };

  $scope.matchClose = function() {
    if (!$scope.teamsClosed) {
      return;
    }
    // TODO: check scores
    $location.path('/statistics');
  };

  function isTouchDevice() {
    return 'ontouchstart' in window // works on most browsers 
      || 'onmsgesturechange' in window; // works on ie10
  };

  function clone(obj) {
    var target = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
    return target;
  }

  function getObjects(obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var o = obj[key];
        keys.push(o);
      }
    }
    return keys;
  }

  Array.prototype.containsProperty = function(property, value) {
    for (var i = 0; i < this.length; i++) {
      if (!property in this) {
        break;
      }
      if (this[i][property] === value) {
        return this[i];
      }
    }
    return null;
  }

  Array.prototype.removeObjectByProperty = function(property, value) {
    for (var i = 0; i < this.length; i++) {
      if (this[i][property] === value) {
        var obj = this[i];
        this.splice(i, 1);
        return obj;
      }
    }
    return null;
  }

});