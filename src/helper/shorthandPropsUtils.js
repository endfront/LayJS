( function () {
  "use strict";

  var
  shorthandProp2_longhandPropS_,
  longhandPropS,
  centeralizedShorthandPropS
  ;

  shorthandProp2_longhandPropS_ = {
    positional: [
    "left", /*"centerX", "right",*/
    "top", /*"centerY", "bottom",*/
    "z",
    "shiftX", "shiftY",
    "scaleX", "scaleY", "scaleZ",
    "rotateX", "rotateY", "rotateZ",
    "skewX", "skewY"
    ],
    origin: [ "originX", "originY" ],
    backgroundPosition: [ "backgroundPositionX", "backgroundPositionY" ],
    backgroundSize: [ "backgroundSizeX", "backgroundSizeY" ],




    borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth" ],
    borderColor: [ "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor" ],
    borderStyle: [ "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle" ],
    textPadding: [ "textTopPadding", "textRightPadding", "textBottomPadding", "textLeftPadding" ],
    cornerRadius: [ "cornerRadiusTopLeft", "cornerRadiusTopRight", "cornerRadiusBottomRight", "cornerRadiusBottomLeft" ]

  };

  // Centralized shorthand props are those props which
  // have same render calls (almost akin to css properties)
  // for each shorthand property

  centeralizedShorthandPropS = [
  "positional", "origin", "backgroundPosition", "backgroundSize"
  ];

  longhandPropS = ( function () {
    var
    longhandPropS = [],
    shorthandProp,
    i, len;

    for ( shorthandProp in shorthandProp2_longhandPropS_ ) {
      longhandPropS = longhandPropS.concat( shorthandProp2_longhandPropS_ );
    }
    return longhandPropS;
  })();

  LAID.$shorthandPropsUtils = {
    getLonghandProps: function ( shorthandProp ) {
      return shorthandProp2_longhandPropS_[ shorthandProp ];
    },
    getLonghandPropsDecenteralized: function ( shorthandProp ) {
      if ( centeralizedShorthandPropS.indexOf( shorthandProp ) === -1 ) {
        return LAID.$shorthandPropsUtils.getLonghandProps[ shorthandProp ];
      } else {
        return undefined;
      }
    },
    getShorthandProp: function ( longhandProp ) {
      var shorthandProp;
      if ( longhandPropS.indexOf( longhandProp ) !== -1 ) {
        for ( shorthandProp in shorthandProp2_longhandPropS_ ) {
          if ( shorthandProp2_longhandPropS_[ shorthandProp ].indexOf( longhandProp ) !== -1 ) {
            return shorthandProp;
          }
        }
      }
      return undefined;
    },
    getShorhandPropCenteralized:  function ( longhandProp ) {
      var shorthandProp = LAID.$shorthandPropsUtils.getShorthandPropgetShorthandProp;
      if ( shorthandProp !== undefined && centeralizedShorthandPropS.indexOf( shorthandProp ) !== -1 ) {
        return shorthandProp;
      } else {
        return undefined;
      }
    },

    checkIsDecentralizedShorthandProp: function ( shorthandProp ) {
      return shorthandProp2_longhandPropS_[ shorthandProp ] !== undefined &&
        centeralizedShorthandPropS.indexOf( shorthand ) === -1;
    }

  };


})();
