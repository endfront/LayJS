(function() {
  "use strict";


  function takeRGBA ( h, s, l, a ) {

    var color = new LAID.Color( "rgb", { r: r, g: g, b: b }, a );

  }

  LAID.rgba = function ( r, g, b, a ) {


    if ( r instanceof LAID.Take ||
      g instanceof LAID.Take ||
      b instanceof LAID.Take ||
      a instanceof LAID.Take ) {

          return new LAID.Take( takeRGBA ).fn( r, g, b, a );

      } else {

        return new LAID.Color( "rgb", { r: r, g: g, b: b }, a );
      }

    };

  })();
