'use strict';

app.factory('sportFactory',
  function($firebase, FIREBASE_URL) {
    var url = FIREBASE_URL + '/' + 'sports';
    var ref = new Firebase(url);
    var sports = $firebase(ref);

    return {
      ref: ref,
      all: sports,
      add: function(sport) {
        ref.child(sport.name).set(sport);
      },
      find: function(id) {
        return sports.$child(id);
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
        return sports.$remove(id);
      },
      delete: function(id) { return this.remove(id); } // alias
    };
  }
);