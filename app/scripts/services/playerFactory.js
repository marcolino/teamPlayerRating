'use strict';

app.factory('playerFactory',
  function($firebase, FIREBASE_URL) {
    var url = FIREBASE_URL + '/' + 'players';
    var ref = new Firebase(url);
    var players = $firebase(ref);

    var Player = {
      ref: ref,
      all: players
    };

    Player.add = function(player) {
      if (Player.findByProperty('name', player.name)) {
          console.error('ERROR: duplicate player name', player.name);
          return null;
      }
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
    };
    Player.set = function(id, player) {
      ref.child(id).set(player);
    };
    Player.find = function(id) {
      return players.$child(id);
    };
    Player.findByProperty = function(property, value) {
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
    };
    Player.remove = function(id) {
      // note: removes all players if id is null
      return players.$remove(id);
    };
    Player.setRating = function(id, rating) {
      console.info('id:', id);
      console.info('ref.child(id):', ref.child(id));
      ref.child(id).skill.set(rating);
    };

    return Player;
  }
);