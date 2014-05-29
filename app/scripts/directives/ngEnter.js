'use strict';

app.directive('ngEnter', function() {
  var KEY_ENTER = 13;
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === KEY_ENTER) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, { 'event': event });
        });
        event.preventDefault();
      }
    });
  };
});