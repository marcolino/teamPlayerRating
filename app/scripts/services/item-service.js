'use strict';

app.factory('itemService',
  function ($firebase, FIREBASE_URL /*, $rootScope*/) {
    var _url = FIREBASE_URL + '/' + 'items';
    var _ref = new Firebase(_url);
    
    return {
      setListToScope: function (scope, localScopeVarName) {
        angularFire(_ref, scope, localScopeVarName);
      },
      addItem: function (item) {
        _ref.push(item);
      },
      findItem: function (id) {
        return _ref.$child(id);
      },
      deleteItem: function(id) {
        var itemRef = new Firebase(_url + '/' + id);
        itemRef.remove();
      },
      removeAll: function() {
        _ref.remove();
      }
    };
  }
);

/*
app.factory('Player',
  function ($firebase, FIREBASE_URL / *, $rootScope* /) {
    var ref = new Firebase(FIREBASE_URL + 'players');
    var players = $firebase(ref);
     
    var Player = {
      all: players,
      create: function (player) {
        return players.$add(player);
      },
      find: function (playerId) {
        return players.$child(playerId);
      },
      delete: function (playerId) {
        return players.$remove(playerId);
      }
    };
     
    return Player;
  }
);
*/