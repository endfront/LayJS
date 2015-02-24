( function () {
  "use strict";
  LAID.$solveForRecalculation = function () {


    var i, j, len, jLen,
    isSolveProgressed,
    ret,
    recalculateDirtyLevelS = LAID.$recalculateDirtyLevelS,
    newlyInstalledStateLevelS = LAID.$newlyInstalledStateLevelS,
    newlyInstalledStateLevel,
    newlyInstalledStateS,
    attrValNewlyInstalledStateInstall,
    newlyUninstalledStateLevelS = LAID.$newlyUninstalledStateLevelS,
    newlyUninstalledStateLevel,
    newlyUninstalledStateS,
    attrValNewlyUninstalledStateUninstall;

    //console.log("recalculate");
    do {
      isSolveProgressed = false;
      for ( i = 0; i < recalculateDirtyLevelS.length; i++ ) {
        ret = recalculateDirtyLevelS[ i ].$solveForRecalculation();
        if ( ret !== 3 ) {
          isSolveProgressed = true;
          if ( ret === 1 ) {
            LAID.$arrayUtils.removeAtIndex( recalculateDirtyLevelS, i );
            i--;
          }
        }
      }
      // The reason we will not use `len` to check the length below is
      // that more recalculate dirty levels could have been added during
      // the loop
    } while ( ( recalculateDirtyLevelS.length !== 0 ) && isSolveProgressed );

    if ( recalculateDirtyLevelS.length !== 0 ) {
      throw "LAID Error: Circular/Undefined Reference Encountered";
    }

    for ( i = 0, len = newlyInstalledStateLevelS.length; i < len; i++ ) {
      newlyInstalledStateLevel = newlyInstalledStateLevelS[ i ];
      newlyInstalledStateS = newlyInstalledStateLevel.$newlyInstalledStateS;
      for ( j = 0, jLen = newlyInstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyInstalledStateInstall =
          newlyInstalledStateLevel.$attr2attrVal[ newlyInstalledStateS[ j ] + ".install" ];
        attrValNewlyInstalledStateInstall &&
         ( LAID.type(attrValNewlyInstalledStateInstall.calcVal) === "function") &&
          attrValNewlyInstalledStateInstall.calcVal.call( newlyInstalledStateLevel );
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
        newlyUninstalledStateLevel.$attr2attrVal[ newlyUninstalledStateS[ j ] + ".uninstall" ];
        attrValNewlyUninstalledStateUninstall &&
        ( LAID.type( attrValNewlyUninstalledStateUninstall.calcVal) === "function") &&
         attrValNewlyUninstalledStateUninstall.calcVal.call( newlyUninstalledStateLevel );
      }
      // empty the list
      newlyUninstalledStateLevel.$newlyUninstalledStateS = [];
    }
    LAID.$newlyUninstalledStateLevelS = [];

    LAID.$render();

  };

})();
