( function () {
  "use strict";

  LAID.$queryUtils = {
    
    fetch: function ( partLevelS, index, attr ) {
  
            
      if ( index < 1 ) {
        console.error(
          "LAID Warning: Filter indexing begins from 1" );
        return undefined;

      } else {
        if ( !partLevelS[ index - 1 ] ) {
          return null;
        } else {
          return partLevelS[ index - 1 ].$getAttrVal( attr ).calcVal;
        }
      }

    },

   /* fetchAll: function ( partLevelS ) {
      return partLevelS;
    } */

  };

  

})();
