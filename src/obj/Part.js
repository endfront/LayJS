( function () {
  "use strict";



  var isGpuAccelerated, cssPrefix, allStyles,
  defaultCss, defaultTextCss, inputType2tag;


  // source: http://davidwalsh.name/vendor-prefix
  cssPrefix = (Array.prototype.slice
    .call(window.getComputedStyle(document.body, null))
    .join('')
    .match(/(-moz-|-webkit-|-ms-)/)
  )[1];


  isGpuAccelerated = ( (cssPrefix + "transform" ) in allStyles );

  allStyles = document.body.style;

  // check for matrix 3d support
  if ( isGpuAccelerated ) {
    // source: https://gist.github.com/webinista/3626934 (http://tiffanybbrown.com/2012/09/04/testing-for-css-3d-transforms-support/)
    allStyles[ (cssPrefix + "transform" ) ] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
    isGpuAccelerated = Boolean( window.getComputedStyle( document.body, null ).getPropertyValue( ( cssPrefix + "transform" ) ) );
  }

  allStyles = undefined;


  defaultCss = "position:absolute;display:block;margin:0;padding:0;" +
  "box-sizing:border-box;-moz-box-sizing:border-box;" +
  "transform-style:preserve-3d;-webkit-transform-style:preserve-3d;" +
  "overflow-x:hidden;overflow-y:hidden;" +
  "-webkit-overflow-scrolling:touch;" +
  "background-repeat:no-repeat;";

  defaultTextCss = defaultCss + "font-size:13px;" +
  "font-family:sans-serif:color:black;";

  inputType2tag = {
    button: "button",
    multiline: "textarea",
    optgroup: "optgroup",
    option: "option"
  };

  LAID.Part = function ( level ) {

    this.level = level;
    this.node = undefined;

  };


  LAID.Part.prototype.$init = function () {

    var
    levelType = level.$lson.type,
    inputType = level.$lson.inputType,
    inputTypeTag = inputType2tag[ inputType ];

    if ( this.level.path === "/" ) {
      this.node = document.body;
    } else if ( levelType === "input" ) {
      if ( inputTypeTag !== undefined ) {
        this.node = document.createElement( inputTypeTag );
      } else {
        this.node = document.createElement( "input" );
        this.node.type = inputType;
      }
    } else {
      this.node = document.createElement( ( ( levelType === "none" ) || ( levelType === "text" ) ) ? "div" : ( levelType === "image" ? "img" : levelType )  );
    }

    this.node.style = ( levelType === "text" ) ? defaultTextCss : defaultCss;

  };

  // Below we will customize prototypical functions
  // using conditionals. As per the results from
  // http://jsperf.com/foreign-function-within-prototype-chain
  // http://jsperf.com/dynamic-modification-of-prototype-chain
  // this will make no difference

  // The renderable prop can be accessed via `part.$renderFn_<prop>`


  if ( isGpuAccelerated ) {


    LAID.Part.prototype.$renderFn_positional =   // TODO: optimize to enter matrix3d directly
    function renderPositionGpu() {
      var attr2attrValue = this.level.$attr2attrValue;

      this.node.style[ cssPrefix + "transform" ] =
      "scale3d(" +
      ( attr2attrValue.scaleX !== undefined ? attr2attrValue.scaleX.transitionCalcValue : 1 ) + "," +
      ( attr2attrValue.scaleY !== undefined ? attr2attrValue.scaleY.transitionCalcValue : 1 ) + "," +
      ( attr2attrValue.scaleZ !== undefined ? attr2attrValue.scaleZ.transitionCalcValue : 1 ) + ") " +
      "translate3d(" +

      ( ( ( attr2attrValue.left.transitionCalcValue + ( attr2attrValue.shiftX !== undefined ? attr2attrValue.shiftX.transitionCalcValue : 0 ) ) +
      attr2attrValue.width.transitionCalcValue * ( attr2attrValue.originX !== undefined ? attr2attrValue.originX.transitionCalcValue : 0.5 ) )  + "px ," ) +

      ( ( ( attr2attrValue.top.transitionCalcValue + ( attr2attrValue.shiftY !== undefined ? attr2attrValue.shiftY.transitionCalcValue : 0 ) ) +
      attr2attrValue.height.transitionCalcValue * ( attr2attrValue.originY !== undefined ? attr2attrValue.originY.transitionCalcValue : 0.5 ) )  + "px ," ) +

      ( attr2attrValue.z ? attr2attrValue.z.transitionCalcValue : 0 )  + "px) " +
      "skew(" +
      ( attr2attrValue.skewX !== undefined ? attr2attrValue.skewX.transitionCalcValue : 0 ) + "deg," +
      ( attr2attrValue.skewY !== undefined ? attr2attrValue.skewY.transitionCalcValue : 0 ) + "deg) " +
      "rotateX(" + ( attr2attrValue.rotateX !== undefined ? attr2attrValue.rotateX.transitionCalcValue : 0 ) + "deg) " +
      "rotateY(" + ( attr2attrValue.rotateY !== undefined ? attr2attrValue.rotateY.transitionCalcValue : 0 ) + "deg) " +
      "rotateZ(" + ( attr2attrValue.rotateZ !== undefined ? attr2attrValue.rotateZ.transitionCalcValue : 0 ) + "deg)";
    };

    LAID.Part.prototype.$renderFn_width = function () {
      this.node.style.width = this.level.$attr2attrValue.width.transitionCalcValue + "px";
      this.$renderFn_positional(); //apply change to transform
    };

    LAID.Part.prototype.$renderFn_height = function () {
      this.node.style.height = this.level.$attr2attrValue.height.transitionCalcValue + "px";
      this.$renderFn_positional(); //apply change to transform
    };



  } else {
    // legacy browser usage or forced non-gpu mode

    LAID.Part.prototype.$renderFn_width = function () {
      this.node.style.width = this.level.$attr2attrValue.width.transitionCalcValue + "px";
    };

    LAID.Part.prototype.$renderFn_height = function () {
      this.node.style.height = this.level.$attr2attrValue.height.transitionCalcValue + "px";
    };

    LAID.Part.prototype.$renderFn_positional = function () {
      var attr2attrValue = this.level.$attr2attrValue;
      this.node.style.left = ( attr2attrValue.left.transitionCalcValue + ( attr2attrValue.shiftX !== undefined ? attr2attrValue.shiftX.transitionCalcValue : 0 ) ) + "px";
      this.node.style.top = ( attr2attrValue.top.transitionCalcValue + ( attr2attrValue.shiftY !== undefined ? attr2attrValue.shiftY.transitionCalcValue : 0 ) ) + "px";

    };

  }




  LAID.Part.prototype.$renderFn_origin = function () {
    var attr2attrValue = this.level.$attr2attrValue;
    this.node.style[ cssPrefix + "transform-origin" ] =
    ( ( attr2attrValue.originX !== undefined ? attr2attrValue.originX.transitionCalcValue : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrValue.originY !== undefined ? attr2attrValue.originY.transitionCalcValue : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrValue.originZ !== undefined ? attr2attrValue.originZ.transitionCalcValue : 0.5 ) * 100 ) + "%";
    this.$renderFn_positional(); //apply change to transform
  };


  LAID.Part.prototype.$renderFn_perspective = function () {
    this.node.style[ cssPrefix + "perspective" ] = this.level.$attr2attrValue.perspective.transitionCalcValue + "px";
  };

  LAID.Part.prototype.$renderFn_perspectiveOrigin = function () {
    var attr2attrValue = this.level.$attr2attrValue;
    this.node.style[ cssPrefix + "perspective-origin" ] =
    ( attr2attrValue.perspectiveOriginX.transitionCalcValue * 100 ) + "% " +
    ( attr2attrValue.perspectiveOriginY.transitionCalcValue * 100 ) + "%";
  };

  LAID.Part.prototype.$renderFn_backfaceVisibility = function () {
    this.node.style[ cssPrefix + "backface-visibility" ] = this.level.$attr2attrValue.perspective.transitionCalcValue;
  };


  LAID.Part.prototype.$renderFn_opacity = function () {
    this.node.style.opacity = this.level.$attr2attrValue.opacity.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_display = function () {
    this.node.style.display = this.level.$attr2attrValue.display ?
    "block" : "none";
  };

  LAID.Part.prototype.$renderFn_scrollX = function () {
    this.node.scrollTop = this.level.$attr2attrValue.scrollX.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_scrollY = function () {
    this.node.scrollLeft = this.level.$attr2attrValue.scrollY.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_overflowX = function () {
    this.node.style.overflowX = this.level.$attr2attrValue.overflowX.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_overflowY = function () {
    this.node.style.overflowY = this.level.$attr2attrValue.overflowY.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_cursor = function () {
    this.node.style.cursor = this.level.$attr2attrValue.cursor.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_backgroundColor = function () {
    this.node.style.backgroundColor = this.level.$attr2attrValue.backgroundColor.transitionCalcValue.stringify();
  };

  LAID.Part.prototype.$renderFn_backgroundImage = function () {
    this.node.style.backgroundImage = this.level.$attr2attrValue.backgroundImage.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_backgroundAttachment = function () {
    this.node.style.backgroundAttachment = this.level.$attr2attrValue.backgroundAttachment.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_backgroundRepeat = function () {
    this.node.style.backgroundRepeat = this.level.$attr2attrValue.backgroundColor.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_backgroundSize = function () {
    var backgroundSizeX = this.level.$attr2attrValue.backgroundSizeX,
    backgroundSizeY = this.level.$attr2attrValue.backgroundSizeY;

    this.node.style.backgroundSize =
    (  ( backgroundSizeX !== undefined &&  backgroundSizeX.transitionCalcValue !== undefined ) ? backgroundSizeX.transitionCalcValue + "px " : "auto " ) +
    (  ( backgroundSizeY !== undefined &&  backgroundSizeY.transitionCalcValue !== undefined ) ? backgroundSizeY.transitionCalcValue + "px" : "auto" );

  };

  LAID.Part.prototype.$renderFn_backgroundPosition = function () {
    this.node.style.backgroundPosition =
    ( this.level.$attr2attrValue.backgroundPositionX !== undefined ? this.level.$attr2attrValue.backgroundPositionX.transitionCalcValue : 0 ) +
    "px " +
    ( this.level.$attr2attrValue.backgroundPositionY !== undefined ? this.level.$attr2attrValue.backgroundPositionY.transitionCalcValue : 0 ) +
    "px" ;
  };

  LAID.Part.prototype.$renderFn_boxShadows = function () {
    var
    attr2attrValue = this.level.$attr2attrValue,
    s = "",
    i, len;
    for ( i = 1, len = attr2attrValue[ "$$num.boxShadows" ].calcVal ; i <= len; i++ ) {
      s +=
      ( ( attr2attrValue["boxShadows" + i + "Inset" ] !== undefined ? attr2attrValue["boxShadows" + i + "Inset" ].transitionCalcValue : false ) ? "inset " : "" ) +
      ( attr2attrValue["boxShadows" + i + "X" ].transitionCalcValue + "px " ) +
      ( attr2attrValue["boxShadows" + i + "Y" ].transitionCalcValue + "px " ) +
      (  attr2attrValue["boxShadows" + i + "Blur" ].transitionCalcValue  + "px " ) +
      ( ( attr2attrValue["boxShadows" + i + "Spread" ] !== undefined ? attr2attrValue["boxShadows" + i + "Spread" ].transitionCalcValue : 0 ) + "px " ) +
      ( attr2attrValue["boxShadows" + i + "Color" ].transitionCalcValue.stringify() ) +
      ",";
    }
    this.node.style.boxShadow = s;
  };



  LAID.Part.prototype.$renderFn_filters = function () {
    var
    attr2attrValue = this.level.$attr2attrValue,
    s = "",
    i, len,
    filterType;
    for ( i = 1, len = attr2attrValue[ "$$num.filters" ].calcVal ; i <= len; i++ ) {
      filterType = attr2attrValue[ "filters" + i + "Type" ];
      switch ( filterType ) {
        case "dropShadow":
          s +=  "dropShadow(" +
          ( attr2attrValue["filters" + i + "X" ].transitionCalcValue + "px " ) +
          (  attr2attrValue["filters" + i + "Y" ].transitionCalcValue  + "px " ) +
          ( attr2attrValue["filters" + i + "Blur" ].transitionCalcValue + "px " ) +
          ( ( attr2attrValue["filters" + i + "Spread" ] !== undefined ? attr2attrValue[ "filters" + i + "Spread" ].transitionCalcValue : 0 ) + "px " ) +
          (  attr2attrValue["filters" + i + "Color" ].transitionCalcValue.stringify() ) +
          ") ";
          break;
        case "blur":
          s += "blur(" + attr2attrValue[ "filters" + i + "Blur" ] + ") ";
          break;
        case "hueRotate":
          s += "hue-rotate(" + attr2attrValue[ "filters" + i + "HueRotate" ] + "deg) ";
          break;
        case "url":
          s += "url(" + attr2attrValue[ "filters" + i + "Url" ] + ") ";
          break;
        default:
          s += filterType + "(" + ( attr2attrValue[ "filters" + i + LAID.$capitalize( filterType ) ] * 100 ) + "%) ";

      }
    }
    this.node.style.filter = s;

  };

  LAID.Part.prototype.$renderFn_cornerRadiusTopLeft = function () {
    this.node.style.borderRadiusTopLeft = this.attr2attrValue.cornerRadiusTopLeft.transitionCalcValue + "px";
  };
  LAID.Part.prototype.$renderFn_cornerRadiusTopRight = function () {
    this.node.style.borderRadiusTopRight = this.attr2attrValue.cornerRadiusTopRight.transitionCalcValue + "px";
  };
  LAID.Part.prototype.$renderFn_cornerRadiusBottomRight = function () {
    this.node.style.borderRadiusBottomRight = this.attr2attrValue.cornerRadiusBottomRight.transitionCalcValue + "px";
  };
  LAID.Part.prototype.$renderFn_cornerRadiusBottomLeft = function () {
    this.node.style.borderRadiusBottomLeft = this.attr2attrValue.cornerRadiusBottomLeft.transitionCalcValue + "px";
  };



  LAID.Part.prototype.$renderFn_borderTopStyle = function () {
    this.node.style.borderTopStyle = this.attr2attrValue.borderTopStyle.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_borderRightStyle = function () {
    this.node.style.borderRightStyle = this.attr2attrValue.borderRightStyle.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_borderBottomStyle = function () {
    this.node.style.borderBottomStyle = this.attr2attrValue.borderBottomStyle.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_borderLeftStyle = function () {
    this.node.style.borderLeftStyle = this.attr2attrValue.borderLeftStyle.transitionCalcValue;
  };


  LAID.Part.prototype.$renderFn_borderTopColor = function () {
    this.node.style.borderTopColor = this.attr2attrValue.borderTopColor.transitionCalcValue.stringify();
  };
  LAID.Part.prototype.$renderFn_borderRightColor = function () {
    this.node.style.borderRightColor = this.attr2attrValue.borderRightColor.transitionCalcValue.stringify();
  };
  LAID.Part.prototype.$renderFn_borderBottomColor = function () {
    this.node.style.borderBottomColor = this.attr2attrValue.borderBottomColor.transitionCalcValue.stringify();
  };
  LAID.Part.prototype.$renderFn_borderLeftColor = function () {
    this.node.style.borderLeftColor = this.attr2attrValue.borderLeftColor.transitionCalcValue.stringify();
  };

  LAID.Part.prototype.$renderFn_borderTopWidth = function () {
    this.node.style.borderTopWidth = this.attr2attrValue.borderTopWidth.transitionCalcValue + "px";
  };
  LAID.Part.prototype.$renderFn_borderRightWidth = function () {
    this.node.style.borderRightWidth = this.attr2attrValue.borderRightWidth.transitionCalcValue + "px";
  };
  LAID.Part.prototype.$renderFn_borderBottomWidth = function () {
    this.node.style.borderBottomWidth = this.attr2attrValue.borderBottomWidth.transitionCalcValue + "px";
  };
  LAID.Part.prototype.$renderFn_borderLeftWidth = function () {
    this.node.style.borderLeftWidth = this.attr2attrValue.borderLeftWidth.transitionCalcValue + "px";
  };



  /* Text Related */

  LAID.Part.prototype.$renderFn_text = function () {
    this.node.innerHtml = this.attr2attrValue.text.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_textSize = function () {
    this.node.fontSize = this.attr2attrValue.textSize.transitionCalcValue + "px";
  };
  LAID.Part.prototype.$renderFn_textFamily = function () {
    this.node.fontFamily = this.attr2attrValue.textFamily.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textWeight = function () {
    this.node.fontWeight = this.attr2attrValue.textWeight.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textColor = function () {
    this.node.color = this.attr2attrValue.textColor.transitionCalcValue.stringify();
  };


  LAID.Part.prototype.$renderFn_textShadows = function () {
    var
    attr2attrValue = this.level.$attr2attrValue,
    s = "",
    i, len;
    for ( i = 1, len = attr2attrValue[ "$$num.textShadows" ].calcVal; i <= len; i++ ) {
      s +=
      (  attr2attrValue["textShadow" + i + "Color" ].transitionCalcValue.stringify() ) + " " +
      ( attr2attrValue["textShadows" + i + "X" ].transitionCalcValue + "px " ) +
      ( attr2attrValue["textShadows" + i + "Y" ].transitionCalcValue + "px " ) +
      ( attr2attrValue["textShadows" + i + "Blur" ].transitionCalcValue  + "px" ) +
      ",";
    }
    this.node.style.textShadow = s;
  };

  LAID.Part.prototype.$renderFn_textVariant = function () {
    this.node.fontVariant = this.attr2attrValue.textVariant.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textStyle = function () {
    this.node.fontStyle = this.attr2attrValue.textStyle.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textDecoration = function () {
    this.node.textDecoration = this.attr2attrValue.textDecoration.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textAlign = function () {
    this.node.textAlign = this.attr2attrValue.textAlign.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textLetterSpacing = function () {
    var textLetterSpacing = this.attr2attrValue.textLetterSpacing;
    this.node.letterSpacing = textLetterSpacing !== undefined && textLetterSpacing.transitionCalcValue !== undefined ?
      textLetterSpacing.transitionCalcValue + "px" : "normal";
  };
  LAID.Part.prototype.$renderFn_textWordSpacing = function () {
    var textWordSpacing = this.attr2attrValue.textWordSpacing;
    this.node.WordSpacing = textWordSpacing !== undefined && textWordSpacing.transitionCalcValue !== undefined ?
    textWordSpacing.transitionCalcValue + "px" : "normal";
  };
  LAID.Part.prototype.$renderFn_textOverflow = function () {
    this.node.textOverflow = this.attr2attrValue.textOverflow.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textIndent = function () {
    this.node.textIndent = this.attr2attrValue.textIndent.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textWhitespace = function () {
    this.node.whitespace = this.attr2attrValue.textWhitespace.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textTopPadding = function () {
    this.node.paddingTop = this.attr2attrValue.textTopPadding.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textRightPadding = function () {
    this.node.paddingRight = this.attr2attrValue.textRightPadding.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textBottomPadding = function () {
    this.node.paddingBottom = this.attr2attrValue.textBottomPadding.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_textLeftPadding = function () {
    this.node.paddingLeft = this.attr2attrValue.textLeftPadding.transitionCalcValue;
  };


  /* Non <div> */

  /* Input (<input/> and <textarea>) Related */

  LAID.Part.prototype.$renderFn_inputLabel = function () {
    this.node.label = this.attr2attrValue.inputLabel.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_inputRows = function () {
    this.node.rows = this.attr2attrValue.inputRows.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_input = function () {
    this.node.value = this.attr2attrValue.input.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_inputPlaceholder = function () {
    this.node.placeholder = this.attr2attrValue.inputPlaceholder.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_inputAutocomplete = function () {
    this.node.autocomplete = this.attr2attrValue.inputAutocomplete.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_inputAutocorrect = function () {
    this.node.autocorrect = this.attr2attrValue.inputAutocorrect.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_inputDisabled = function () {
    this.node.disabled = this.attr2attrValue.inputDisabled.transitionCalcValue;
  };


  /* Link (<a>) Related */

  LAID.Part.prototype.$renderFn_linkHref = function () {
    this.node.href = this.attr2attrValue.linkHref.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_linkRel = function () {
    this.node.rel = this.attr2attrValue.linkRel.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_linkDownload = function () {
    this.node.download = this.attr2attrValue.linkDownload.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_linkTarget = function () {
    this.node.target = this.attr2attrValue.linkTarget.transitionCalcValue;
  };


  /* Image (<img>) related */
  LAID.Part.prototype.$renderFn_imageUrl = function () {
    this.node.src = this.attr2attrValue.imageUrl.transitionCalcValue;
  };

  /* Audio (<audio>) related */
  LAID.Part.prototype.$renderFn_audioSources = function () {
    var
    attr2attrValue = this.level.$attr2attrValue,
    i, len,
    documentFragment = document.createDocumentFragment(),
    childNodes = this.node.childNodes,
    childNode;
    // first remove the current audio sources
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "SOURCE" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrValue[ "$$num.audioSources" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "source" );
      childNode.type = attr2attrValue["audioSources" + i + "Type" ].transitionCalcValue;
      childNode.src = attr2attrValue["audioSources" + i + "Src" ].transitionCalcValue;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAID.Part.prototype.$renderFn_audioTracks = function () {
    var
    attr2attrValue = this.level.$attr2attrValue,
    i, len,
    documentFragment = document.createDocumentFragment(),
    childNodes = this.node.childNodes,
    childNode;
    // first remove the current audio tracks
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "TRACK" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrValue[ "$$num.audioTracks" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "track" );
      childNode.type = attr2attrValue["audioTracks" + i + "Type" ].transitionCalcValue;
      childNode.src = attr2attrValue["audioTracks" + i + "Src" ].transitionCalcValue;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAID.Part.prototype.$renderFn_audioVolume = function () {
    this.node.volume = this.attr2attrValue.audioVolume.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_audioControls = function () {
    this.node.controls = this.attr2attrValue.audioControls.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_audioLoop = function () {
    this.node.loop = this.attr2attrValue.audioLoop.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_audioMuted = function () {
    this.node.muted = this.attr2attrValue.audioMuted.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_audioPreload = function () {
    this.node.preload = this.attr2attrValue.audioPreload.transitionCalcValue;
  };

  /* Video (<video>) related */
  LAID.Part.prototype.$renderFn_videoSources = function () {
    var
    attr2attrValue = this.level.$attr2attrValue,
    i, len,
    documentFragment = document.createDocumentFragment(),
    childNodes = this.node.childNodes,
    childNode;
    // first remove the current video sources
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "SOURCE" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrValue[ "$$num.videoSources" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "source" );
      childNode.type = attr2attrValue["videoSources" + i + "Type" ].transitionCalcValue;
      childNode.src = attr2attrValue["videoSources" + i + "Src" ].transitionCalcValue;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAID.Part.prototype.$renderFn_videoTracks = function () {
    var
    attr2attrValue = this.level.$attr2attrValue,
    i, len,
    documentFragment = document.createDocumentFragment(),
    childNodes = this.node.childNodes,
    childNode;
    // first remove the current video tracks
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "TRACK" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrValue[ "$$num.videoTracks" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "track" );
      childNode.type = attr2attrValue["videoTracks" + i + "Type" ].transitionCalcValue;
      childNode.src = attr2attrValue["videoTracks" + i + "Src" ].transitionCalcValue;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAID.Part.prototype.$renderFn_videoAutoplay = function () {
    this.node.autoplay = this.attr2attrValue.videoAutoplay.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_videoControls = function () {
    this.node.controls = this.attr2attrValue.videoControls.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_videoCrossorigin = function () {
    this.node.crossorigin = this.attr2attrValue.videoCrossorigin.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_videoLoop = function () {
    this.node.loop = this.attr2attrValue.videoLoop.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_videoMuted = function () {
    this.node.muted = this.attr2attrValue.videoMuted.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_videoPreload = function () {
    this.node.preload = this.attr2attrValue.videoPreload.transitionCalcValue;
  };
  LAID.Part.prototype.$renderFn_videoPoster = function () {
    this.node.poster = this.attr2attrValue.videoPoster.transitionCalcValue;
  };



})();
