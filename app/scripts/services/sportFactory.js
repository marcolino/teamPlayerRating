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
        return sports.$add(sport).then(
          function (ref) {
            var id = ref.name();
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
      set: function(id, sport) {
        ref.child(id).set(sport);
      },
      find: function(id) {
        return sports.$child(id);
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
        return sports.$remove(id);
      },
      select: function (id) {
        ref.once('value', function(ss) {
          ss.forEach(function(childSnapshot) {
            childSnapshot.ref().child('name').once('value', function(ss) {
              if (ss.val() === sports.$child(id).name) { // select requested sport
                childSnapshot.ref().child('selected').set(true);
              } else { // de-select other sports
                childSnapshot.ref().child('selected').set(false);
              }
            });
          });
        });
/*
        var obj = sports;
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (typeof obj[prop] === 'object') {
              if (prop === sport.name) {
                sport.selected = true;
                ref.child(sport.name).set(sport);
              } else {
                if (obj[prop] !== null) {
                  obj[prop].selected = false;
                  ref.child(prop).set(obj[prop]);
                }
              }
            }
          }
        }
*/
      },
      isSelected: function () {
        // TODO: should use "ref.once('value', ..."
        var obj = sports;
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (typeof obj[prop] === 'object') {
              if (obj[prop] !== null) {
                if (obj[prop].selected) {
                  return obj[prop].name;
                }
              }
            }
          }
        }
        return null;
      }
    };
  }
);