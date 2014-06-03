'use strict';

app.factory('playerFactory',
  function($firebase, FIREBASE_URL) {
    var url = FIREBASE_URL + '/' + 'players';
    var ref = new Firebase(url);
    var players = $firebase(ref);

    return {
      ref: ref,
      all: players,
      add: function(player) {
        ref.child(player.name).set(player);
        //ref.child(player.name).setWithPriority(player, priority);
      },
      find: function(id) {
        return players.$child(id);
      },
      findByProperty: function(property, value) {
        var ret;
        ref.once('value', function(ss) {
          ss.forEach(function(childSnapshot) {
            var id = childSnapshot.name();
            childSnapshot.ref().child(property).once('value', function(ss) {
              if (ss.val() === value) {
                ret = id;
              }
            });
          });
        });
        return ret;
      },
      remove: function(id) {
        return players.$remove(id);
      },
      delete: function(id) { return this.remove(id); } // alias
    };
  }
);