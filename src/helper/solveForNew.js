( function () {
  "use strict";
  LAY.$solveForNew = function () {

    var
      i, len,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      newLevelS = LAY.$newLevelS,
      newLevel,
      solvedLevelS = [],
      manyWithNewLevelS = [],
      manyWithNewLevel;

    if ( !newLevelS.length ) {
      return 3;
    }
    
    do {
      isSolveProgressed = false;
      for ( i = 0; i < newLevelS.length; i++ ) {
        newLevel = newLevelS[ i ];
        if ( newLevel.$normalizeAndInherit() ) {
          newLevel.$identifyAndReproduce();
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          solvedLevelS.push( newLevel );
          LAY.$arrayUtils.removeAtIndex( newLevelS, i );
          i--;
          if ( newLevel.derivedMany ) {
            LAY.$arrayUtils.pushUnique(
             manyWithNewLevelS, newLevel.derivedMany );
          }
        }
      }
   
    } while ( ( newLevelS.length !== 0 ) && isSolveProgressed );

    for ( i = 0, len = solvedLevelS.length; i < len; i++ ) {
      solvedLevelS[ i ].$initAllAttrs();
    }

    for ( i = 0, len = manyWithNewLevelS.length;
     i < len; i++ ) {
      manyWithNewLevel = manyWithNewLevelS[ i ];
      manyWithNewLevel.level.attr2attrVal.filter.forceRecalculation();
    }

    return newLevelS.length === 0 ? 0 :
      isSolveProgressedOnce ? 1 : 2;
   
  }

})();
