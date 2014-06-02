'use strict';

app.controller('SetupCtrl', function ($scope, stateFactory, sportFactory, playerFactory, notificationFactory, sysFactory, spinnerFactory) {
  var share = stateFactory;
  $scope.share = share;

  $scope.init = function () { // first load
    if (!share.initialized) {
      console.info(' * INITIALIZING');
      share.spinner = spinnerFactory;
      share.spinner.show();

      share.sports = sportFactory.all;
      share.players = playerFactory.all;

      share.playersAddMode = false;
      share.playersEditMode = false;
      share.playersOrderByPredicate = 'name';

      share.sportsAddMode = false;
      share.sportsEditMode = false;
      share.sportsOrderByPredicate = 'name';

      share.players.$on('loaded', function () {
        share.spinner.hide();
      });

      share.sports.$on('loaded', function () {
        share.spinner.hide();
      });

      share.playerDefault = { name: '', email: '', skill: 50 };
      share.playerNew = angular.copy(share.playerDefault);
      share.playerEdit = {};

      share.sportDefault = { name: '', playersMax: 0 };
      share.sportNew = angular.copy(share.sportDefault);
      share.sportEdit = {};

      share.currentTab = 'Players';

    } else {
      share.spinner.hide();
    }
  };

  $scope.populatePlayers = function () {
    share.playersDefault = [
      { 'name': 'Frinks',            'skill': 50 },
      { 'name': 'Lucio',             'skill': 50 },
      { 'name': 'Soletta',           'skill': 50 },
      { 'name': 'Paoloalgo',         'skill': 50 },
      { 'name': 'Marcotono',         'skill': 50 },
      { 'name': 'Attila',            'skill': 50 },
      { 'name': 'Puntone',           'skill': 50 },
      { 'name': 'Bonnie',            'skill': 50 },
      { 'name': 'Remi',              'skill': 50 },
      { 'name': 'Grigio',            'skill': 50 },
      { 'name': 'Mosso',             'skill': 50 },
      { 'name': 'Nordin',            'skill': 50 },
      { 'name': 'Hermes',            'skill': 50 },
      { 'name': 'Cavallero',         'skill': 50 },
      { 'name': 'Aleandro',          'skill': 50 },
      { 'name': 'Francescobeltocco', 'skill': 50 },
      { 'name': 'Nuovoragazzino',    'skill': 50 },
      { 'name': 'Marcobellancio',    'skill': 50 },
    ];
    // store the object
    share.playersDefault.forEach(function(player) {
      playerFactory.add(player);
    });
  };

  $scope.populateSports = function () {
    share.sportsDefault = [
      { 'name': 'Calcio a 5', 'playersMax':  5 },
      { 'name': 'Calcio a 7', 'playersMax':  7 },
      { 'name': 'Calcio a 8', 'playersMax':  8 },
      { 'name': 'Calcio',     'playersMax': 11 },
      { 'name': 'Rugby',      'playersMax': 15 },
    ];
    // store the object
    share.sportsDefault.forEach(function(sport) {
      sportFactory.add(sport);
    });
  };

  $scope.playersEmpty = function () {
    return sysFactory.objectIsEmpty(share.players);
  };

  $scope.sportsEmpty = function () {
    return sysFactory.objectIsEmpty(share.sports);
  };

  $scope.playersToggleAddMode = function () {
    share.playersAddMode = !share.playersAddMode;
  };

  $scope.sportsToggleAddMode = function () {
    share.sportsAddMode = !share.sportsAddMode;
  };

  $scope.playersToggleEditMode = function (player) {
    share.players[player.name].editMode = !share.players[player.name].editMode;
    if (share.players[player.name].editMode) {
      share.playerEdit = angular.copy(player);
    }
  };

  $scope.sportsToggleEditMode = function (sport) {
    share.sports[sport.name].editMode = !share.sports[sport.name].editMode;
    if (share.sports[sport.name].editMode) {
      share.sportEdit = angular.copy(sport);
    }
  };

  $scope.addPlayer = function (player) {
    if (player.name) {
      playerFactory.add(player);
      share.playerNew = angular.copy(share.playerDefault);
    } else {
      console.error('adding a player with no name...');
    }
  };

  $scope.addSport = function (sport) {
    if (sport.name) {
      sportFactory.add(sport);
      share.sportNew = angular.copy(share.sportDefault);
    } else {
      console.error('adding a sport with no name...');
    }
  };

  $scope.updatePlayer = function (playerOld, playerNew) {
    if (playerNew && !playerNew.name) {
      notificationFactory.error('Name can\'t be empty. To remove a player please use trash button.');
      return;
    }
    $scope.removePlayer(playerOld);
    playerNew.editMode = false;
    $scope.addPlayer(playerNew, false, true);
    //share.playerEdit = angular.copy(playerNew);
  };

  $scope.updateSport = function (sportOld, sportNew) {
    if (sportNew && !sportNew.name) {
      notificationFactory.error('Name can\'t be empty. To remove a sport please use trash button.');
      return;
    }
    $scope.removeSport(sportOld);
    sportNew.editMode = false;
    $scope.addSport(sportNew, false, true);
  };

  $scope.sportSelect = function (sport) {
    // deselect all sports
    var obj = share.sports;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          if (obj[prop] !== null) {
            obj[prop].selected = false;
          }
        }
      }
    }
    // select current sport
    share.sports[sport.name].selected = true;
  };

  $scope.removePlayer = function (player) {
    playerFactory.remove(player.name);
  };

  $scope.removeSport = function (sport) {
    sportFactory.remove(sport.name);
  };

  $scope.removePlayersAll = function () {
    playerFactory.remove();
  };

  $scope.removesportsAll = function () {
    sportFactory.remove();
  };

  $scope.init();

});