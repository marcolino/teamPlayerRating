/**
 * System utility functions factory
 */
'use strict';

app.factory('spinnerFactory', function () {
  var options = {
    lines: 13, // the number of lines to draw
    length: 14, // the length of each line
    width: 13, // the line thickness
    radius: 31, // the radius of the inner circle
    corners: 1, // corner roundness (0..1)
    rotate: 0, // the rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#aaa', /* [ 'green', 'blue', 'darkgreen', 'darkblue' ], */ // #rgb or #rrggbb or array of colors
    speed: 1.1, // rounds per second
    trail: 61, // afterglow percentage
    shadow: true, // whether to render a shadow
    hwaccel: false, // whether to use hardware acceleration
    className: 'spinner', // the CSS class to assign to the spinner
    zIndex: 2e9, // the z-index (defaults to 2000000000)
    top: '50%', // top position relative to parent
    left: '50%' // left position relative to parent
  };
  var spinner = new Spinner(options).spin();
  
  return {

    show: function () {
      document.getElementsByClassName('j-spinner')[0].appendChild(spinner.el);
    //document.getElementById('main').appendChild(this.spinner.el);
    },

    hide: function () {
      spinner.stop();
    }

  };
});