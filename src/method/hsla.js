(function() {
  "use strict";

  function takeHSLA ( h, s, l, a ) {

    var color = new LAY.Color( "hsl", { h: h, s: s, l: l }, a );

  }

  LAY.hsla = function ( h, s, l, a ) {

    if ( h instanceof LAY.Take ||
      s instanceof LAY.Take ||
      l instanceof LAY.Take ||
      a instanceof LAY.Take ) {

        return new LAY.Take( takeHSLA ).fn( h, s, l, a );

      } else {
        return new LAY.Color( "hsl", { h: h, s: s, l: l }, a );
      }

    };

  })();
