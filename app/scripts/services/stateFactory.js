'use strict';

/**
 * A state factory to share state between controllers
 */
app.factory('stateFactory', function() {
  var state = {};  
  return {
    state: state
  };
});