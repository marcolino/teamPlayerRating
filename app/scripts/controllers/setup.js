'use strict';

/*
 * Do not show / edit skill in setup view
 */

app.controller('SetupCtrl', function ($scope, $filter, stateFactory, sportFactory, playerFactory, notificationFactory, sysFactory, spinnerFactory) {
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

      share.players.$on('loaded', function () {
        share.spinner.hide();
        $scope.playersList = $filter('orderByPriority')(share.players);
        console.info('$scope.playersList:', $scope.playersList);
        $scope.playersSetRank(); // ... hmmm ...
      });

      share.sports.$on('loaded', function () {
        share.spinner.hide();
      });

      share.playersAddMode = false;
      share.playersEditMode = false;
      share.playersOrderByPredicate = 'name';

      share.sportsAddMode = false;
      share.sportsEditMode = false;
      share.sportsOrderByPredicate = 'name';

      share.skillDefault = { sigma: 25, mu: 25 / 3 };
      share.playerDefault = { name: '', email: '', skill: share.skillDefault}; // TODO...
      share.playerAdd = angular.copy(share.playerDefault);
      share.playerEdit = {};

      share.sportDefault = { name: '', playersMax: 0 };
      share.sportAdd = angular.copy(share.sportDefault);
      share.sportEdit = {};

      if (!share.setupTabActive) {
        share.setupTabActive = 'tab-players';
      }

      share.setupInitialized = true;
    } else {
      share.spinner.hide();
    }
  };

  $scope.isSetupTabActive = function (tab) {
    return tab === share.setupTabActive;
  };

  $scope.playersPopulate = function () {
    // TODO: sort these (here, or in forEach()...)
    share.playersDefault = [
      { 'name': 'Frinks',            'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Lucio',             'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Soletta',           'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Paoloalgo',         'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Marcotono',         'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Attila',            'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Puntone',           'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Bonnie',            'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Remi',              'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Grigio',            'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Mosso',             'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Nordin',            'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Hermes',            'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Cavallero',         'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Alejandro',         'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Francesco',         'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Robertoventolin',   'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Marcobellancio',    'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Davide',            'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Paffutello',        'email': '', 'skill': { sigma: 25, mu: 25/3 } },
      { 'name': 'Maxdamuri',         'email': '', 'skill': { sigma: 25, mu: 25/3 } },
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
    console.log('id: ', id);
    console.log('player: ', player);
    console.log('share.players: ', share.players);
/*
    share.players[id].editMode = !share.players[id].editMode;
    if (share.players[id].editMode) {
      share.playerEdit = angular.copy(player);
    }
*/
    // TODO: THIS IS THE RIGHT MODE TO ACCESS share.players ...
    id = player.$id;
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

  $scope.playerResetSkill = function (id, player) {
    // TODO: use some more global constants?
    player.skill.sigma = 25;
    player.skill.mu = 25 / 3;
  };

  $scope.playersResetSkillAll = function () {
    for (var id in share.players) {
      var player = share.players[id];
      if (!player.skill) {
        continue; // skip non-objects - TODO: do it better...
      }
      $scope.playerResetSkill(null, player);
      playerFactory.set(id, player);
    }
  };

  $scope.playersSetRank = function () {
    console.info('playersSetRank()');
    var skillPrevious = share.skillDefault;
    var rank = 1;
    var rankPrevious = rank;
    var rankNew;
    var playersList = $filter('orderByPriority')(share.players);
    console.info('players before sort:', playersList);
    playersList.sort(
      function compare(a, b) {
        if (
          (a.skill.sigma > b.skill.sigma) ||
          (
            (a.skill.sigma === b.skill.sigma) &&
            (a.skill.mu >= b.skill.mu)
          )
        ) {
          return -1;
        } else {
          return 1;
        }
      }
    );
    console.info('players after sort:', playersList);

    for (var i in playersList) {
      var player = playersList[i];
      console.info('Player "' + player.name + '" id is ', player.$id);
/*
      if (!player.skill) {
        continue; // skip non-objects - TODO: do it better...
      }
*/
      if (
        (player.skill.sigma > skillPrevious.sigma) ||
        (
          (player.skill.sigma === skillPrevious.sigma) &&
          (player.skill.mu >= skillPrevious.mu)
        )
      ) {
        console.log(1, skillPrevious);
        rankNew = rankPrevious;
      } else {
        console.log(2);
        rankNew = rank;
        rankPrevious = rank;
      }
      share.players[player.$id].rank = rankNew;
      rank++;
    }
    //console.info('share.players with ranks: ', share.players);
  };

  $scope.init();

});