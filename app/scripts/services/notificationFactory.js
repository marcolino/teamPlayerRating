'use strict';

app.factory('notificationFactory', function () {
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "positionClass": "toast-bottom-left",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "4000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  return {
    success: function (text) {
      toastr.success(text, "Success");
    },
    info: function (text) {
      toastr.success(text, "Info");
    },
    warning: function (text) {
      toastr.warning(text);
    },
    error: function (text) {
      toastr.error(text, "Error");
    }
  };
});