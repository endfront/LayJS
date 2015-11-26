( function () {
  "use strict";
  LAID.$solve = function () {

    if ( LAID.$isRendering ) {
      LAID.$isSolveRequiredOnRenderFinish = true;
    } else if ( !LAID.$isSolving && LAID.$numClog === 0 ) {
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
        executeManyLoads();


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
        var msg = "LAID Error: Circular/Undefined Reference Encountered [";
        if ( !isSolveNewComplete ) {
          msg += "Uninheritable Level: " + LAID.$newLevelS[ 0 ].pathName;
        } else {
          var uninstantiableLevel = LAID.$recalculateDirtyLevelS[ 0 ];
          msg += "Uninstantiable Attr: " +
             uninstantiableLevel.recalculateDirtyAttrValS[ 0 ].attr +
            " (Level: " + uninstantiableLevel.pathName  + ")";
        } 
        msg += "]";
        console.log(msg);
        throw msg;

      }

      LAID.$isSolving = false;
      LAID.$render();

    }

  };

  function executeManyLoads () {
    var newManyS = LAID.$newManyS, newMany, fnLoad;

    for ( var i = 0, len = newManyS.length; i < len; i++ ) {
      newMany = newManyS[ i ];
      newMany.isLoaded = true;
      newMany.updateFilteredPositioning();
      fnLoad = newMany.level.lson.$load;
      if ( fnLoad ) {
        fnLoad.call( newMany.level );
      }
    }
    LAID.$newManyS = [];
 
  }

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
      newlyInstalledStateS = newlyInstalledStateLevel.newlyInstalledStateS;
      for ( j = 0, jLen = newlyInstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyInstalledStateInstall =
          newlyInstalledStateLevel.attr2attrVal[ newlyInstalledStateS[ j ] +
          ".install" ];
        attrValNewlyInstalledStateInstall &&
          ( LAID.type(attrValNewlyInstalledStateInstall.calcVal ) ===
          "function") &&
          attrValNewlyInstalledStateInstall.calcVal.call(
          newlyInstalledStateLevel );
      }
      // empty the list
      newlyInstalledStateLevel.newlyInstalledStateS = [];
    }
    LAID.$newlyInstalledStateLevelS = [];

    for ( i = 0, len = newlyUninstalledStateLevelS.length; i < len; i++ ) {
      newlyUninstalledStateLevel = newlyUninstalledStateLevelS[ i ];
      newlyUninstalledStateS = newlyUninstalledStateLevel.newlyUninstalledStateS;
      for ( j = 0, jLen = newlyUninstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyUninstalledStateUninstall =
          newlyUninstalledStateLevel.attr2attrVal[ newlyUninstalledStateS[ j ] +
          ".uninstall" ];
        attrValNewlyUninstalledStateUninstall &&
          ( LAID.type( attrValNewlyUninstalledStateUninstall.calcVal) ===
          "function") &&
          attrValNewlyUninstalledStateUninstall.calcVal.call( 
          newlyUninstalledStateLevel );
      }
      // empty the list
      newlyUninstalledStateLevel.newlyUninstalledStateS = [];
    }
    LAID.$newlyUninstalledStateLevelS = [];
  }


})();
