( function () {
  "use strict";


  var shorthandProp2_longhandPropS_ = {
    positional: [
    "left", /*"centerX", "right",*/
    "top", /*"centerY", "bottom",*/
    "z",
    "shiftX", "shiftY",
    "scaleX", "scaleY",
    "rotateX", "rotateY", "rotateZ",
    "skewX", "skewY"
    ],

    borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth" ],
    borderColor: [ "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor" ],
    borderStyle: [ "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle" ],
    textPadding: [ "textTopPadding", "textRightPadding", "textBottomPadding", "textLeftPadding" ],
    cornerRadius: [ "cornerRadiusTopLeft", "cornerRadiusTopRight", "cornerRadiusBottomRight", "cornerRadiusBottomLeft" ]

  };

  LAID.$shorthandPropsUtils = {
    getLonghandProps: function ( shorthandProp ) {
      return shorthandProp2_longhandPropS_[ shorthandProp ];
    },
    getShorthandProp: function ( longhandProp ) {
      var shorthandProp;
      for ( shorthandProp in shorthandProp2_longhandPropS_ ) {
        if ( shorthandProp2_longhandPropS_[ shorthandProp ].indexOf( longhandProp ) !== -1 ) {
          return shorthandProp;
        }
      }
      return undefined;
    }
  };


})();
