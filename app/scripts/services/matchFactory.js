'use strict';

app.factory('matchFactory',
  function($firebase, FIREBASE_URL) {
    var url = FIREBASE_URL + '/' + 'matchs';
    var ref = new Firebase(url);
    var matchs = $firebase(ref);

    return {
      ref: ref,
      all: matchs,
      add: function(match) {
        return matchs.$add(match).then(
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
      set: function(id, match) {
        ref.child(id).set(match);
      },
      find: function(id) {
        return matchs.$child(id);
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
        return matchs.$remove(id);
      }
    };
  }
);