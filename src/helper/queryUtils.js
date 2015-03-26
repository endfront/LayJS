( function () {
  "use strict";

  LAID.$queryUtils = {
    
    fetch: function ( partLevelS, index, attr ) {
      
      if ( index === 0 ) {
        throw "LAID Warning: Filter indexing begins from 1";
      } 
      return partLevelS[ index - 1 ].$getAttrVal( attr ).calcVal;

    }

  };

  

})();
