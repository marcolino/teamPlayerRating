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
        return players.$add(player);
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

/*
app.factory('playersFactory', 
  function ($firebase, FIREBASE_URL, $rootScope) {
    var ref = new Firebase(FIREBASE_URL + '/' + 'players');
    var players = $firebase(ref);

    var Player = {
      getAllplayers: function() {
        return players;
      },
      addPlayer: function (player) {
        console.log('factory');
        console.log(player);
        players[player.name] = {
          name: player.name,
          skill: 0 / * player.skill * /
        };
   
        players.$save(player.name).then(function () {
          setCurrentPlayer(player.name);
        });
      },
      findPlayerByName: function (name) {
        if (name) {
          return players.$child(name);
        }
      }
    };

    function setCurrentPlayer (name) {
      $rootScope.currentPlayer = Player.findPlayerByName(name);
    }
  
    function resetCurrentPlayer () {
      delete $rootScope.currentPlayer;
    }

    return Player;
  }
);
*/

/*
    return {
      getAllplayers: function(path) {
        return angularFireCollection(baseUrl + '/' + path);
      },
      getplayer: function(path, player) {
        return angularFireCollection(baseUrl + '/' + path + '/' + player);
      },
      addplayer: function(path) {
        var player = {
          title: 'Untitled player...',
          playerbook: 'My playerbook',
          url: '',
          tags: '',
          description: '',
          modified: new Date().getTime(),
          created: new Date().getTime()
        };
        this.getAllplayers(path).add(player, function(snap) {
          console.log('player added', snap);
        });
      },
      editplayer: function(path, player) {
        if (player === null) {
          return;
        }
        this.getAllplayers(path).update(player);
      },
      deleteplayer: function(path, player) {
        console.log(this.getAllplayers(path));
        var players = this.getAllplayers(path);
        players.remove(player);
      }
    };
  }
);
*/


/*
app.factory('fireService',
  function ($firebase, FIREBASE_URL / *, $rootScope* /) {
    //var _url = FIREBASE_URL + '/' + 'players';
    //var _ref = new Firebase(_url);
    var y;

    var rootRef = new Firebase(FIREBASE_URL);
    var playersRef = rootRef.child("/players");
    //console.info($firebase);
    
    playersRef.on('value', function(nameSnapshot) {
      var y = nameSnapshot.val();
      console.info(".on('value'): "); console.info(y);
      // y now contains the object { first: 'Fred', last: 'Flintstone' }.
    });

    //console.info($firebase);
    return {
      / *
      setListToScope: function (scope, localScopeVarName) {
        $firebase(_ref, scope, localScopeVarName);
      },
      * /
      getItem: function(id) {
        //return $firebase(_ref).$child(id);
      },
      getAll: function() {
        //return $firebase(_ref);
        return y;
      },
      addItem: function (item) {
        //_ref.push(item);
      },
      findItem: function (id) {
        //return _ref.$child(id); // FUNZIONA?
      },
      removeItem: function(id) {
        //var itemRef = new Firebase(_url + '/' + id);
        //itemRef.remove();
        ////_ref.$child(id).remove(); // PERCHE' NO?
      },
      removeAll: function() {
        //_ref.remove();
      }
    };
  }
);
*/



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