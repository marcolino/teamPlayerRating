/**
 * Utility functions
 */

'use strict';

var objectLength = function (obj) {
  var length = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      ++length;
    }
  }
  return length;
};

var objectIsEmpty = function (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};

var objectDelete = function (obj, stack) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        objectDelete(obj[prop], stack + '.' + prop);
        delete obj[prop];
      } else {
        console.log(prop, ':', obj[prop]);
        delete obj[prop];
      }
    }
  }
};

var tableColumns = function (table) {
/*
  var colCount = 0;
  $('tr:nth-child(1) td').each(function () {
    if ($(this).attr('colspan')) {
      colCount += $(this).attr('colspan');
    } else {
      colCount++;
    }
  });
  return colCount;
*/
  var cols = $('#' + table).find('tr:first td');
  var count = 0;
  for (var i = 0; i < cols.length; i++) {
    var colspan = cols.eq(i).attr('colspan');
    if (colspan && colspan > 1) {
      count += colspan;
    } else {
      count++;
    }
  }
  return count;
};

var tableRows = function (table) {
/*
  var rowCount = 0;
  $('tr').each(function () {
    rowCount++;
  });
  return rowCount;
*/
  var rows = $('#' + table).find('tr:first');
  var count = 0;
  for (var i = 0; i < rows.length; i++) {
    count++;
  }
  return count;
};

/**
 * mySpinner class
 */
var Jspinner = function () {
  this.options = {
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
  this.spinner = new Spinner(this.options).spin();

  this.show = function () {
    document.getElementsByClassName('j-spinner')[0].appendChild(this.spinner.el);
  //document.getElementById('main').appendChild(this.spinner.el);
  };
  this.hide = function () {
    this.spinner.stop();
  };
};