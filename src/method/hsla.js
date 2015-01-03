(function() {
  "use strict";

  function takeHSLA ( h, s, l, a ) {

    var color = new LAID.Color( "hsl", { h: h, s: s, l: l }, a );

  }

  LAID.hsla = function ( h, s, l, a ) {

    if ( h instanceof LAID.Take ||
      s instanceof LAID.Take ||
      l instanceof LAID.Take ||
      a instanceof LAID.Take ) {

        return new LAID.Take( takeHSLA ).fn( h, s, l, a );

      } else {
        return new LAID.Color( "hsl", { h: h, s: s, l: l }, a );
      }

    };

  })();
