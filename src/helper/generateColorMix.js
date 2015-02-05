( function () {
  "use strict";

  LAID.$generateColorMix = function ( startColor, endColor, fraction ) {

      var
        startColorRgbaDict = startColor.rgba(),
        endColorRgbaDict = endColor.rgba(),
        midColor;


      var x = new LAID.Color( "rgb", {
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

      console.log(x);
      return x;

  };

})();
