(function(){
  "use strict";
  var renderCall2regex = {
    filters: /^filters/,
    boxShadows: /^boxShadows/,
    textShadows: /^textShadows/,
    audioSources: /^audioSources/,
    videoSources: /^videoSources/,
    audioTracks: /^audioTracks/,
    videoTracks: /^videotracks/
  };


  LAID.$findRenderCall = function( prop ) {

    var renderCall;

    if ( !LAID.$checkIsPropAttr( prop ) ||
      ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf( prop ) !== -1 ||
      LAID.$shorthandPropsUtils.checkIsDecentralizedShorthandProp( prop ) ) {
        return undefined;
      } else {
        for ( renderCall in renderCall2regex ) {
          if ( renderCall2regex[ renderCall ].test( prop ) ) {
            return renderCall;
          }
        }
        renderCall = LAID.$shorthandPropsUtils.getShorthandPropCenteralized( prop );
        if ( renderCall !== undefined ) {
          return renderCall;
        }
        return prop;
      }
    };
})();
