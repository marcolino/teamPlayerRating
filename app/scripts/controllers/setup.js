'use strict';

app.controller('SetupCtrl', function ($scope, stateFactory, sportFactory, playerFactory, notificationFactory, sysFactory, spinnerFactory) {
  var share = stateFactory;
  $scope.share = share;

  $scope.init = function () { // first load
    if (!share.setupInitialized) {
      console.info(' * INITIALIZING');
      if (!share.spinner) {
        share.spinner = spinnerFactory;
        share.spinner.show();
      }

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
      share.playerAdd = angular.copy(share.playerDefault);
      share.playerEdit = {};

      share.sportDefault = { name: '', playersMax: 0 };
      share.sportAdd = angular.copy(share.sportDefault);
      share.sportEdit = {};

      share.currentTab = 'Players';

      share.setupInitialized = true;
    } else {
      share.spinner.hide();
    }
  };

  $scope.playersPopulate = function () {
    // TODO: sort these (here, or in forEach()...)
    share.playersDefault = [
      { 'name': 'Frinks',            'email': '', 'skill': 50 },
      { 'name': 'Lucio',             'email': '', 'skill': 50 },
      { 'name': 'Soletta',           'email': '', 'skill': 50 },
      { 'name': 'Paoloalgo',         'email': '', 'skill': 50 },
      { 'name': 'Marcotono',         'email': '', 'skill': 50 },
      { 'name': 'Attila',            'email': '', 'skill': 50 },
      { 'name': 'Puntone',           'email': '', 'skill': 50 },
      { 'name': 'Bonnie',            'email': '', 'skill': 50 },
      { 'name': 'Remi',              'email': '', 'skill': 50 },
      { 'name': 'Grigio',            'email': '', 'skill': 50 },
      { 'name': 'Mosso',             'email': '', 'skill': 50 },
      { 'name': 'Nordin',            'email': '', 'skill': 50 },
      { 'name': 'Hermes',            'email': '', 'skill': 50 },
      { 'name': 'Cavallero',         'email': '', 'skill': 50 },
      { 'name': 'Aleandro',          'email': '', 'skill': 50 },
      { 'name': 'Francesco',         'email': '', 'skill': 50 },
      { 'name': 'Robertoventolin',   'email': '', 'skill': 50 },
      { 'name': 'Marcobellancio',    'email': '', 'skill': 50 },
    ];
    // store the object
    share.playersDefault.forEach(function(player) {
      //console.info('populating players with', player);
      $scope.playerAdd(player);
    });
  };

  $scope.sportsPopulate = function () {
    // TODO: sort these (here, or in forEach()...)
    share.sportsDefault = [
      { 'name': 'Calcio a 5', 'playersMax':  5, 'selected': true },
      { 'name': 'Calcio a 7', 'playersMax':  7                   },
      { 'name': 'Calcio a 8', 'playersMax':  8                   },
      { 'name': 'Calcio',     'playersMax': 11                   },
      { 'name': 'Rugby',      'playersMax': 15                   },
    ];
    // store the object
    share.sportsDefault.forEach(function(sport) {
      //console.info('populating sports with', sport);
      $scope.sportAdd(sport);
    });
  };

  $scope.playersAreEmpty = function () {
    return sysFactory.objectLength(share.players) === 0;
  };

  $scope.sportsAreEmpty = function () {
    return sysFactory.objectLength(share.sports) === 0;
  };

  $scope.playersToggleAddMode = function () {
    share.playersAddMode = !share.playersAddMode;
  };

  $scope.sportsToggleAddMode = function () {
    share.sportsAddMode = !share.sportsAddMode;
  };

  $scope.playersToggleEditMode = function (id, player) {
    share.players[id].editMode = !share.players[id].editMode;
    if (share.players[id].editMode) {
      share.playerEdit = angular.copy(player);
    }
  };

  $scope.sportsToggleEditMode = function (id, sport) {
    share.sports[id].editMode = !share.sports[id].editMode;
    if (share.sports[id].editMode) {
      share.sportEdit = angular.copy(sport);
    }
  };

  $scope.playerAdd = function (player) {
    if (playerFactory.findByProperty('name', player.name)) { // do not permit duplicate names, even if they would be possible, using unique keys...
      notificationFactory.error('Player name', player.name, 'already present!');
      return false;
    }
    if (!player.name) {
      notificationFactory.error('Player name can\'t be empty!');
      return false;
    }
    playerFactory.add(player).then(function (id) {
      console.info('added player id:', id);
    });
    share.playerAdd = angular.copy(share.playerDefault);
    return true;
  };

  $scope.sportAdd = function (sport) {
    if (sportFactory.findByProperty('name', sport.name)) { // do not permit duplicate names, even if they would be possible, using unique keys...
      notificationFactory.error('Sport name', sport.name, 'already present!');
      return false;
    }
    if (!sport.name) {
      notificationFactory.error('Sport name can\'t be empty!');
      return false;
    }
    sportFactory.add(sport).then(function (id) {
      console.info('added sport id:', id);
      notificationFactory.success('ADDED sport id', id);
    });
    share.sportAdd = angular.copy(share.sportDefault);
    return true;
  };

  $scope.playerUpdate = function (id, player) {
    if (player && !player.name) {
      notificationFactory.warning('Name can\'t be empty. To remove a player please use trash button.');
      return false;
    }
    share.players[id].editMode = !share.players[id].editMode;
    player.editMode = !player.editMode;
    playerFactory.set(id, player);

    if (share.players[id].editMode) {
      share.playerEdit = angular.copy(player);
    }

    return true;
  };

  $scope.sportUpdate = function (id, sport) {
    if (sport && !sport.name) {
      notificationFactory.waring('Name can\'t be empty. To remove a sport please use trash button.');
      return false;
    }
    share.sports[id].editMode = !share.sports[id].editMode;
    sport.editMode = !sport.editMode;
    sportFactory.set(id, sport);

    if (share.sports[id].editMode) {
      share.sportsEdit = angular.copy(sport);
    }

    return true;
  };

  $scope.sportSelect = function (sport) {
    // select current sport (de-selecting others)
    sportFactory.select(sport);
  };

  $scope.sportSelected = function () { // TODO: directly use sportFactory.isSelected();
    // return selected sport
    return sportFactory.isSelected();
  };

  $scope.playerRemove = function (id) {
    playerFactory.remove(id);
  };

  $scope.sportRemove = function (id) {
    sportFactory.remove(id);
  };

  $scope.playersRemoveAll = function () {
    playerFactory.remove();
  };

  $scope.sportsRemoveAll = function () {
    sportFactory.remove();
  };

  $scope.init();

});