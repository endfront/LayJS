( function () {
  "use strict";

  LAY.$clearDataTravellingAttrVals = function () {

    var

      x, y,
      yLen,
      renderDirtyPartS = LAY.$renderDirtyPartS,
      renderDirtyPart,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal;

      for ( x = 0; x < renderDirtyPartS.length; x++ ) {

        renderDirtyPart = renderDirtyPartS[ x ];
        travelRenderDirtyAttrValS = renderDirtyPart.travelRenderDirtyAttrValS;


        for ( y = 0, yLen = travelRenderDirtyAttrValS.length; y < yLen; y++ ) {

          travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ 0 ];
          if ( travelRenderDirtyAttrVal.renderCall ) {

            travelRenderDirtyAttrVal.startCalcVal =
              travelRenderDirtyAttrVal.transitionCalcVal;

            // Adding to the "normal" render list automatically
            // removes the attrval from the "travel" render list
            renderDirtyPart.addNormalRenderDirtyAttrVal(
              travelRenderDirtyAttrVal
            );
          } else {
            LAY.$arrayUtils.remove( travelRenderDirtyAttrValS,
              travelRenderDirtyAttrVal
            );
          }



        }

      }


  };

})();
