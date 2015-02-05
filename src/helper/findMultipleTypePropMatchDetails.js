( function () {
  "use strict";



  var regexDetails = /^([a-zA-Z]+)(\d+)/;

  LAID.$findMultipleTypePropMatchDetails = function ( prop ) {
      return prop.match( regexDetails );
  };



})();
