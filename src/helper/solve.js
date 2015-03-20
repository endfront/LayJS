( function () {
  "use strict";
  LAID.$solve = function () {

    console.log("foo");
    if ( !LAID.$isSolving ) {
      console.log("bar");

      var 
        ret,
        isSolveNewComplete,
        isSolveRecalculationComplete,
        isSolveProgressed,
        isSolveHaltedForOneLoop = false;

      LAID.$isSolving = true;

      do {

        isSolveProgressed = false;
        isSolveNewComplete = false;
        isSolveRecalculationComplete = false;

        ret = LAID.$solveForNew();

        if ( ret < 2 ) {
          isSolveProgressed = true;
        }
          
        ret = LAID.$solveForRecalculation();
        if ( ret < 2 ) {
          isSolveProgressed = true;
        }

        executeStateInstallation();

        // The reason we cannot use `ret` to confirm
        // completion and not `ret` is because during solving
        // for recalculation new levels could have been
        // added ((from many.rows), and during execution
        //  of state installation new recalculations or
        // levels could have been created 

        isSolveRecalculationComplete =
          LAID.$recalculateDirtyLevelS.length === 0;
        isSolveNewComplete =
          LAID.$newLevelS.length === 0;

        if ( !isSolveProgressed ) {
          if ( isSolveHaltedForOneLoop ) {
            break;
          } else {

            isSolveHaltedForOneLoop = true;
          }
        } else {
          isSolveHaltedForOneLoop = false;
        }

      } while ( !( isSolveNewComplete && isSolveRecalculationComplete ) );

      if ( !( isSolveNewComplete && isSolveRecalculationComplete ) ) {
        throw "LAID Error: Circular/Undefined Reference Encountered";      
      }

      LAID.$isSolving = false;
      LAID.$render();

    }

  };

  function executeStateInstallation () {

    var
      i, j, len, jLen,
      newlyInstalledStateLevelS = LAID.$newlyInstalledStateLevelS,
      newlyInstalledStateLevel,
      newlyInstalledStateS,
      attrValNewlyInstalledStateInstall,
      newlyUninstalledStateLevelS = LAID.$newlyUninstalledStateLevelS,
      newlyUninstalledStateLevel,
      newlyUninstalledStateS,
      attrValNewlyUninstalledStateUninstall;

    for ( i = 0, len = newlyInstalledStateLevelS.length; i < len; i++ ) {
      newlyInstalledStateLevel = newlyInstalledStateLevelS[ i ];
      newlyInstalledStateS = newlyInstalledStateLevel.$newlyInstalledStateS;
      for ( j = 0, jLen = newlyInstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyInstalledStateInstall =
          newlyInstalledStateLevel.$attr2attrVal[ newlyInstalledStateS[ j ] +
          ".install" ];
        attrValNewlyInstalledStateInstall &&
          ( LAID.type(attrValNewlyInstalledStateInstall.calcVal ) ===
          "function") &&
          attrValNewlyInstalledStateInstall.calcVal.call(
          newlyInstalledStateLevel );
      }
      // empty the list
      newlyInstalledStateLevel.$newlyInstalledStateS = [];
    }
    LAID.$newlyInstalledStateLevelS = [];

    for ( i = 0, len = newlyUninstalledStateLevelS.length; i < len; i++ ) {
      newlyUninstalledStateLevel = newlyUninstalledStateLevelS[ i ];
      newlyUninstalledStateS = newlyUninstalledStateLevel.$newlyUninstalledStateS;
      for ( j = 0, jLen = newlyUninstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyUninstalledStateUninstall =
          newlyUninstalledStateLevel.$attr2attrVal[ newlyUninstalledStateS[ j ] +
          ".uninstall" ];
        attrValNewlyUninstalledStateUninstall &&
          ( LAID.type( attrValNewlyUninstalledStateUninstall.calcVal) ===
          "function") &&
          attrValNewlyUninstalledStateUninstall.calcVal.call( 
          newlyUninstalledStateLevel );
      }
      // empty the list
      newlyUninstalledStateLevel.$newlyUninstalledStateS = [];
    }
    LAID.$newlyUninstalledStateLevelS = [];
  }


})();
