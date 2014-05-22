'use strict';

app.controller('MainCtrl', function ($scope, sportFactory, playerFactory, notificationFactory) {
  $scope.teamA = [];
  $scope.teamB = [];
  $scope.teamSelected = null;
  $scope.sportSelected = "Calcio a 5";
  $scope.sports = sportFactory.all;
  $scope.players = playerFactory.all;
  sportFactory.ref.on('value', function(snapshot) {
    var keys = snapshot.val();
    //console.info("KEYS: ", getObjects(keys));
    $scope.sportsAvailable = getObjects(keys);
    $scope.playersMax = $scope.sportsAvailable.containsProperty('name', $scope.sportSelected).players;
    //var playersMax = $scope.sportsAvailable.containsProperty('name', $scope.sportSelected).players;
    //console.info('playersMax:', playersMax);
  });
  playerFactory.ref.on('value', function(snapshot) {
    var keys = snapshot.val();
    //console.info("KEYS: ", getObjects(keys));
    $scope.playersAvailable = getObjects(keys);
  });
 
  $scope.teamSelect = function(element) {
    var id = element.target.id;
    //console.info('target.id:', id);
    if (id) { // selected a team
      $("div[id^='team']").css({ opacity: '0.3', 'border-width': '7' });
      $("div[id='" + id + "']").css({ opacity: '1.0', 'border-width': '7' });
      $scope.teamSelected = (id === 'teamA' ? $scope.teamA : $scope.teamB);
      console.info('Selected', id);
    } else {
      var name = element.target.firstChild.data;
      if (name) { // selected a player in team to remove it
        if ($scope.teamSelected.containsProperty('name', name)) {
          // remove this player from this team, and put it in players available
          var obj = $scope.teamSelected.removeObjectByProperty('name', name);
          $scope.playersAvailable.push(obj);
        }
      } else {
        notificationFactory.error('empty element.target.firstChild.data: ' + JSON.stringify(element.target.firstChild) + ' !');
      }
    }
  }

  $scope.playerSelect = function(element) {
    //console.log("playerSelect(element):", element);
    var name = element.target.firstChild.data;
    //console.info('element.target.firstChild.data:', element.target.firstChild.data);
    if (name) {
      if (!$scope.teamSelected) { // TODO: better handle error...
        notificationFactory.warning("Please select a team!");
        return;
      }
      if ($scope.teamSelected.length >= $scope.playersMax) return false;
      $scope.player = { 'name': name, 'drag': true }; // TODO: add all properties...
      $scope.teamSelected.push($scope.player);
      $scope.playersAvailable.removeObjectByProperty('name', name);
      console.log('Player [' + name + '] assigned to ' + $scope.teamSelected);
    } else {
      console.error('empty name element.target:', element.target, '!!!');
      notificationFactory.error('empty name element.target: ' + JSON.stringify(element.target) + ' !');
    }
  }

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