(function() {
  "use strict";


  LAY.$meta = {


    set: function ( lson, metaDomain, attr, val  ) {

      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        lson[ fullMetaDomain ] = {};
      }
      lson[ fullMetaDomain ][attr] = val;

    },

    get: function ( lson, metaDomain, attr  ) {
    
      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        return undefined;
      } else {
        return lson[ fullMetaDomain ][attr];
      }
    },

    inherit: {
     
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
