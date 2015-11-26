( function () {
  "use strict";

  var regexDetails = /^([a-zA-Z]+)(\d+)/;

  LAY.$findMultipleTypePropMatchDetails = function ( prop ) {
      return prop.match( regexDetails );
  };



})();
