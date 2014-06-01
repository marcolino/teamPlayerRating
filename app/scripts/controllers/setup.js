'use strict';

app.controller('SetupCtrl', function ($scope, stateFactory, sportFactory, playerFactory) {
  var share = stateFactory;
  $scope.share = share;

  $scope.init = function () { // first load
    if (!share.initialized) {
      console.info(" * INITIALIZING");
      share.spinner = new jSpinner();
      share.spinner.show();

      share.sports = sportFactory.all;
      share.players = playerFactory.all;

      //share.playersColumns = tableColumns($('#table-players'));
      share.playersAddMode = false;
      share.playersEditMode = false;
      share.playersOrderByPredicate = 'name';

      //share.sportsColumns = tableColumns($('#table-sports'));
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

      share.currentTab = "Players";

    } else {
      share.spinner.hide();
    }
    console.info(share.players);
    console.info(share.sports);
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
      { 'name': 'Calcio a 5', 'playersMax': 5 },
      { 'name': 'Calcio a 7', 'playersMax': 7 },
      { 'name': 'Calcio a 8', 'playersMax': 8 },
      { 'name': 'Calcio',     'playersMax': 11 },
      { 'name': 'Rugby',      'playersMax': 15 },
    ];
    // store the object
    share.sportsDefault.forEach(function(sport) {
      sportFactory.add(sport);
    });
  };

  $scope.playersEmpty = function () {
console.info(tableRows($('#table-players')));
    return (tableRows($('#table-players')) <= 3); // 3 = thead tr + dummy tbody tr + tfoot tr
  }

  $scope.sportsEmpty = function () {
    return (tableRows($('#table-sports')) <= 3); // 3 = thead tr + dummy tbody tr + tfoot tr
  }

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

  $scope.addPlayer = function (toggle) {
    if (share.playerNew.name) {
      playerFactory.add(share.playerNew);
      share.playerNew = angular.copy(share.playerDefault);
    }
    if (toggle) {
      $scope.playersToggleAddMode();
    }
  };

  $scope.addSport = function (toggle) {
    if (share.sportNew.name) {
      sportFactory.add(share.sportNew);
      share.sportNew = angular.copy(share.sportDefault);
    }
    if (toggle) {
      $scope.sportsToggleAddMode();
    }
  };

  $scope.updatePlayer = function (playerOld, playerNew) {
    // TODO: if name empty ???
    // TODO: if name not changed ???
    $scope.removePlayer(playerOld);
    share.players[playerNew.name] = playerNew;
    $scope.playersToggleEditMode(playerNew);
  };

  $scope.updatesport = function (sportOld, sportNew) {
    // TODO: if name empty ???
    // TODO: if name not changed ???
    $scope.removesport(sportOld);
    share.sports[sportNew.name] = sportNew;
    $scope.sportsToggleEditMode(sportNew);
  };

  $scope.removePlayer = function (player) {
    playerFactory.remove(player.name);
  };

  $scope.removesport = function (sport) {
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