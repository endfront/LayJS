(function() {
  "use strict";


  LAY.$meta = {


    set: function ( lson, metaDomain, attr, val  ) {

      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        lson[ fullMetaDomain ] = {};
      }
      lson[ fullMetaDomain ][ attr ] = val;

    },

    get: function ( lson, metaDomain, attr  ) {
    
      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        return undefined;
      } else {
        return lson[ fullMetaDomain ][ attr ];
      }
    },

    inherit: {
      /*
      $$keys: function ( intoLson, fromLson ) {

        var
        fromAttr2keyS = fromLson.$$keys,
        intoAttr2keyS = intoLson.$$keys,
        fromAttr,
        fromKeyS,
        intoKeyS,
        i, len;


        if ( intoAttr2keyS === undefined ) {
          intoAttr2keyS = intoLson.$$keys = {};
        }

        for ( fromAttr in fromAttr2keyS ) {
            fromKeyS = fromAttr2keyS[ fromAttr ];
            intoKeyS = intoAttr2keyS[ fromAttr ];
            if ( intoKeyS === undefined ) {
              intoAttr2keyS[ fromAttr ] = LAY.$arrayUtils.cloneSingleLevel( fromKeyS );
            } else {
              for ( i = 0, len = fromKeyS.length; i < len; i++ ) {
                LAY.$arrayUtils.pushUnique( intoKeys, fromKeyS[ i ] );
              }
          }
        }
      },
      */

      $$max: function ( intoLson, fromLson ) {

        var
          fromAttr2max = fromLson.$$max,
          intoAttr2max = intoLson.$$max,
          fromAttr;

        if ( intoAttr2max === undefined ) {
          intoAttr2max = intoLson.$$max = {};
        }

        for ( fromAttr in fromAttr2max ) {
            if ( intoAttr2max[ fromAttr ] === undefined ) {
              intoAttr2max[ fromAttr ] =
              fromAttr2max[ fromAttr ];
            } else {
              intoAttr2max[ fromAttr ] = Math.max(
                intoAttr2max[ fromAttr ],
                fromAttr2max[ fromAttr ]
              );
            }
        }
      }
    }
  };

})();
