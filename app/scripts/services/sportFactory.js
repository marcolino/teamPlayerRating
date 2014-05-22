'use strict';

app.factory('sportFactory',
  function($firebase, FIREBASE_URL) {
    var url = FIREBASE_URL + '/' + 'sport';
    var ref = new Firebase(url);
    var sport = $firebase(ref);

    return {
      ref: ref,
      all: sport,
      add: function(player) {
        return sport.$add(player);
      },
      find: function(id) {
        return sport.$child(id);
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
        return sport.$remove(id);
      },
      delete: function(id) { return this.remove(id); } // alias
    };
  }
);