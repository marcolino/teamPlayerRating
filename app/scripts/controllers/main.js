'use strict';

app.controller('MainCtrl', function ($scope, playerFactory) {
  $scope.teamA = [];
  $scope.teamB = [];
  $scope.teamSelected = null;
 
  $scope.teamSelect = function(element) {
    var id = element.target.id;
    //console.log(element);
    console.info('target.id:', id);
    /*
    if (is_touch_device()) {
      alert('IS TOUCH');
    } else {
      console.info('IS NOT TOUCH');
    }
    */
    if (id) {
      $("div[id^='team']").css({ opacity: '0.5', 'border-width': '7' });
      $("div[id='" + id + "']").css({ opacity: '1.0', 'border-width': '7' });
      $scope.teamSelected = (id === 'teamA' ? $scope.teamA : $scope.teamB);
    }
    else console.info('empty id element:', element.target);
  }

  $scope.optionsTeamA = {
    accept: function(dragEl) {
      console.log(dragEl);
      if ($scope.teamSelected != $scope.TeamA) {
        return false;
      }
      if ($scope.teamA.length >= 5) {
        return false;
      } else {
        return true;
      }
    }
  };

  $scope.optionsTeamB = {
    accept: function(dragEl) {
      console.log(dragEl);
      if ($scope.teamSelected != $scope.teamB) {
        return false;
      }
      if ($scope.teamB.length >= 5) {
        return false;
      } else {
        return true;
      }
    }
  };

  $scope.dropA = function() {
    console.info("dropA");
    return true;
  }

  $scope.playerSelect = function(element) {
    //console.log("element:", element);
    var name = element.target.firstChild.data;
    //console.info('element.target.firstChild.data:', element.target.firstChild.data);
    if (name) {
      if (!$scope.teamSelected) {
        alert("Please select a team!");
        return;
      }
      if ($scope.teamSelected.length >= 5) return false;
      $("#" + ($scope.teamSelected == $scope.teamA ? 'teamA' : 'teamB')).append(element.target).show('slow');
      $scope.teamSelected.push(element.target);
      console.log('Player [' + name + '] assigned to ' + $scope.teamSelected);
    }
    //else console.info('empty name element.target:', element.target);
  }

  function is_touch_device() {
    return 'ontouchstart' in window // works on most browsers 
      || 'onmsgesturechange' in window; // works on ie10
  };

  $scope.sports = [
    { 'name': 'Calcio a 5', 'players': 5 },
    { 'name': 'Calcio a 7', 'players': 7 },
    { 'name': 'Calcio a 8', 'players': 8 },
    { 'name': 'Calcio',     'players': 11 },
    { 'name': 'Rugby',      'players': 15 },
  ];

  $scope.players = [
    { 'name': 'Frinks',    'drag': true },
    { 'name': 'Lucio',     'drag': true },
    { 'name': 'Soletta',   'drag': true },
    { 'name': 'Paoloalgo', 'drag': true },
    { 'name': 'Marcotono', 'drag': true },
    { 'name': 'Attila',    'drag': true },
    { 'name': 'Puntone',   'drag': true },
    { 'name': 'Bonnie',    'drag': true },
    { 'name': 'Remi',      'drag': true },
    { 'name': 'Grigio',    'drag': true },
    { 'name': 'Mosso',     'drag': true },
    { 'name': 'Aleandro',  'skill': 99, 'drag': true },
    { 'name': 'Cavallero', 'skill': 99, 'drag': true },
    { 'name': 'Nordin2',    'skill': 99, 'drag': true },
    { 'name': 'Nordin3',    'skill': 99, 'drag': true },
    { 'name': 'Nordin4',    'skill': 99, 'drag': true },
    { 'name': 'Nordin5',    'skill': 99, 'drag': true }
  ];
console.log($scope.players);
  //$scope.players = playerFactory.all;
console.log($scope.players);

/*
  $('.thumbnail').focus(
    function() {
      console.info('FOCUS');
      $(this).css({
        'border-color': 'yellow',
        'border-weight': '7px',
        'border-style': 'solid'
      });
    }
  );
  $('.thumbnail').blur(
    function() {
      console.info('BLUR');
      $(this).css({ 
        'border-color': '#f40',
        'border-weight': '7px',
        'border-style': 'solid'
      });
    }
  );
*/

/*
  angular.forEach($scope.players,
    function(player) {
      if (typeof player === 'object') {
        angular.forEach(player, function(o) {
          console.log(o);
        });
      }
    });
*/
/*
  for (var key in $scope.players) {
    if (typeof key === 'object') {
      console.log('object:', $scope.players[key]);
    }
  }
*/

/*
  // limit items to be dropped in teams
  $scope.optionsTeam1 = {
    accept: function(/ *dragEl* /) {
      if ($scope.team1.length >= 5) {
        return false;
      } else {
        return true;
      }
    }
  };
*/
});