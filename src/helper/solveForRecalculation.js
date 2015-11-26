( function () {
  "use strict";
  LAY.$solveForRecalculation = function () {


    var 
      i,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      ret,
      recalculateDirtyLevelS = LAY.$recalculateDirtyLevelS;
      
    if ( !recalculateDirtyLevelS.length ) {
      return 3;
    }

    do {
      isSolveProgressed = false;
      for ( i = 0; i < recalculateDirtyLevelS.length; i++ ) {
        ret = recalculateDirtyLevelS[ i ].$solveForRecalculation();
        if ( ret !== 2 ) {
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          if ( ret === 0 ) {
            LAY.$arrayUtils.removeAtIndex( recalculateDirtyLevelS, i );
            i--;
          }
        }
      }
    
    } while ( ( recalculateDirtyLevelS.length !== 0 ) && isSolveProgressed );


    return recalculateDirtyLevelS.length === 0 ?  0 :
      isSolveProgressedOnce ? 1 : 2;

  };

})();
