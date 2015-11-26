(function() {
  "use strict";

  LAID.unclog = function () {

    if ( --LAID.$numClog === 0 ) {
      LAID.$solve();
    }
    
  };

})();
