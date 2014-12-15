(function() {
  "use strict";

  function takeHSLA ( h, s, l, a ) {

    var color = new LSON.Color( "hsl", { h: h, s: s, l: l }, a );

  }

  LSON.hsla = function ( h, s, l, a ) {

    if ( h instanceof LSON.Take ||
      s instanceof LSON.Take ||
      l instanceof LSON.Take ||
      a instanceof LSON.Take ) {

        return new LSON.Take( takeHSLA ).fn( h, s, l, a );

      } else {
        return new LSON.Color( "hsl", { h: h, s: s, l: l }, a );
      }

    };

  })();
