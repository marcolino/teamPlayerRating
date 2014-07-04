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
            //console.error('SUCCESS, id:', id);
            return id;
          },
          function (err) {
            // Firebase is resilient with failures...
            // use Firebase Security Rules to test this...
            console.error('ERROR:', err);
            return null;
          }
        );
      },
      set: function(id, player) {
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
                ret = id;
              }
            });
          });
        });
        return ret;
      },
      remove: function(id) {
        // note: removes all players if id is null
        return players.$remove(id);
      }
    };
  }
);