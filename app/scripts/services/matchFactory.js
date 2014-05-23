'use strict';

app.factory('matchFactory',
  function($firebase, FIREBASE_URL) {
    var url = FIREBASE_URL + '/' + 'match';
    var ref = new Firebase(url);
    var matches = $firebase(ref);

    return {
      ref: ref,
      all: match,
      add: function(match) {
        return matches.$add(match);
      },
      find: function(id) {
        return matches.$child(id);
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
        return matches.$remove(id);
      },
      delete: function(id) { return this.remove(id); } // alias
    };
  }
);