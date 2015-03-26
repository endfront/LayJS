( function () {
  "use strict";
  LAID.$solveForNew = function () {

    var
      i, len,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      newLevelS = LAID.$newLevelS,
      newLevel,
      solvedLevelS = [];

    if ( !newLevelS.length ) {
      return 3;
    }
    //LAID.$isSolvingNewLevels = true;

    do {
      isSolveProgressed = false;
      for ( i = 0; i < newLevelS.length; i++ ) {
        newLevel = newLevelS[ i ];
        if ( newLevel.$inherit() ) {
          newLevel.$identifyAndReproduce();
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          solvedLevelS.push( newLevel );
          LAID.$arrayUtils.removeAtIndex( newLevelS, i );
          i--;
        }
      }
   
    } while ( ( newLevelS.length !== 0 ) && isSolveProgressed );

    for ( i = 0, len = solvedLevelS.length; i < len; i++ ) {
      solvedLevelS[ i ].$initAllAttrs();
    }

    //LAID.$isSolvingNewLevels = false;


    return newLevelS.length === 0 ?  0 :
      isSolveProgressedOnce ? 1 : 2;
   
  };

})();
