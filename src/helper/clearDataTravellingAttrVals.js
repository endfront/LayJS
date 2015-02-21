( function () {
  "use strict";

  LAID.$clearDataTravellingAttrVals = function () {

    var

      x, y,
      yLen,
      renderDirtyLevelS = LAID.$renderDirtyLevelS,
      renderDirtyLevel,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal;

      for ( x = 0; x < renderDirtyLevelS.length; x++ ) {

        renderDirtyLevel = renderDirtyLevelS[ x ];
        travelRenderDirtyAttrValS = renderDirtyLevel.$travelRenderDirtyAttrValS;
        //console.log( travelRenderDirtyAttrValS.length)


        for ( y = 0, yLen = travelRenderDirtyAttrValS.length; y < yLen; y++ ) {

          travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ 0 ];
          if ( travelRenderDirtyAttrVal.renderCall ) {

            travelRenderDirtyAttrVal.startCalcVal =
              travelRenderDirtyAttrVal.transitionCalcVal;

            // Adding to the "normal" render list automatically
            // removes the attrval from the "travel" render list
            renderDirtyLevel.$addNormalRenderDirtyAttrVal(
              travelRenderDirtyAttrVal
            );
          } else {
            LAID.$arrayUtils.remove( travelRenderDirtyAttrValS,
              travelRenderDirtyAttrVal
            );
          }



        }

      }


  };

})();
