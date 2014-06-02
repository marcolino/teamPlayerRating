'use strict';

app.directive('trapKey', function() {
  var KEY_ENTER = 13;
  var KEY_ESCAPE = 27;
//var KEY_SPACE = 32;
//var KEY_BACKSPACE = 8;
//var KEY_TAB = 9;

  var key = null;
  return function (scope, element, attrs) {
    switch (attrs.key) {
      case 'enter':
        key = KEY_ENTER;
        break;
      case 'escape':
        key = KEY_ESCAPE;
        break;
      default:
        key = KEY_ENTER;
    }
    element.bind('keydown keypress', function (event) {
      if (event.which === key) {
        scope.$apply(function(){
          scope.$eval(attrs.trapKey, { 'event': event });
        });
        event.preventDefault();
      }
    });
  };
});