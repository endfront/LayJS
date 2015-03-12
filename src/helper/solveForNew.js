( function () {
  "use strict";
  LAID.$solveForNew = function () {

    var
      i, len,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      newLevelS = LAID.$newLevelS,
      solvedLevelS = [];

    //LAID.$isSolvingNewLevels = true;

    do {
      isSolveProgressed = false;
      for ( i = 0; i < newLevelS.length; i++ ) {
        if ( newLevelS[ i ].$inheritAndReproduce() ) {
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          solvedLevelS.push( newLevelS[ i ] );
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
