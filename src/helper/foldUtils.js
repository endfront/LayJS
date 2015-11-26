( function () {
  "use strict";

  LAY.$foldlUtils = {
    min: function ( rowS, key, val ) {
      return fold( function ( row, acc ) {
        var val = row[ key ];
          if ( ( acc === undefined ) || ( val < acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, rowS ); 
    },
    max: function ( rowS, key, val ) {
      return fold( function ( row, acc ) {
        var val = row[ key ];
          if ( ( acc === undefined ) || ( val > acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, rowS ); 
    },
    sum: function ( rowS, key, val ) {
      return fold( function ( row, acc ) {
        return acc + row[ key ];
        }, 0, rowS );
    },

    
    fn: function ( rowS, fnFold, acc ) {
      return fold( fnFold, acc, rowS );      
    }
  

  };

  function fold ( fnFold, acc, rowS ) {
    for ( var i = 0, len = rowS.length; i < len; i++ ) {
      acc = fnFold( rowS[ i ], acc );
    }
    return acc;
  }

})();
