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


  LAY.$findRenderCall = function( prop, isPositionGpu ) {

    var
      renderCall,
      multipleTypePropMatchDetails;

    if ( !LAY.$checkIsValidUtils.propAttr( prop ) ||
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
