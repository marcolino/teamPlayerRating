/**
 * System utility functions factory
 */
'use strict';

app.factory('sysFactory', function () {
  return {

    objectLength: function (obj) {
      var length = 0;
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (typeof obj[prop] === 'object') {
            if (obj[prop] !== null) {
              ++length;
            }
          }
        }
      }
      return length;
    },

    objectDelete: function (obj, stack) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (typeof obj[prop] === 'object') {
            this.objectDelete(obj[prop], stack + '.' + prop);
            delete obj[prop];
          } else {
            console.log(prop, ':', obj[prop]);
            delete obj[prop];
          }
        }
      }
    },
    
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
    /*
    tableColumns: function (table) {
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
    },
    */
    
    /*
      var rowCount = 0;
      $('tr').each(function () {
        rowCount++;
      });
      return rowCount;
    */
    /*
    tableRows: function (table) {
      var rows = $('#' + table).find('tr:first');
      var count = 0;
      for (var i = 0; i < rows.length; i++) {
        count++;
      }
      return count;
    }
    */

  };
});