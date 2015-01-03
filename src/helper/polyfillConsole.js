(function () {
  "use strict";

  // Non console API compliant browsers will not throw an error
  
  if ( window.console === undefined ) {

    window.console = { error: function () {}, log: function () {}, info: function () {} };

  }

})();
