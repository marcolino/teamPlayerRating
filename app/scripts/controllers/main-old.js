'use strict';

app.controller('MainCtrl', function ($scope, $location, stateFactory, sportFactory, playerFactory, matchFactory, trueskillFactory, notificationFactory, sysFactory, spinnerFactory) {
  var share = stateFactory;
  $scope.share = share;
  
  $scope.init = function () { // first load
    if (!share.initializedMain) {
      if (!share.spinner) {
        share.spinner = spinnerFactory;
        share.spinner.show();
      }

      share.sports = sportFactory.all;
      share.players = playerFactory.all;

      playerFactory.ref.on('value', function(snapshot) {
        var ids = snapshot.val();
        share.playersAvailable = angular.copy(ids);
        share.spinner.hide();
      });
      share.initializedMain = true;
    }
  };
  
  $scope.reset = function () {
    share.initMain();
    share.initializedMain = false;
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
        angular.forEach(share.main.match.teams[idParentTeam].players, function(value, key) {
          if (value.name === name) {
            share.playersAvailable[key] = share.main.match.teams[idParentTeam].players[key];
            delete share.main.match.teams[idParentTeam].players[key];
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
      if (sysFactory.objectLength(share.main.match.teams[share.main.teamSelected].players) >= $scope.sportSelectedPlayersMax()) {
        notificationFactory.info('This team is complete');
        return false;
      }
      var id = playerFactory.findByProperty('name', name);
      if (!id) {
        // this shouldn't happen...
        notificationFactory.error('Selected player name "', name, '" not found!');
        return false;
      }
      share.main.match.teams[share.main.teamSelected].players[id] = share.playersAvailable[id];
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

  $scope.teamsCheckCompleted = function () {
    if (
      (sysFactory.objectLength(share.main.match.teams['A'].players) === $scope.sportSelectedPlayersMax()) &&
      (sysFactory.objectLength(share.main.match.teams['B'].players) === $scope.sportSelectedPlayersMax())
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
    share.main.teamSelected = share.main.match.teams[id.replace(/^team/, '')];
    console.info('Selected team with id', id);
  };

  $scope.teamsSetClosed = function () {
    share.main.teamsClosed = true;
    console.info('Teams closed');
  };

  $scope.teamsCheckClosed = function () {
    return share.main.teamsClosed;
  };

  $scope.matchCheckClosed = function () {
    return (
      (typeof share.main.match.teams['A'].score !== 'undefined') &&
      (typeof share.main.match.teams['B'].score !== 'undefined')
    );
  };

  $scope.matchCheckConfirmed = function () {
    return share.main.match.confirmed;
  };

  $scope.matchConfirm = function () {
    if (!share.main.teamsClosed) {
      return false;
    }
    if (!$scope.matchCheckClosed()) {
      return false;
    }

    $scope.updateSkills();

    matchFactory.add(share.main.match).then(function (id) {
      console.info('added match id:', id);
      share.main.match.confirmed = true;
      $location.path('/statistics');
    });
  };

  $scope.updateSkills = function () {
    /* update skill */
    var players = trueskillFactory.matchUpdateSkill(share.main.match);
    /* update players factory with new skills */
    //console.info('players:', players);
    //console.info('players length:', players.length);
    for (var i = 0; i < players.length; ++i) {
      var skill = {};
      //console.info(' +++ player:', players[i]);
      skill.mu = players[i].skill[0];
      skill.sigma = players[i].skill[1];
      //console.info('skill:', skill);
      playerFactory.setSkill(players[i].id, skill);
    }
/*
    var players = [];
    for (var team in share.main.match.teams) {
      var squad = share.main.match.teams[team].players;
      console.info('squad:', squad);
      for (var id in squad) {
        //var player = squad[id];
        console.info(' *** id, player ***', id, squad[id]);
        playerFactory.set(id, squad[id]);
      }
    }
*/
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
    angular.forEach(share.sports, function(value) {
      if (value.name === sport) {
        ret = parseInt(value.playersMax);
      }
    });
    return ret;
  };

  /*
  $scope.dateToday = function(format) {
    var d = new Date();
    var day = d.getDate();
    var m = d.getMonth();
    var y = d.getFullYear();
    ... INCOMPLETE ...
    return today.format(format);
  };
  */

  $scope.init();

});