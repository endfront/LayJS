( function () {
  "use strict";



  var regexDetails = /^([a-zA-Z]+)(\d+)/;

  LAID.$multipleTypePropUtils = {
    findMultipleTypePropMatchDetails: function ( prop ) {
      return prop.match( regexDetails );
    
    }

  };

})();
