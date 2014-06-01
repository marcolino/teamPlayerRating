'use strict';

app.directive('limitTextLength', function($timeout) {
  return function(scope, element, attrs) {
    var maxLen = attrs.maxLen;
    var el = element.find("[id^=player-]");
    $timeout(function () {
      var name = el[0].innerHTML;
      scope.share.playersAvailable[name].nameTruncated = scope.share.playersAvailable[name].name;
      if (el.width() > maxLen) { // check text is not too wide
        while (el.width() > maxLen) {
          var nameTruncated = el.html();
          nameTruncated = nameTruncated.substring(0, nameTruncated.length - 1);
          el.html(nameTruncated);
        }
        nameTruncated += '<span style="font-size:10px">&hellip;</span>';
        el.html(nameTruncated);
        scope.share.playersAvailable[name].nameTruncated = nameTruncated;
      }
    });
  };
});