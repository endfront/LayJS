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
          LAY.$recalculateDirtyAttrValS.length === 0;
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
        var msg = "Circular/Undefined Reference Encountered [";
        if ( !isSolveNewComplete ) {
          msg += "Uninheritable Level: " + LAY.$newLevelS[ 0 ].pathName;
        } else {
          var circularAttrVal = LAY.$recalculateDirtyAttrValS[ 0 ];
          msg += "level: " + circularAttrVal.level.pathName +
            ", attr:" + circularAttrVal.attr  + "";
        }
        msg += "]";
        LAY.$error(msg);

      }

      relayout();
      recalculateNaturalDimensions();
      executeManyLoads();
      executeStateInstallation();
      // If the load/install functions of
      // many or level demands a recalculation
      // then we will solve, otherwise we shall
      // render
      LAY.$isSolving = false;
      if ( LAY.$recalculateDirtyAttrValS.length ) {
        LAY.$solve();
      } else {
        LAY.$render();
      }
    }
  };


  function relayout() {
    var relayoutDirtyManyS = LAY.$relayoutDirtyManyS;
    for ( var i=0, len=relayoutDirtyManyS.length; i<len; i++ ) {
      var relayoutDirtyMany = relayoutDirtyManyS[i];
      if ( relayoutDirtyMany.level.isExist ) {
        relayoutDirtyMany.relayout();
      }
    }
    LAY.$relayoutDirtyManyS = [];
  };


  function recalculateNaturalDimensions () {
    var
      naturalWidthDirtyPartS =
        LAY.$naturalWidthDirtyPartS,
      naturalHeightDirtyPartS =
        LAY.$naturalHeightDirtyPartS,
      i, len, attrVal;

    // calculate natural width first
    // as knowing natural width is useful
    // while calculating natural height
    for ( i=naturalWidthDirtyPartS.length - 1;
        i >= 0; i-- ) {
      attrVal =
        naturalWidthDirtyPartS[i].level.attr2attrVal.$naturalWidth;
      if ( attrVal && attrVal.level.isExist ) {
        attrVal.requestRecalculation();
      }
    }

    for ( i=naturalHeightDirtyPartS.length - 1;
        i >= 0; i-- ) {
      attrVal =
        naturalHeightDirtyPartS[i].level.attr2attrVal.$naturalHeight;
      if ( attrVal && attrVal.level.isExist ) {
        attrVal.requestRecalculation();
      }
    }

    LAY.$naturalWidthDirtyPartS = [];
    LAY.$naturalHeightDirtyPartS = [];

  }

  function executeManyLoads () {
    var newManyS = LAY.$newManyS;
    for ( var i = 0, len = newManyS.length; i < len; i++ ) {
      var newMany = newManyS[i];
      newMany.isLoaded = true;
      var fnLoadS = newMany.level.lson.$load;
      if ( newMany.level.isExist && fnLoadS ) {
        for (var j=0; j<fnLoadS.length; j++) {
          fnLoadS[j].call(newMany.level);
        }
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
      newlyInstalledStateLevel = newlyInstalledStateLevelS[i];
      newlyInstalledStateS = newlyInstalledStateLevel.newlyInstalledStateS;
      if ( newlyInstalledStateLevel.isExist ) {
        for ( j = 0, jLen = newlyInstalledStateS.length; j < jLen; j++ ) {
          attrValNewlyInstalledStateInstall =
            newlyInstalledStateLevel.attr2attrVal[ newlyInstalledStateS[ j ] +
            ".install" ];
          attrValNewlyInstalledStateInstall &&
            ( LAY.$type(attrValNewlyInstalledStateInstall.calcVal ) ===
            "function") &&
            attrValNewlyInstalledStateInstall.calcVal.call(
            newlyInstalledStateLevel );
        }
      }
      // empty the list
      newlyInstalledStateLevel.newlyInstalledStateS = [];
    }
    LAY.$newlyInstalledStateLevelS = [];

    for ( i = 0, len = newlyUninstalledStateLevelS.length; i < len; i++ ) {
      newlyUninstalledStateLevel = newlyUninstalledStateLevelS[i];
      newlyUninstalledStateS = newlyUninstalledStateLevel.newlyUninstalledStateS;
      if ( newlyUninstalledStateLevel.isExist ) {
        for ( j = 0, jLen = newlyUninstalledStateS.length; j < jLen; j++ ) {
          attrValNewlyUninstalledStateUninstall =
            newlyUninstalledStateLevel.attr2attrVal[ newlyUninstalledStateS[ j ] +
            ".uninstall" ];
          attrValNewlyUninstalledStateUninstall &&
            ( LAY.$type( attrValNewlyUninstalledStateUninstall.calcVal) ===
            "function") &&
            attrValNewlyUninstalledStateUninstall.calcVal.call(
            newlyUninstalledStateLevel );
        }
      }
      // empty the list
      newlyUninstalledStateLevel.newlyUninstalledStateS = [];
    }
    LAY.$newlyUninstalledStateLevelS = [];
  }


})();
