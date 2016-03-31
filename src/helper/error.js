(function () {
  "use strict";

  LAY.$error = function (msg) {
    msg = "LAY ERROR: " + msg;
    alert(msg);
    throw msg;
  }
})();
