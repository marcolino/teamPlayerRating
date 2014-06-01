'use strict';

app.controller('SetupCtrl', function ($scope, stateFactory, sportFactory, playerFactory) {
  var share = stateFactory;
  $scope.share = share;

// TODO: change $scope with share...

  $scope.match = stateFactory.match;
  //$scope.teams = stateFactory.teams;
  $scope.players = stateFactory.players;

  $scope.sports = sportFactory.all;
  $scope.players = playerFactory.all;
  //$scope.teams = {};

  $scope.columns = tableColumns($('#table-players'));
  $scope.addMode = false;
  $scope.editMode = false;
  $scope.orderByPredicate = 'name';

  $scope.sports.$on('loaded', function () { 
    //$scope.sports = sportFactory.all;
    $('#loading').hide();
  });

  $scope.players.$on('loaded', function () { 
    //$scope.players = playerFactory.all;
    $('#loading').hide();
  });

  $scope.playerDefault = { name: '', skill: 50 };
  $scope.playerNew = angular.copy($scope.playerDefault);

  $scope.populateSports = function () {
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
      { 'name': 'Marcobellancio',    'skill': 50 },
    ];
    // store the object
    $scope.playersDefault.forEach(function(player) {
      playerFactory.add(player);
    });
  };


  $scope.playersEmpty = function () {
    return (tableRows($('#table-players')) <= 3); // 3 = thead tr + dummy tbody tr + tfoot tr
  }

  $scope.toggleAddMode = function () {
    $scope.addMode = !$scope.addMode;
  };

  $scope.toggleEditMode = function (player) {
    $scope.players[player.name].editMode = !$scope.players[player.name].editMode;
    if ($scope.players[player.name].editMode) {
      $scope.playerEdit = angular.copy(player);
    }
  };

  $scope.addPlayer = function (toggle) {
    if ($scope.playerNew.name) {
      playerFactory.add($scope.playerNew);
      $scope.playerNew = angular.copy($scope.playerDefault);
    }
    if (toggle) {
      $scope.toggleAddMode();
    }
  };

  $scope.updatePlayer = function (playerOld, playerNew) {
    // TODO: if name not changed ???
    $scope.removePlayer(playerOld);
    $scope.players[playerNew.name] = playerNew;
    $scope.toggleEditMode(playerNew);
  };

  $scope.removePlayer = function (player) {
    playerFactory.remove(player.name);
  };

  $scope.removePlayersAll = function () {
    playerFactory.remove();
  };

  function tableColumns (table) {
    var colCount = 0;
    $('tr:nth-child(1) td').each(function () {
      if ($(this).attr('colspan')) {
        colCount += $(this).attr('colspan');
      } else {
        colCount++;
      }
    });
    return colCount;
  }

  function tableRows (table) {
    var rowCount = 0;
    $('tr').each(function () {
      rowCount++;
    });
    return rowCount;
  }

});