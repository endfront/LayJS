(function () {
  "use strict";

  var associatedProp2CustomProp = {};

  function CustomProp(name, fn, associatedPropS) {
    this.name = name;
    this.fn = fn;
    this.associatedPropS = associatedPropS;
    for (var i=0; i<associatedPropS.length; i++) {
      //associatedProp = 
    }
  }

  LAY.$customPropUtils = {
    create: function (name, fn, associatedPropS) {

    },
    checkIsAssociatedWithCustomProp: function (prop) {

    },
    getFnOfCustomProp: function(prop) {

    }
  };
  var customProp2propObj = {
    "border": {
      associatedPropS: [
        "borderTopStyle", "borderRightStyle",
        "borderBottomStyle", "borderLeftStyle",
        "borderTopWidth", "borderRightWidth",
        "borderBottomWidth", "borderLeftWidth",
        "borderTopColor", "borderRightColor",
        "borderBottomColor", "borderLeftColor",
      ],
      fn: function(customPropVal, props) {
        var
          top = customPropVal.top,
          right = customPropVal.right,
          bottom = customPropVal.bottom,
          left = customPropVal.left,
          style = customPropVal.style,
          width = customPropVal.width,
          color = customPropVal.color;

        if (top !== undefined) {
          var
            topStyle = top.style,
            topWidth = top.width,
            topColor = top.color;

          if (topStyle !== undefined &&
              props.borderTopStyle !== undefined) {
            props.borderTopStyle = topStyle;
          }
          if (topWidth !== undefined &&
              props.borderTopWidth !== undefined) {
            props.borderTopWidth = topWidth;
          }
          if (topColor !== undefined &&
              props.borderTopColor !== undefined) {
            props.borderTopColor = topColor;
          }
        }

        if (right !== undefined) {
          var
            rightStyle = right.style,
            rightWidth = right.width,
            rightColor = right.color;

          if (rightStyle !== undefined &&
              props.borderRightStyle !== undefined) {
            props.borderRightStyle = rightStyle;
          }
          if (rightWidth !== undefined &&
              props.borderRightWidth !== undefined) {
            props.borderRightWidth = rightWidth;
          }
          if (rightColor !== undefined &&
              props.borderRightColor !== undefined) {
            props.borderRightColor = rightColor;
          }
        }

        if (bottom !== undefined) {
          var
            bottomStyle = bottom.style,
            bottomWidth = bottom.width,
            bottomColor = bottom.color;

          if (bottomStyle !== undefined &&
              props.borderBottomStyle !== undefined) {
            props.borderBottomStyle = bottomStyle;
          }
          if (bottomWidth !== undefined &&
              props.borderBottomWidth !== undefined) {
            props.borderBottomWidth = bottomWidth;
          }
          if (bottomColor !== undefined &&
              props.borderBottomColor !== undefined) {
            props.borderBottomColor = bottomColor;
          }
        }

        if (left !== undefined) {
          var
            leftStyle = left.style,
            leftWidth = left.width,
            leftColor = left.color;

          if (leftStyle !== undefined &&
              props.borderLeftStyle !== undefined) {
            props.borderLeftStyle = leftStyle;
          }
          if (leftWidth !== undefined &&
              props.borderLeftWidth !== undefined) {
            props.borderLeftWidth = leftWidth;
          }
          if (leftColor !== undefined &&
              props.borderLeftColor !== undefined) {
            props.borderLeftColor = leftColor;
          }
        }

        // execute style,width, color later for
        // reduced priority (as no overwrite)
        if (style !== undefined) {
          if (props.borderTopStyle === undefined) {
            props.borderTopStyle = style;
          }
          if (props.borderRightStyle === undefined) {
            props.borderRightStyle = style;
          }
          if (props.borderBottomStyle === undefined) {
            props.borderBottomStyle = style;
          }
          if (props.borderLeftStyle === undefined) {
            props.borderLeftStyle = style;
          }
        }
        if (width !== undefined) {
          if (props.borderTopWidth === undefined) {
            props.borderTopWidth = width;
          }
          if (props.borderRightWidth === undefined) {
            props.borderRightWidth = width;
          }
          if (props.borderBottomWidth === undefined) {
            props.borderBottomWidth = width;
          }
          if (props.borderLeftWidth === undefined) {
            props.borderLeftWidth = width;
          }
        }
        if (color !== undefined) {
          if (props.borderTopColor === undefined) {
            props.borderTopColor = color;
          }
          if (props.borderRightColor === undefined) {
            props.borderRightColor = color;
          }
          if (props.borderBottomColor === undefined) {
            props.borderBottomColor = color;
          }
          if (props.borderLeftColor === undefined) {
            props.borderLeftColor = color;
          }
        }

      }
    },
    "cornerRadius": {
      associatedPropS: [
        "cornerRadiusTopLeft",
        "cornerRadiusTopRight",
        "cornerRadiusBottomRight",
        "cornerRadiusBottomLeft"
      ],
      fn: function (customPropVal, props) {
        var cornerRadius = customPropVal;
        if (cornerRadius !== undefined) {
          if (props.cornerRadiusTopLeft === undefined) {
            props.cornerRadiusTopLeft = cornerRadius;
          }
          if (props.cornerRadiusTopRight === undefined) {
            props.cornerRadiusTopRight = cornerRadius;
          }
          if (props.cornerRadiusBottomRight === undefined) {
            props.cornerRadiusBottomRight = cornerRadius;
          }
          if (props.cornerRadiusBottomLeft === undefined) {
            props.cornerRadiusBottomLeft = cornerRadius;
          }
        }
      }
    },
    "textPadding": {
      associatedPropS: [
        "textPaddingTop",
        "textPaddingRight",
        "textPaddingBottom",
        "textPaddingLeft"
      ],
      fn: function (customPropVal, props) {
        var textPadding = customPropVal;
        if (textPadding !== undefined) {
          if (props.textPaddingTop === undefined) {
            props.textPaddingTop = textPadding;
          }
          if (props.textPaddingRight === undefined) {
            props.textPaddingRight = textPadding;
          }
          if (props.textPaddingBottom === undefined) {
            props.textPaddingBottom = textPadding;
          }
          if (props.textPaddingLeft === undefined) {
            props.textPaddingLeft = textPadding;
          }
        }
      }
    }
  };


})();
