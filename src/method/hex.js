( function() {
  "use strict";

  function takeHex ( hex ) {

    return LAID.hex( hex );

  }

  LAID.hex = function ( hexVal ) {

    if ( hexVal instanceof LAID.Take ) {
        return new LAID.Take( takeHex ).fn( hexVal );
    } else {

      return new LAID.Color( 'rgb', hexToRgb(hexVal), 1 );        
    }

  };

  // source: http://stackoverflow.com/users/1047797/david
  // http://stackoverflow.com/a/11508164
  function hexToRgb(hex) {
    return {
      r: (hex >> 16) & 255,
      g: (hex >> 8) & 255,
      b: hex & 255
    };
  }

})();
