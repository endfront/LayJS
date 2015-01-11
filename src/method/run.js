(function() {
  "use strict";

  LAID.run =  function ( rootLson, name2lson ) {



    if ( name2lson ) {

      name2lson = rootLson;
      rootLson = {
        props: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

    } else {

      rootLson.props = rootLson.props || {};

      rootLson.props.width = window.innerWidth;
      rootLson.props.height = window.innerHeight;

    }

    rootLson.children = name2lson;

    window.onresize = updateSize;

    ( new LAID.Level( "/", rootLson, undefined ) ).init();

    LAID.$prevTimeFrame = Date.now();

    window.requestAnimationFrame( render );

  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$attr2attrValue.width.update( window.innerWidth );
    rootLevel.$attr2attrValue.height.update( window.innerHeight );


    rootLevel.$attr2attrValue.width.requestRecalculation();
    rootLevel.$attr2attrValue.height.requestRecalulation();

    LAID.$solveForRecalculation();

  }




  function render() {


    var
    curTimeFrame = Date.now(),
    timeFrameDiff = curTimeFrame - LAID.$prevTimeFrame,
    x, xLen, y, yLen,
    i, len,
    renderDirtyLevelS = LAID.$renderDirtyLevelS,
    renderDirtyLevel,
    renderDirtyAttrValueS = LAID.$renderDirtyAttrValueS,
    renderDirtyAttrValue,
    renderCallS, isAttrTransitionComplete;



    for ( x = 0, xLen = renderDirtyLevelS.length; x < xLen; x++ ) {

      renderDirtyLevel = renderDirtyLevelS[ x ];
      renderDirtyAttrValueS = renderDirtyLevel.renderDirtyAttrValueS;
      renderCallS = [];

      for ( y = 0, yLen = renderDirtyAttrValueS.length; y < yLen; y++ ) {

        isAttrTransitionComplete = true;
        renderDirtyAttrValue = renderDirtyAttrValueS[ y ];
        LAID.$arrayUtils.pushUnique( renderCallS, renderDirtyAttrValue.renderCall );

        if ( renderDirtyAttrValue.delay && renderDirtyAttrValue.delay > 0 ) {
          renderDirtyAttrValue.delay -= timeFrameDiff;
        } else {
          if ( renderDirtyAttrValue.transition ) { // if transitioning

            if ( !renderDirtyAttrValue.transition.checkIsComplete() ) {
              isAttrTransitionComplete = false;

              renderDirtyAttrValue.transitionCalcValue =
              renderDirtyAttrValue.transition.startCalcVal +
              ( renderDirtyAttrValue.calcVal - renderDirtyAttrValue.transition.startCalcVal ) *
              renderDirtyAttrValue.transition.generateNext( timeFrameDiff );

            } else {
              if ( renderDirtyAttrValue.transition.done ) {
                renderDirtyAttrValue.transition.done.call( renderDirtyLevel );
              }
              renderDirtyAttrValue.transition = undefined;
            }
          }

          if ( isAttrTransitionComplete ) {

            renderDirtyAttrValue.transitionCalcValue =
            renderDirtyAttrValue.calcValue;
            LAID.$arrayUtils.removeAtIndex( renderDirtyAttrValueS, y );
            y--;

          }
        }
      }


      for ( i = 0, len = renderCallS.length; i < len; i++ ) {
        renderDirtyLevel.$part[ "$renderFn_" + renderCallS[ i ] ]();
      }

      if ( renderDirtyAttrValueS.length === 0 ) {
        LAID.$arrayUtils.removeAtIndex( renderDirtyLevelS, x );
        x--;
      }
    }

    window.requestAnimationFrame( render );

  }

})();
