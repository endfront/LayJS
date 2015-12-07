( function () {
  "use strict";
  LAY.$solveForRecalculation = function () {


    var 
      i,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      ret,
      recalculateDirtyAttrValS = LAY.$recalculateDirtyAttrValS;
      
    if ( !recalculateDirtyAttrValS.length ) {
      return 3;
    }

    do {
      isSolveProgressed = false;
      for ( i = 0; i < recalculateDirtyAttrValS.length; i++ ) {
        ret =
          recalculateDirtyAttrValS[ i ].recalculate();

        if ( ret ) {
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          LAY.$arrayUtils.removeAtIndex( recalculateDirtyAttrValS, i );
          i--;
        }
      }
    
    } while ( ( recalculateDirtyAttrValS.length !== 0 ) && isSolveProgressed );


    return recalculateDirtyAttrValS.length === 0 ?  0 :
      isSolveProgressedOnce ? 1 : 2;

  };

})();
