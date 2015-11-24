( function () {
  "use strict";


  /*
  * Optional argument of `timeNow`
  * which represent the previous time frame
  */
  LAID.$render = function ( timeNow ) {
    if ( ( ( LAID.$renderDirtyPartS.length !== 0 ) ||
       LAID.isDataTravelling
       ) ) {

      if ( timeNow ) {
        LAID.$prevTimeFrame = timeNow;
        window.requestAnimationFrame( render );
      } else {
        LAID.$prevTimeFrame = performance.now();
        render();
      }
      
    }
  }



  function render() {
    var
      curTimeFrame = performance.now(),
      timeFrameDiff = curTimeFrame - LAID.$prevTimeFrame,
      parentNode,
      x, y,
      i, len,
      isDataTravelling = LAID.$isDataTravelling,
      dataTravellingDelta = LAID.$dataTravelDelta,
      renderDirtyPartS = LAID.$renderDirtyPartS,
      renderDirtyPart,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal,
      normalRenderDirtyAttrValS,
      normalRenderDirtyAttrVal,
      renderDirtyTransition,
      renderCallS, isNormalAttrValTransitionComplete,
      renderNewLevelS = [],
      renderNewLevel,
      fnLoad,
      isAllNormalTransitionComplete = true;

    for ( x = 0; x < renderDirtyPartS.length; x++ ) {

      renderDirtyPart = renderDirtyPartS[ x ];

      travelRenderDirtyAttrValS = renderDirtyPart.travelRenderDirtyAttrValS;
      normalRenderDirtyAttrValS = renderDirtyPart.normalRenderDirtyAttrValS;

      renderCallS = [];

      for ( y = 0; y < travelRenderDirtyAttrValS.length; y++ ) {

        travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ y ];

        if ( travelRenderDirtyAttrVal.isTransitionable ) {

          transitionAttrVal( travelRenderDirtyAttrVal, dataTravellingDelta );
            LAID.$arrayUtils.pushUnique(
               renderCallS, travelRenderDirtyAttrVal.renderCall );

        }
      }

      for ( y = 0; y < normalRenderDirtyAttrValS.length; y++ ) {

        normalRenderDirtyAttrVal = normalRenderDirtyAttrValS[ y ];
        isNormalAttrValTransitionComplete = true;
        if ( normalRenderDirtyAttrVal.calcVal !== undefined ) {
          LAID.$arrayUtils.pushUnique( renderCallS,
           normalRenderDirtyAttrVal.renderCall );
        }
        renderDirtyTransition = normalRenderDirtyAttrVal.transition;

        if ( renderDirtyTransition !== undefined ) { // if transitioning

          if ( renderDirtyTransition.delay &&
            renderDirtyTransition.delay > 0 ) {
            renderDirtyTransition.delay -= timeFrameDiff;
            isNormalAttrValTransitionComplete = false;
          } else {
            if ( !renderDirtyTransition.checkIsComplete() ) {
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

          normalRenderDirtyAttrVal.transitionCalcVal =
            normalRenderDirtyAttrVal.calcVal;
          LAID.$arrayUtils.removeAtIndex( normalRenderDirtyAttrValS, y );
          y--;

        }

      }

      // scroll positions must be affected last
      // as a dimensional update would require
      // scroll to be updated after
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollX" ) ) {
        renderCallS.push( "scrollX" );
      }
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollY" ) ) {
        renderCallS.push( "scrollY" );
      }

      for ( i = 0, len = renderCallS.length; i < len; i++ ) {
        var fnRender =
          renderDirtyPart[ "renderFn_" + renderCallS[ i ] ];
        if ( !fnRender ) {
          throw "LAID Error: Inexistent prop: '" +
           renderCallS[ i ] + "'"; 
        }
        renderDirtyPart[ "renderFn_" + renderCallS[ i ] ]();
      }

      if (
         ( normalRenderDirtyAttrValS.length === 0 ) &&
         ( travelRenderDirtyAttrValS.length === 0 ) ) {
        LAID.$arrayUtils.removeAtIndex( LAID.$renderDirtyPartS, x );
        x--;
      }

      if ( !renderDirtyPart.isInitiallyRendered &&
         LAID.$renderDirtyPartS.indexOf( renderDirtyPart ) === -1 ) {
        LAID.$arrayUtils.pushUnique( renderNewLevelS,
         renderDirtyPart.level );
      }

    }

    for ( i = 0, len = renderNewLevelS.length; i < len; i++ ) {
      renderNewLevel = renderNewLevelS[ i ];
      renderNewLevel.part.isInitiallyRendered = true;
      fnLoad = renderNewLevel.lson.$load;
      if ( fnLoad ) {
        fnLoad.call( renderNewLevel );
      }
    }

    
    if ( LAID.$isSolveRequiredOnRenderFinish ) {
      LAID.$isSolveRequiredOnRenderFinish = false;
      LAID.$solve();
    } else if ( !isAllNormalTransitionComplete ) {
      LAID.$render( curTimeFrame );
    }

  }

  function transitionAttrVal ( normalRenderDirtyAttrVal, delta ) {
    if ( normalRenderDirtyAttrVal.calcVal instanceof LAID.Color ) {
      normalRenderDirtyAttrVal.transitionCalcVal =
        LAID.$generateColorMix( normalRenderDirtyAttrVal.startCalcVal,
          normalRenderDirtyAttrVal.calcVal,
          delta );
    } else {
      normalRenderDirtyAttrVal.transitionCalcVal =
        normalRenderDirtyAttrVal.startCalcVal +
        ( delta *
          ( normalRenderDirtyAttrVal.calcVal -
            normalRenderDirtyAttrVal.startCalcVal )
          );
    }
  }

})();