'use strict';

app.directive('visualrating', function() {
  return {
    restrict: 'E',
    template: '<span title="The bar length is the rating \'&sigma;\', which measures the player\'s skill; the bar height is the rating \'&mu;\', which measures the reliability of the skill (directly proportional to the number of matches played)">{{sigma | number:2}}</span> <span class="rating-bar" style="width:{{sigma / 4}}em; height:{{((25 / 3) - mu + 0.5) / 10}}em"></span>',
    link: function(scope, element, attrs) {
      attrs.$observe('ratin', function(value) {
        console.info(JSON.parse(value));
        var jsonvalue = JSON.parse(value);
        scope.sigma = jsonvalue.sigma;
        scope.mu = jsonvalue.mu;
      });
    }
  };
});

/*
app.directive('visualrating', function() {
/*
  return {
    restrict: 'E',
    replace: true,
    scope: { rating: '@' },
    template: '<div>{{rating.sigma}}, {{rating.mu}}</div>'
  };
* /
  return {
    scope: { rating: '@rating' },
    template: '<div>{{rating}}</div>',
    link: function(scope, element, attrs) {
      attrs.$observe('rating', function(rating) {
        scope.rating = rating;
      });
    }
  };
/*
  return {
    restrict: 'E',
    //replace: true,
    template: '&sigma; <span id="rating" class="rating-bar" s_tyle="width:{{sigma}}; height:{{mu}}> </span> <div class="rotate">&mu;</div>',
    //template: 'E<span id="rating" class="rating-bar" s_tyle="width:{{sigma}}; height:{{mu}}>A</span>',
    link: function(scope, elem/*, attrs* /) {
      elem.bind('click', function() {
        elem.css('background-color', 'white');
        scope.$apply(function() {
          scope.color = 'white';
        });
      });
      elem.bind('mouseover', function() {
        elem.css('cursor', 'pointer');
      });
    }
  };
* /
});
*/