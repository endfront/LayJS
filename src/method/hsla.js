(function() {
  "use strict";


  LSON.hsla = function ( h, s, l, a ) {

    var color = new LSON.Color( "hsl", { h: h, s: s, l: l }, a );

    if ( h instanceof LSON.Take ||
      s instanceof LSON.Take ||
      l instanceof LSON.Take ||
      a instanceof LSON.Take ) {

        var takeColor = new LSON.take( color );
        if ( h instanceof LSON.Take ) {
          takeColor = takeColor.setKey( "h", h );
        }
        if ( s instanceof LSON.Take ) {
          takeColor = takeColor.setKey( "s", s );
        }
        if ( l instanceof LSON.Take ) {
          takeColor = takeColor.setKey( "l", l );
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
