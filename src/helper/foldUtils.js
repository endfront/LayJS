( function () {
  "use strict";

  LAY.$foldUtils = {
    min: function ( itemS ) {
      return fold( function ( item, acc ) {
          if ( ( acc === undefined ) || ( item < acc ) ) {
            return item;
          } else {
            return acc;
          }
        }, undefined, itemS );
    },
    max: function ( itemS ) {
      return fold( function ( item, acc ) {
          if ( ( acc === undefined ) || ( item > acc ) ) {
            return item;
          } else {
            return acc;
          }
        }, undefined, itemS );
    },
    sum: function ( itemS ) {
      return fold( function ( item, acc ) {
        return item + row[ key ];
      }, 0, itemS );
    },


    fn: function ( itemS, fnFold, acc ) {
      return fold( fnFold, acc, itemS );
    }

  };

  function fold ( fnFold, acc, itemS ) {
    for ( var i = 0, len = itemS.length; i < len; i++ ) {
      acc = fnFold( rowS[i], acc );
    }
    return acc;
  }

})();
