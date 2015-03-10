( function () {
  "use strict";


  /*
  * Optional argument of `timeNow`
  * which represent the previous time frame
  */
  LAID.$render = function ( timeNow ) {
    if ( !LAID.$isRequestedForAnimationFrame &&
       ( ( LAID.$renderDirtyPartS.length !== 0 ) ||
       LAID.isDataTravelling
       ) ) {

      LAID.$prevTimeFrame = timeNow || performance.now();
      window.requestAnimationFrame( render );
    }
  }



  function render() {

    var
      newPartS = LAID.$newPartS, newPart, newPartLevel,
      curTimeFrame = performance.now(),
      timeFrameDiff = curTimeFrame - LAID.$prevTimeFrame,
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
      loadAttrVal,
      isAllNormalTransitionComplete = true;

    for ( i = 0, len = newPartS.length; i < len; i++ ) {
      newPart = newPartS[ i ];
      newPartLevel = newPart.level;
      if ( newPartLevel.path !== "/" ) {
        newPartLevel.parentLevel.part.node.appendChild( newPart.node );
      }
    }


    LAID.$newPartS = [];

    for ( x = 0; x < renderDirtyPartS.length; x++ ) {


      renderDirtyPart = renderDirtyPartS[ x ];

      travelRenderDirtyAttrValS = renderDirtyPart.$travelRenderDirtyAttrValS;
      normalRenderDirtyAttrValS = renderDirtyPart.$normalRenderDirtyAttrValS;

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
        LAID.$arrayUtils.pushUnique( renderCallS, normalRenderDirtyAttrVal.renderCall );
        renderDirtyTransition = normalRenderDirtyAttrVal.transition;

        if ( renderDirtyTransition !== undefined ) { // if transitioning

          if ( renderDirtyTransition.delay && renderDirtyTransition.delay > 0 ) {
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

      // If "text" is to be rendered, it must be
      // rendered last to be able to bear knowledge
      // of the most recent (render) changes to text props
      // such as text padding, text size, and other text props
      // which can affect the dimensions of the part
      if ( LAID.$arrayUtils.remove( renderCallS, "text" ) ) {
        renderCallS.push( "text" );
      }

      // And scroll positions must be affected later
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollX" ) ) {
        renderCallS.push( "scrollX" );
      }
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollY" ) ) {
        renderCallS.push( "scrollY" );
      }

      for ( i = 0, len = renderCallS.length; i < len; i++ ) {
        //console.log("render call: ", renderCallS[ i ], renderDirtyPart.level.path );
        renderDirtyPart[ "$renderFn_" + renderCallS[ i ] ]();
      }

      if (
         ( normalRenderDirtyAttrValS.length === 0 ) &&
         ( travelRenderDirtyAttrValS.length === 0 )
      ) {
        LAID.$arrayUtils.removeAtIndex( LAID.$renderDirtyPartS, x );
        x--;
      }

      if ( !renderDirtyPart.$isInitiallyRendered ) {
        renderNewLevelS.push( renderDirtyPart.level );
      }

    }



    for ( i = 0, len = renderNewLevelS.length; i < len; i++ ) {
      renderNewLevel = renderNewLevelS[ i ];
      renderNewLevel.part.$isInitiallyRendered = true;
      loadAttrVal = renderNewLevel.$attr2attrVal.$load;
      if ( ( loadAttrVal ) &&
        (typeof loadAttrVal.transitionCalcVal === "function" ) ) {
          loadAttrVal.transitionCalcVal.call( renderCleanedLevel );
      }
    }

    LAID.$isRequestedForAnimationFrame = false;

    if ( LAID.$isRecalculateRequiredOnRenderFinish ) {
      LAID.$isRecalculateRequiredOnRenderFinish = false;
      LAID.$solveForRecalculation();
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
