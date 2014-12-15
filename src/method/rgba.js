(function() {
  "use strict";


  function takeRGBA ( h, s, l, a ) {

    var color = new LSON.Color( "rgb", { r: r, g: g, b: b }, a );

  }

  LSON.rgba = function ( r, g, b, a ) {


    if ( r instanceof LSON.Take ||
      g instanceof LSON.Take ||
      b instanceof LSON.Take ||
      a instanceof LSON.Take ) {

          return new LSON.Take( takeRGBA ).fn( r, g, b, a );

      } else {

        return new LSON.Color( "rgb", { r: r, g: g, b: b }, a );
      }

    };

  })();
