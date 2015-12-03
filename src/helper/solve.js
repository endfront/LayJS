( function () {
  "use strict";
  LAY.$solve = function () {

    if ( LAY.$isRendering ) {
      LAY.$isSolveRequiredOnRenderFinish = true;
    } else if ( !LAY.$isSolving && LAY.$numClog === 0 ) {
      var 
        ret,
        isSolveNewComplete,
        isSolveRecalculationComplete,
        isSolveProgressed,
        isSolveHaltedForOneLoop = false;

      LAY.$isSolving = true;

      do {

        //alert("solve");

        isSolveProgressed = false;
        isSolveNewComplete = false;
        isSolveRecalculationComplete = false;

        ret = LAY.$solveForNew();

        if ( ret < 2 ) {
          isSolveProgressed = true;
        }
          
        ret = LAY.$solveForRecalculation();
        if ( ret < 2 ) {
          isSolveProgressed = true;
        }


        // The reason we cannot use `ret` to confirm
        // completion and not `ret` is because during solving
        // for recalculation new levels could have been
        // added ((from many.rows), and during execution
        //  of state installation new recalculations or
        // levels could have been created 

        isSolveRecalculationComplete =
          LAY.$recalculateDirtyLevelS.length === 0;
        isSolveNewComplete =
          LAY.$newLevelS.length === 0;

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
        var msg = "LAY Error: Circular/Undefined Reference Encountered [";
        if ( !isSolveNewComplete ) {
          msg += "Uninheritable Level: " + LAY.$newLevelS[ 0 ].pathName;
        } else {
          var uninstantiableLevel = LAY.$recalculateDirtyLevelS[ 0 ];
          msg += "Uninstantiable Attr: " +
             uninstantiableLevel.recalculateDirtyAttrValS[ 0 ].attr +
            " (Level: " + uninstantiableLevel.pathName  + ")";
        } 
        msg += "]";
        throw msg;

      }

      executeManyLoads();
      executeStateInstallation();
      // If the load/install functions of 
      // many or level demands a recalculation
      // then we will solve, otherwise we shall
      // render
      LAY.$isSolving = false;
      if ( LAY.$recalculateDirtyLevelS.length ) {
        LAY.$solve();
      } else {
        LAY.$render();
      }
    }

  };

  function executeManyLoads () {
    var newManyS = LAY.$newManyS, newMany, fnLoad;

    for ( var i = 0, len = newManyS.length; i < len; i++ ) {
      newMany = newManyS[ i ];
      newMany.isLoaded = true;
      fnLoad = newMany.level.lson.$load;
      if ( fnLoad ) {
        fnLoad.call( newMany.level );
      }
    }
    LAY.$newManyS = [];
  }

  function executeStateInstallation () {

    var
      i, j, len, jLen,
      newlyInstalledStateLevelS = LAY.$newlyInstalledStateLevelS,
      newlyInstalledStateLevel,
      newlyInstalledStateS,
      attrValNewlyInstalledStateInstall,
      newlyUninstalledStateLevelS = LAY.$newlyUninstalledStateLevelS,
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
          ( LAY.type(attrValNewlyInstalledStateInstall.calcVal ) ===
          "function") &&
          attrValNewlyInstalledStateInstall.calcVal.call(
          newlyInstalledStateLevel );
      }
      // empty the list
      newlyInstalledStateLevel.newlyInstalledStateS = [];
    }
    LAY.$newlyInstalledStateLevelS = [];

    for ( i = 0, len = newlyUninstalledStateLevelS.length; i < len; i++ ) {
      newlyUninstalledStateLevel = newlyUninstalledStateLevelS[ i ];
      newlyUninstalledStateS = newlyUninstalledStateLevel.newlyUninstalledStateS;
      for ( j = 0, jLen = newlyUninstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyUninstalledStateUninstall =
          newlyUninstalledStateLevel.attr2attrVal[ newlyUninstalledStateS[ j ] +
          ".uninstall" ];
        attrValNewlyUninstalledStateUninstall &&
          ( LAY.type( attrValNewlyUninstalledStateUninstall.calcVal) ===
          "function") &&
          attrValNewlyUninstalledStateUninstall.calcVal.call( 
          newlyUninstalledStateLevel );
      }
      // empty the list
      newlyUninstalledStateLevel.newlyUninstalledStateS = [];
    }
    LAY.$newlyUninstalledStateLevelS = [];
  }


})();
