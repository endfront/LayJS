(function(){
  "use strict";
  /*var renderCall2regex = {
    filters: /^filters/,
    boxShadows: /^boxShadows/,
    textShadows: /^textShadows/,
    audioSources: /^audioSources/,
    videoSources: /^videoSources/,
    audioTracks: /^audioTracks/,
    videoTracks: /^videotracks/
  };*/


  LAID.$findRenderCall = function( prop, isPositionGpu ) {

    var
      renderCall,
      multipleTypePropMatchDetails;

    if ( !LAID.$checkIsValidUtils.propAttr( prop ) ||
      ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf( prop ) !== -1 ||
      LAID.$shorthandPropsUtils.checkIsDecentralizedShorthandProp( prop ) ) {
        return undefined;
      } else {
        multipleTypePropMatchDetails = LAID.$findMultipleTypePropMatchDetails(
        prop );

        if ( multipleTypePropMatchDetails ) {
          return multipleTypePropMatchDetails[ 1 ];
        }

        renderCall = 
          LAID.$shorthandPropsUtils.getShorthandPropCenteralized(
            prop );
        if ( renderCall !== undefined ) {
          if ( isPositionGpu &&
            ( renderCall === "x" ||
              renderCall === "y" ||
              renderCall === "transform" ) ) {
            return "positionAndTransform";
          } else {
            return renderCall;
          }
        } 
        return prop;
        
      }
    };
})();
