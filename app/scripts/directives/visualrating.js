'use strict';

app.directive("visualrating", function() {
  return {
  	restrict: 'E',
    template: '<div>{{sigma}}</div>',
    link: function(scope, element, attrs) {
      attrs.$observe('ratin', function(value) {
      	console.info(JSON.parse(value));
        var jv = JSON.parse(value);
        scope.sigma = jv.sigma;
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