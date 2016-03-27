( function () {
  "use strict";
  LAY.$solveForNew = function () {

    var
      i, len,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      newLevelS = LAY.$newLevelS,
      newLevel,
      solvedLevelS = [];

    if ( !newLevelS.length ) {
      return 3;
    }

    do {
      isSolveProgressed = false;
      for ( i = 0; i < newLevelS.length; i++ ) {
        newLevel = newLevelS[i];
        if ( newLevel.$inherit() ) {
          newLevel.$identify();
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          solvedLevelS.push( newLevel );
          LAY.$arrayUtils.removeAtIndex( newLevelS, i );
          i--;
        }
      }

    } while ( ( newLevelS.length !== 0 ) && isSolveProgressed );

    for ( i = 0, len = solvedLevelS.length; i < len; i++ ) {
      solvedLevelS[i].$decideExistence();
    }



    return newLevelS.length === 0 ? 0 :
      isSolveProgressedOnce ? 1 : 2;

  }

})();
