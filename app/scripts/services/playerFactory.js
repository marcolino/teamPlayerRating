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
        return players.$add(player).then(
          function (ref) {
            var id = ref.name();
            console.error('SUCCESS, id:', id);
            return id;
          },
          function (err) { // TODO: IS THIS CALLED, ON ERROR? DO I NEED IT?
            console.error('ERROR, TODO...', err);
            return null;
          }
        );
      },
      set: function(id, player) {
        console.info('set', ref.child(id));
        ref.child(id).set(player);
      },
      find: function(id) {
        return players.$child(id);
      },
      findByProperty: function(property, value) {
        var ret = null;
        ref.once('value', function(ss) {
          ss.forEach(function(childSnapshot) {
            var id = childSnapshot.name();
            childSnapshot.ref().child(property).once('value', function(ss) {
              if (ss.val() === value) {
              //ret = id;
                ret = ss;
              }
            });
          });
        });
        return ret;
      },
      remove: function(id) {
        return players.$remove(id);
      }
    };
  }
);