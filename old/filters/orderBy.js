'use strict';

app.filter('orderPlayerByName', function() {
  return function(items, field, reverse) {
    //console.log(items);
    var filtered = [];
    angular.forEach(items, function(item) {
      if (item.skill) filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (
        a.name.localeCompare(b.name)
      );
    });
    if (reverse) filtered.reverse();

    // remove $$hashKey (?)
    for (var i = 0; i < filtered.length; ++i) {
      delete filtered[i].$$hashKey;
    }

    return filtered;
  };
});

app.filter('orderPlayerBySkill', function() {
  return function(items, field, reverse) {
    //console.log(items);
    var filtered = [];
    angular.forEach(items, function(item) {
      if (item.skill) filtered.push(item);
    });
    filtered.sort(function (a, b) {
      //if (!a.skill || !b.skill) return -1; // skip non-player-objects...
      // order by skill.sigma ascending, and then skill.mu descending
      return (
        a.skill.sigma < b.skill.sigma ? 1 :
        a.skill.sigma > b.skill.sigma ? -1:
        a.skill.mu > b.skill.mu ? 1 : -1
      );
    });
    if (reverse) filtered.reverse();

    // remove $$hashKey (?)
    for (var i = 0; i < filtered.length; ++i) {
      delete filtered[i].$$hashKey;
    }

    return filtered;
  };
});

app.filter('orderSportByName', function() {
  return function(items, field, reverse) {
    //console.log(items);
    var filtered = [];
    angular.forEach(items, function(item) {
      if (item.name) filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (
        a.name.localeCompare(b.name)
      );
    });
    if (reverse) filtered.reverse();

    // remove $$hashKey (?)
    for (var i = 0; i < filtered.length; ++i) {
      delete filtered[i].$$hashKey;
    }

    return filtered;
  };
});

