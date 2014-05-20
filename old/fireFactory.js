'use strict';

app.factory('fireFactory',
  function fireFactory(FIREBASE_URL) {
    return {
      firebaseRef: function(path) {
        path = (path !== '') ? FIREBASE_URL + '/' + path : FIREBASE_URL;
        return new Firebase(path);
      }
    };
  }
);