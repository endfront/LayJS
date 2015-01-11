( function () {
  "use strict";
  LAID.$solveForNew = function () {

    var i, len,
    isSolveProgressed,
    newLevelS = LAID.$newLevelS,
    solvedLevelS = [];

    LAID.$isSolvingNewLevels = true;

    do {
      isSolveProgressed = false;
      for ( i = 0, len = newLevelS.length; i < len; i++ ) {
        if ( newLevelS[ i ].$inheritAndReproduce() ) {
          isSolveProgressed = true;
          solvedLevelS.push( newLevelS[ i ] );
            LAID.$arrayUtils.removeAtIndex( newLevelS, i );
            i--;
        }
      }
      // The reason we will not use `len` to check the length below is
      // that more recalculate dirty levels could have been added during
      // the loop
    } while ( ( newLevelS.length !== 0 ) && isSolveProgressed );

    if ( newLevelS.length !== 0 ) {
      throw "LAID Error: Circular/Undefined Inherit Reference Encountered";
    }

    LAID.$isSolvingNewLevels = false;

    for ( i = 0, len = solvedLevelS.length; i < len; i++ ) {
      solvedLevelS[ i ].$initAllAttrs();
    }

    LAID.$solveForRecalculation();

  };

})();
