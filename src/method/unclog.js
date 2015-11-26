(function() {
  "use strict";

  LAY.unclog = function () {

    if ( --LAY.$numClog === 0 ) {
      LAY.$solve();
    }
    
  };

})();
