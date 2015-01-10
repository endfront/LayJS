( function () {
  "use strict";
  LAID.$solveForRecalculation = function () {

    var i, len,
    isSolveProgressed,
    ret,
    recalculateDirtyLevelS = LAID.$recalculateDirtyLevelS;

    do {
      isSolveProgressed = false;
      for ( i = 0, len = recalculateDirtyLevelS.length; i < len; i++ ) {
        ret = recalculateDirtyLevelS[ i ].$solveForRecalculation();
        if ( ret !== 3 ) {
          isSolveProgressed = true;
          if ( ret === 1 ) {
            LAID.$arrayUtils.remove( recalculateDirtyLevelS, recalculateDirtyLevelS[ i ] );
            i--;
          }
        }
      }
      // The reason we will not use `len` to check the length below is
      // that more recalculate dirty levels could have been added during
      // the loop
    } while ( ( recalculateDirtyLevelS.length !== 0 ) && isSolveProgressed );

    if ( recalculateDirtyLevelS.length !== 0 ) {
      throw "LAID Error: Circular/Undefined Reference Encountered";
    }

  };

})();
