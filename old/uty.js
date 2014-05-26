function isTouchDevice() {
  return 'ontouchstart' in window // works on most browsers 
    || 'onmsgesturechange' in window; // works on ie10
};

function clone(obj) {
  var target = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
    }
  }
  return target;
}

function getObjects(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(obj[key]);
  }
  return keys;
}

Array.prototype.containsProperty = function(property, value) {
  for (var i = 0; i < this.length; i++) {
    if (!property in this) {
      break;
    }
    if (this[i][property] === value) {
      return this[i];
    }
  }
  return null;
}

Array.prototype.removeObjectByProperty = function(property, value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][property] === value) {
      var obj = this[i];
      this.splice(i, 1);
      return obj;
    }
  }
  return null;
}