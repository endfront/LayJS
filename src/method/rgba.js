(function() {
  "use strict";


  LSON.rgba = function ( r, g, b, a ) {

    var color = new LSON.Color( "rgb", { r: r, g: g, b: b }, a );

    if ( r instanceof LSON.Take ||
      g instanceof LSON.Take ||
      b instanceof LSON.Take ||
      a instanceof LSON.Take ) {

          var takeColor = new LSON.take( color );
          if ( r instanceof LSON.Take ) {
            takeColor = takeColor.setKey( "r", r );
          }
          if ( g instanceof LSON.Take ) {
            takeColor = takeColor.setKey( "g", g );
          }
          if ( b instanceof LSON.Take ) {
            takeColor = takeColor.setKey( "b", b );
          }
          if ( a instanceof LSON.Take ) {
            takeColor = takeColor.setKey( "a", a );
          }

        return takeColor;

      } else {
        return color;
      }

    };

  })();
