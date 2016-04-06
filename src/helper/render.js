( function () {
  "use strict";


  /*
  * Optional argument of `timeNow`
  * which represent the previous time frame
  */
  LAY.$render = function (timeNow) {
    if ( ( ( LAY.$renderDirtyPartS.length !== 0 ) ||
       LAY.isDataTravelling
       ) ) {

      if ( timeNow ) {
        LAY.$prevTimeFrame = timeNow;
        window.requestAnimationFrame(render);
      } else {
        LAY.$prevTimeFrame = performance.now() - 16.7;
        render();
      }

    }
  }

  function render() {
    var
      curTimeFrame = performance.now(),
      timeFrameDiff = curTimeFrame - LAY.$prevTimeFrame,
      parentNode,
      x, y,
      i, len,
      isDataTravelling = LAY.$isDataTravelling,
      dataTravellingDelta = LAY.$dataTravelDelta,
      renderDirtyPartS = LAY.$renderDirtyPartS,
      renderDirtyPart,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal,
      normalRenderDirtyAttrValS,
      normalRenderDirtyAttrVal,
      renderDirtyTransition,
      renderCallS, isNormalAttrValTransitionComplete,
      renderNewLevelS = [],
      renderNewLevel,
      isAllNormalTransitionComplete = true;

    LAY.$isRendering = true;

    for ( x=0; x<renderDirtyPartS.length; x++ ) {
      renderDirtyPart = renderDirtyPartS[ x ];
      travelRenderDirtyAttrValS = renderDirtyPart.travelRenderDirtyAttrValS;
      normalRenderDirtyAttrValS = renderDirtyPart.normalRenderDirtyAttrValS;
      renderCallS = [];

      for ( y=0; y<travelRenderDirtyAttrValS.length; y++ ) {
        travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ y ];
        if (travelRenderDirtyAttrVal.isTransitionable) {
          transitionAttrVal( travelRenderDirtyAttrVal, dataTravellingDelta );
            LAY.$arrayUtils.pushUnique(
               renderCallS, travelRenderDirtyAttrVal.renderCall );
        }
      }

      for ( y=0; y<normalRenderDirtyAttrValS.length; y++ ) {
        normalRenderDirtyAttrVal = normalRenderDirtyAttrValS[ y ];
        isNormalAttrValTransitionComplete = true;
        if ( normalRenderDirtyAttrVal.calcVal !== undefined ) {
          LAY.$arrayUtils.pushUnique( renderCallS,
           normalRenderDirtyAttrVal.renderCall );
        }
        renderDirtyTransition = normalRenderDirtyAttrVal.transition;
        if ( renderDirtyTransition !== undefined ) { // if transitioning
          if ( renderDirtyTransition.delay &&
            renderDirtyTransition.delay > 0 ) {
            renderDirtyTransition.delay -= timeFrameDiff;
            isNormalAttrValTransitionComplete = false;
            isAllNormalTransitionComplete = false;
          } else {
            if ( !normalRenderDirtyAttrVal.isDeltaTransitionable ) {
              normalRenderDirtyAttrVal.transCalcVal =
                normalRenderDirtyAttrVal.calcVal;
              if ( renderDirtyTransition.done !== undefined ) {
                renderDirtyTransition.done.call( renderDirtyPart.level );
              }
              normalRenderDirtyAttrVal.transition = undefined;
            } else if ( !renderDirtyTransition.checkIsComplete() ) {
              isAllNormalTransitionComplete = false;
              isNormalAttrValTransitionComplete = false;
              transitionAttrVal( normalRenderDirtyAttrVal,
                 renderDirtyTransition.generateNext( timeFrameDiff ) );
            } else {
              if ( renderDirtyTransition.done !== undefined ) {
                renderDirtyTransition.done.call( renderDirtyPart.level );
              }
              normalRenderDirtyAttrVal.transition = undefined;
            }
          }
        }

        if ( isNormalAttrValTransitionComplete ) {
          normalRenderDirtyAttrVal.transCalcVal =
            normalRenderDirtyAttrVal.calcVal;
          LAY.$arrayUtils.removeAtIndex( normalRenderDirtyAttrValS, y );
          y--;

        }
      }

      // scroll positions must be affected last
      // as a dimensional update would require
      // scroll to be updated after
      if ( LAY.$arrayUtils.remove( renderCallS, "scrollX" ) ) {
        renderCallS.push( "scrollX" );
      }
      if ( LAY.$arrayUtils.remove( renderCallS, "scrollY" ) ) {
        renderCallS.push( "scrollY" );
      }

      for ( i = 0, len = renderCallS.length; i < len; i++ ) {
        renderDirtyPart.render( renderCallS[i] );
      }

      if (
         ( normalRenderDirtyAttrValS.length === 0 ) &&
         ( travelRenderDirtyAttrValS.length === 0 ) ) {
        LAY.$arrayUtils.removeAtIndex( LAY.$renderDirtyPartS, x );
        x--;
      }

      if ( !renderDirtyPart.isInitiallyRendered &&
        LAY.$renderDirtyPartS.indexOf( renderDirtyPart ) === -1 ) {
        LAY.$arrayUtils.pushUnique( renderNewLevelS,
         renderDirtyPart.level );
      }
    }


    // Execute loads (1) part loads
    for (i = 0, len = renderNewLevelS.length; i<len; i++) {
      renderNewLevel = renderNewLevelS[i];
      renderNewLevel.part.isInitiallyRendered = true;
      var fnLoadS = renderNewLevel.lson.$load;
      if ( fnLoadS ) {
        for (var j=0; j<fnLoadS.length; j++) {
          fnLoadS[j].call(renderNewLevel);
        }
      }
    }

    // Execute loads (2) many loads
    executeManyLoads();
    // Execute state installations/uninstallation
    executeStateInstallation();


    LAY.$isRendering = false;

    if ( LAY.$isSolveRequiredOnRenderFinish ) {
      LAY.$isSolveRequiredOnRenderFinish = false;
      LAY.$solve();
    } else if ( !isAllNormalTransitionComplete ) {
      LAY.$render(curTimeFrame);
    }

  }

  function transitionAttrVal( normalRenderDirtyAttrVal, delta ) {
    if ( normalRenderDirtyAttrVal.calcVal instanceof LAY.Color ) {
      normalRenderDirtyAttrVal.transCalcVal =
        LAY.$generateColorMix( normalRenderDirtyAttrVal.startCalcVal,
          normalRenderDirtyAttrVal.calcVal,
          delta );
    } else {
      normalRenderDirtyAttrVal.transCalcVal =
        normalRenderDirtyAttrVal.startCalcVal +
        ( delta *
          ( normalRenderDirtyAttrVal.calcVal -
            normalRenderDirtyAttrVal.startCalcVal )
          );
    }
  }

  function executeManyLoads () {
    var newManyS = LAY.$newManyS;
    while (newManyS.length) {
      var newMany = newManyS[0];
      newManyS.shift();
      newMany.isLoaded = true;
      var fnLoadS = newMany.level.lson.$load;
      if ( newMany.level.isExist && fnLoadS ) {
        while (fnLoadS.length) {
          var fnLoad = fnLoadS[0];
          fnLoadS.shift();
          fnLoad.call(newMany.level);
        }
      }
    }
  }

  function executeStateInstallation () {
    var
      newlyInstalledStateLevelS = LAY.$newlyInstalledStateLevelS,
      newlyUninstalledStateLevelS = LAY.$newlyUninstalledStateLevelS;

    while (newlyInstalledStateLevelS.length) {
      var newlyInstalledStateLevel = newlyInstalledStateLevelS[0];
      newlyInstalledStateLevelS.shift();
      var newlyInstalledStateS = newlyInstalledStateLevel.newlyInstalledStateS;
      if ( newlyInstalledStateLevel.isExist ) {
        while (newlyInstalledStateS.length) {
          var newlyInstalledState = newlyInstalledStateS[0];
          newlyInstalledStateS.shift();
          var attrValNewlyInstalledStateInstall =
            newlyInstalledStateLevel.attr2attrVal[ newlyInstalledState +
            ".install" ];
          attrValNewlyInstalledStateInstall &&
            ( LAY.$type(attrValNewlyInstalledStateInstall.calcVal ) ===
            "function") &&
            attrValNewlyInstalledStateInstall.calcVal.call(
            newlyInstalledStateLevel );
        }
      }
    }

    while (newlyUninstalledStateLevelS.length) {
      var newlyUninstalledStateLevel = newlyUninstalledStateLevelS[0];
      newlyUninstalledStateLevelS.shift();
      var newlyUninstalledStateS = newlyUninstalledStateLevel.newlyUninstalledStateS;
      if ( newlyUninstalledStateLevel.isExist ) {
        while (newlyUninstalledStateS.length) {
          var newlyUninstalledState = newlyUninstalledStateS[0];
          newlyUninstalledStateS.shift();
          var attrValNewlyUninstalledStateUninstall =
            newlyUninstalledStateLevel.attr2attrVal[ newlyUninstalledState +
            ".uninstall" ];
          attrValNewlyUninstalledStateUninstall &&
            ( LAY.$type(attrValNewlyUninstalledStateUninstall.calcVal ) ===
            "function") &&
            attrValNewlyUninstalledStateUninstall.calcVal.call(
            newlyUninstalledStateLevel );
        }
      }
    }

  }




})();
