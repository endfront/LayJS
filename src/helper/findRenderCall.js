(function(){
  "use strict";

  LAY.$findRenderCall = function( prop, level ) {

    var
      renderCall,
      multipleTypePropMatchDetails;

    if ( level.isHelper ) {
      return "";
    } else if ( !LAY.$checkIsValidUtils.propAttr( prop ) ||
      ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf( prop ) !== -1 ||
      LAY.$shorthandPropsUtils.checkIsDecentralizedShorthandProp( prop ) ) {
        return undefined;
      } else {
        multipleTypePropMatchDetails = LAY.$findMultipleTypePropMatchDetails(
        prop );

        if ( multipleTypePropMatchDetails ) {
          return multipleTypePropMatchDetails[ 1 ];
        }

        renderCall = 
          LAY.$shorthandPropsUtils.getShorthandPropCenteralized(
            prop );
        if ( renderCall !== undefined ) {
          if ( level.isGpu &&
            ( renderCall === "x" ||
              renderCall === "y" ||
              renderCall === "transform" ) ) {
            return "positionAndTransform";
          } else {
            return renderCall;
          }
        } else {
          if ( prop.startsWith("text") &&
           ( !level.part || level.part.type === "none" ) ) {
            return undefined;
          }
        }
        return prop;
        
      }
    };
})();
