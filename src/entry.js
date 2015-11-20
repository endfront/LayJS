

(function () {
  "use strict";

  window.laid = window.LAID = {

    // version is a method in order
    // to maintain the consistency of
    // only method accesses from the user
    version: function(){ return 1; },

    
    $pathName2level: {},
    $cloggedLevelS: [],

    $newlyInstalledStateLevelS: [],
    $newlyUninstalledStateLevelS: [],
    $newLevelS: [],
    $recalculateDirtyLevelS: [],
    $renderDirtyPartS: [],
    $prevFrameTime: 0,
    $newManyS: [],

    $isClogged:false,
    $isSolving: false,
    //$isRequestedForAnimationFrame: false,
    $isSolveRequiredOnRenderFinish: false,

    $isDataTravellingShock: false,
    $isDataTravelling: false,
    $dataTravelDelta: 0.0,
    $dataTravellingLevel: undefined,
    $dataTravellingAttrInitialVal: undefined,
    $dataTravellingAttrVal: undefined,

    $isGpuAccelerated: undefined

  };

})();
