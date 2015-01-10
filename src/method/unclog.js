(function() {
  "use strict";


  LAID.unclog = function () {

    var i, len,
     cloggedLevelS = LAID.cloggedLevelS;
    for ( i = 0, len = cloggedLevelS.length; i < len; i++ ) {
      LAID.$newLevelS.push( cloggedLevelS[ i ] );

    }
    LAID.$solveForNew();
    
  };

})();
