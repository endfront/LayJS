( function () {
  "use strict";

  LAID.$queryUtils = {
    
    fetch: function ( partLevelS, index, attr ) {
  
            
      if ( index < 1 ) {
        console.error(
          "LAID Warning: Filter indexing begins from 1" );
        return undefined;

      } else {
       return partLevelS[ index - 1 ].$getAttrVal( attr ).calcVal;
      }

    }

  };

  

})();
