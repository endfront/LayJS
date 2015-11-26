( function () {
  "use strict";

  LAY.$generateColorMix = function ( startColor, endColor, fraction ) {

      var
        startColorRgbaDict = startColor.getRgba(),
        endColorRgbaDict = endColor.getRgba(),
        midColor;


      return new LAY.Color( "rgb", {
        r: Math.round( startColorRgbaDict.r +
          fraction * ( endColorRgbaDict.r - startColorRgbaDict.r )
        ),
        g: Math.round( startColorRgbaDict.g +
          fraction * ( endColorRgbaDict.g - startColorRgbaDict.g )
        ),
        b: Math.round( startColorRgbaDict.b +
          fraction * ( endColorRgbaDict.b - startColorRgbaDict.b )
        )
      }, ( startColorRgbaDict.a +
        fraction * ( endColorRgbaDict.a - startColorRgbaDict.a )
      ) );


  };

})();
