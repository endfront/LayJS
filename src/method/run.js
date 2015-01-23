(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    var
      rootLevel,
      textTestNodeCSS = "position:absolute;visibility:hidden;box-sizing:border-box;-moz-box-sizing:border-box",
      textWidthTestNode = document.createElement( "span" ),
      textHeightTestNode = document.createElement( "div" );




    rootLson.props  = rootLson.props || {};

    rootLson.props.width = window.innerWidth;
    rootLson.props.height = window.innerHeight;




    rootLevel = new LAID.Level( "/", rootLson, undefined );
    rootLevel.$init();
    LAID.$newLevelS = [ rootLevel ];

    window.onresize = updateSize;


    textHeightTestNode.id = "t-height";
    textWidthTestNode.id = "t-width";

    textWidthTestNode.style.cssText = textTestNodeCSS;
    textHeightTestNode.style.cssText = textTestNodeCSS;


    document.body.appendChild( textWidthTestNode );
    document.body.appendChild( textHeightTestNode );

    LAID.$emptyAttrValue = new LAID.AttrValue( "", undefined );

    LAID.$prevTimeFrame = performance.now();

    window.requestAnimationFrame( render );

  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "width", window.innerWidth );
    rootLevel.$changeAttrVal( "height", window.innerHeight );
    LAID.$solveForRecalculation();

  }


  function render() {

    var
    newPartS = LAID.$newPartS, newPart, newPartLevel,
    curTimeFrame = performance.now(),
    timeFrameDiff = curTimeFrame - LAID.$prevTimeFrame,
    x, y,
    i, len,
    renderDirtyLevelS = LAID.$renderDirtyLevelS,
    renderDirtyLevel,
    renderDirtyAttrValueS,
    renderDirtyAttrValue,
    renderCallS, isAttrTransitionComplete;

    for ( i = 0, len = newPartS.length; i < len; i++ ) {
      newPart = newPartS[ i ];
      newPartLevel = newPart.level;
      if ( newPartLevel.path !== "/" ) {
        newPartLevel.parentLevel.part.node.appendChild( newPart.node );
      }
      if ( newPartLevel.$lson.load ) {
        newPartLevel.$lson.load.call( newPartLevel );
      }
    }

    LAID.$newPartS = [];

    for ( x = 0; x < renderDirtyLevelS.length; x++ ) {

      renderDirtyLevel = renderDirtyLevelS[ x ];
      renderDirtyAttrValueS = renderDirtyLevel.$renderDirtyAttrValueS;
      renderCallS = [];

      for ( y = 0; y < renderDirtyAttrValueS.length; y++ ) {

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
        console.log("$renderFn_" + renderCallS[ i ]);
        renderDirtyLevel.part[ "$renderFn_" + renderCallS[ i ] ]();
      }

      if ( renderDirtyAttrValueS.length === 0 ) {
        LAID.$arrayUtils.removeAtIndex( renderDirtyLevelS, x );
        x--;
      }
    }

    window.requestAnimationFrame( render );

  }

})();
