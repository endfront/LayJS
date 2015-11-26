(function() {
  "use strict";


  function takeRGBA ( r, g, b, a ) {

    return new LAY.Color( "rgb", { r: r, g: g, b: b }, a );

  }

  LAY.rgba = function ( r, g, b, a ) {


    if ( r instanceof LAY.Take ||
      g instanceof LAY.Take ||
      b instanceof LAY.Take ||
      a instanceof LAY.Take ) {

          return new LAY.Take( takeRGBA ).fn( r, g, b, a );

      } else {

        return new LAY.Color( "rgb", { r: r, g: g, b: b }, a );
      }

    };

  })();
