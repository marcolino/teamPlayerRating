'use strict';

app.controller('SetupCtrl', function ($scope, stateFactory, sportFactory, playerFactory) {
  $scope.match = stateFactory.match;
  $scope.teams = stateFactory.teams;
  $scope.players = stateFactory.players;

  var share = stateFactory;
  $scope.share = share;

//console.log('setup - $scope.teams:', $scope.teams);
/*
  $scope.$watch('match', function (newVal, oldVal) {
    $scope.match = newVal;
  });
  $scope.$watch('teams', function (newval, oldval) {
    $scope.teams = newval;
console.log('setup watch - $scope.teams:', $scope.teams);
  });
*/

//  $scope.teams = {};
  $scope.sports = sportFactory.all;
  $scope.players = playerFactory.all;
  //$scope.players = playerFactory.all;
  //console.info('$scope.players', $scope.players);

  $scope.sports.$on('loaded', function () { 
    //console.info('Sports loaded.');
    $scope.sports = sportFactory.all;
    if ($scope.sports.$value === null) {
      //console.info("$scope.sports.$value === null, POPULATING...");
      //$scope.populateSports();
      ////$scope.sports = sportFactory.all;
    }
  });

  $scope.players.$on('loaded', function () { 
    //console.info('Players loaded.');
    $scope.players = playerFactory.all;
    if ($scope.players.$value === null) {
      //console.info("$scope.players.$value === null, POPULATING...");
      //$scope.populatePlayers();
      ////$scope.players = playerFactory.all;
    }
  });

  $scope.playerDefault = { name: '', skill: 50 };
  $scope.playerNew = angular.copy($scope.playerDefault);

/*
  $scope.addPlayer = function () {
    console.log('setup: addPlayer(): ', $scope.playerNew);
    playerFactory.add($scope.playerNew);
    $scope.playerNew = angular.copy($scope.playerDefault);
  };
*/

  $scope.removePlayer = function (player) {
    console.log('setup: removePlayer()');
    playerFactory.remove(player.name);
  };
  $scope.removeAll = function () {
    console.log('setup: removeAll()');
    playerFactory.delete();
  };

  $scope.populateSports = function () {
    console.info('POPULATING SPORTS');
    $scope.sportsDefault = [
      { 'name': 'Calcio a 5', 'playersMax': 5 },
      { 'name': 'Calcio a 7', 'playersMax': 7 },
      { 'name': 'Calcio a 8', 'playersMax': 8 },
      { 'name': 'Calcio',     'playersMax': 11 },
      { 'name': 'Rugby',      'playersMax': 15 },
    ];
    // store the object
    $scope.sportsDefault.forEach(function(sport) {
      sportFactory.add(sport);
    });
  };

  $scope.populatePlayers = function () {
    console.info('POPULATING PLAYERS');
    $scope.playersDefault = [
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
    ];
    // store the object
    $scope.playersDefault.forEach(function(player) {
      console.log('player:', player);
      playerFactory.add(player);
    });
  };

  $scope.tableColumns = function (table) {
    var colCount = 0;
console.log('tableColumns start', colCount);
    $('tr:nth-child(1) td').each(function () {
      if ($(this).attr('colspan')) {
        colCount += $(this).attr('colspan');
console.log('tableColumns colspan', colCount);
      } else {
        colCount++;
console.log('tableColumns td', colCount);
      }
    });
    return colCount;
  };

 $scope.tableRows = function (table) {
    var rowCount = 0;
    $('tr').each(function () {
      rowCount++;
    });
console.log('tableRows', rowCount);
    return rowCount;
  };

  $scope.columns = $scope.tableColumns($('#table-players'));
  //$scope.columns = 1 + 3;
console.info('columns:' + $scope.columns);
  $scope.addMode = false;
  $scope.editMode = false;
  $scope.orderByPredicate = 'name';

  $scope.playersEmpty = function () {
console.info('scope.playersEmpty:', $scope.players);
    return ($scope.tableRows($('#table-players')) <= 3);
  }

  $scope.toggleAddMode = function () {
    $scope.addMode = !$scope.addMode;
console.info("addMode :", $scope.addMode);
  };

  $scope.toggleEditMode = function (player) {
console.info("tEM() - player:", player);
console.info("tEM() - players[player.name]:", $scope.players[player.name]);
    $scope.players[player.name].editMode = !$scope.players[player.name].editMode;
console.info("$scope.players[player.name].editMode :", $scope.players[player.name].editMode);
    if ($scope.players[player.name].editMode) {
console.info("copying player to $scope.playerEdit");
      $scope.playerEdit = angular.copy(player);
console.info("$scope.playerEdit:", $scope.playerEdit);
    }
  };

  $scope.addPlayer = function (toggle) {
    console.log('setup: addPlayer(): ', $scope.playerNew);
    if ($scope.playerNew.name) {
      playerFactory.add($scope.playerNew);
      $scope.playerNew = angular.copy($scope.playerDefault);
    }
    if (toggle) {
console.log('TOGGLE');
      $scope.toggleAddMode();
    }
  };

  $scope.updatePlayer = function (playerOld, playerNew) {
console.log("updatePlayer()", playerOld.name, playerNew);
    $scope.removePlayer(playerOld);
    $scope.players[playerNew.name] = playerNew;
console.info($scope.players[playerOld.name]);
console.info($scope.players[playerNew.name]);
    $scope.toggleEditMode(playerNew);
  };

  $scope.deletePlayer = function (player) {
    $scope.removePlayer(player);
  };

  /*
  $scope.test = function () {
    console.log("TEST");
  };
  */

});