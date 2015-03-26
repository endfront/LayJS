( function () {
  "use strict";

  LAID.$foldlUtils = {
    min: function ( partLevelS, attr, val ) {
      return fold( function ( part, acc ) {
        var val = part.attr( attr );
          if ( ( acc === undefined ) || ( val < acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, partLevelS ); 
    },
    max: function ( partLevelS, attr, val ) {
      return fold( function ( part, acc ) {
        var val = part.attr( attr );
          if ( ( acc === undefined ) || ( val > acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, partLevelS ); 
    },
    sum: function ( partLevelS, attr, val ) {
      return fold( function ( part, acc ) {
        return acc + part.attr( attr );
        }, 0, partLevelS ); 
    },

    
    fn: function ( partLevelS, fnFold, acc ) {
      return fold( fnFold, acc, partLevelS );      
    },
  

  };

  function fold ( fnFold, acc, partLevelS ) {
    for ( var i = 0, len = partLevelS.length; i < len; i++ ) {
      acc = fnFold( partLevelS[ i ], acc );
    }
    return acc;
  }

})();
