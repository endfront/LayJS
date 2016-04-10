(function(){
  "use strict";

  var expandedPropName2renderCall = {
    z: "transform",
    scaleX: "transform",
    scaleY: "transform",
    scaleZ: "transform",
    rotateX: "transform",
    rotateY: "transform",
    rotateZ: "transform",
    skewX: "transform",
    skewY: "transform",
    left: "x",
    shiftX: "x",
    top: "y",
    shiftY: "y",
    originX: "origin",
    originY: "origin",
    originZ: "origin",
    overflowX: "overflow",
    overflowY: "overflow",
    backgroundSizeX: "backgroundPosition",
    backgroundSizeY: "backgroundSize"
  };



  LAY.$findRenderCall = function( prop, level ) {

    if ( level.isHelper ) {
      return "";
    } else if ( !LAY.$checkIsValidUtils.propAttr(prop) ||
      ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf(prop) !== -1 ||
      // TODO: check instead (below) for a custom prop
      LAY.$shorthandPropsUtils.checkIsDecentralizedShorthandProp(prop) ) {
        return undefined;
      } else {
        var multipleTypePropMatchDetails =
          LAY.$findMultipleTypePropMatchDetails(prop);

        if ( multipleTypePropMatchDetails ) {
          return multipleTypePropMatchDetails[1];
        }

        var renderCall = expandedPropName2renderCall[prop];
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
