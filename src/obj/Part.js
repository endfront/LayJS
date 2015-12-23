( function () {
  "use strict";



  var cssPrefix, allStyles,
    defaultCss, defaultTextCss,
    textDimensionCalculateNodeCss,
    inputType2tag, nonInputType2tag,
    textSizeMeasureNode,
    imageSizeMeasureNode,
    supportedInputTypeS;


  // source: http://davidwalsh.name/vendor-prefix
  if ( window.getComputedStyle ) {
    cssPrefix = (Array.prototype.slice
      .call(window.getComputedStyle(document.body, null))
      .join('')
      .match(/(-moz-|-webkit-|-ms-)/)
    )[1];
  } else {
    cssPrefix = "-ms-";
  }


   // source: xicooc (http://stackoverflow.com/a/29837441)
  LAY.$isBelowIE9 = (/MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 10);

  allStyles = document.body.style;


  // check for matrix 3d support
  // source: https://gist.github.com/webinista/3626934 (http://tiffanybbrown.com/2012/09/04/testing-for-css-3d-transforms-support/)
  allStyles[ (cssPrefix + "transform" ) ] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
  if ( window.getComputedStyle ) {
    LAY.$isGpuAccelerated =
      Boolean(
        window.getComputedStyle(
          document.body, null ).getPropertyValue(
            ( cssPrefix + "transform" ) ) ) &&
        !LAY.$isBelowIE9;
  } else {
    LAY.$isGpuAccelerated = false;
  }

  allStyles = undefined;

  defaultCss = "position:absolute;display:block;visibility:inherit;" + 
    "margin:0;padding:0;" +
    "backface-visibility: hidden;" +
    "-webkit-backface-visibility: hidden;" +
    "box-sizing:border-box;-moz-box-sizing:border-box;" +
    "transform-style:preserve-3d;-webkit-transform-style:preserve-3d;" +
    "-webkit-overflow-scrolling:touch;" + 
//    "user-drag:none;" +
    "white-space:nowrap;" +
    "outline:none;border:none;";

  // Most CSS text(/font) properties
  // match the defaults of LAY, however
  // for ones which do not match the
  // below list contains their default css
  defaultTextCss = defaultCss +
    "font-size:15px;" +
    "font-family:sans-serif;color:black;" +
    "text-decoration:none;" +
    "text-align:left;direction:ltr;line-height:1.3em;" +
    "white-space:nowrap;" +
    "-webkit-font-smoothing:antialiased;";

  textDimensionCalculateNodeCss = 
    defaultTextCss + 
    "visibility:hidden;height:auto;" + 
    "border:0px solid transparent;";

  inputType2tag = {
    multiline: "textarea",
    select: "select",
    multiple: "select"
  };

  nonInputType2tag = {
    none: "div",
    text: "div",
    html: "div",
    iframe: "iframe",
    canvas: "canvas",
    image: "img",
    video: "video",
    audio: "audio",
    link: "a"
  };

  supportedInputTypeS = [
    "line", "multiline", "password", "select",
    "multiple" ];

  function stringifyPlusPx ( val ) {
    return val + "px";
  }

  function setText ( node, text ) {
    if ( LAY.$isBelowIE9 ) {
      node.innerHTML = text;
    } else {
      node.textContent = text;
    }
  }

  function generateSelectOptionsHTML( optionS ) {

    var option, html = "";
    for ( var i=0, len=optionS.length; i<len; i++ ) {
      option = optionS[ i ];
      html += "<option value='" + option.value + "'" +
        ( option.selected ? " selected='true'" : "" ) +
        ( option.disabled ? " disabled='true'" : "" ) +
        ">" + option.content + "</option>";
    }
    return html;
  }

  textSizeMeasureNode = document.createElement("div");
  textSizeMeasureNode.style.cssText =
    textDimensionCalculateNodeCss;
  
  document.body.appendChild( textSizeMeasureNode );

  imageSizeMeasureNode = document.createElement("img");
  imageSizeMeasureNode.style.cssText = defaultCss + 
    "visibility:hidden;"
  
  document.body.appendChild( imageSizeMeasureNode );

  LAY.Part = function ( level ) {

    this.level = level;
    this.node = undefined;
    this.type = undefined;
    this.inputType = undefined;
    this.isText = undefined;
    this.isInitiallyRendered = false;

    this.normalRenderDirtyAttrValS = [];
    this.travelRenderDirtyAttrValS = [];

    this.whenEventType2fnMainHandler = {};

    this.isImageLoaded = false;

    // for many derived levels
    this.formationX = undefined;
    this.formationY = undefined;

  };

  function getInputType ( type ) {
    return type.startsWith( "input:" ) &&
      type.slice( "input:".length );
  }

  LAY.Part.prototype.init = function () {

    var inputTag, parentNode, inputType;
    inputType = this.inputType = getInputType( 
        this.level.lson.$type );
    this.type = this.inputType ? "input" :
     this.level.lson.$type;
    if ( inputType && supportedInputTypeS.indexOf(
        inputType ) === -1 ) {
      throw "LAY Error: Unsupported $type: input:" +
        inputType;
    }
    if ( this.level.pathName === "/" ) {
      this.node = document.body;
    } else if ( this.inputType ) {
      inputTag = inputType2tag[ this.inputType ];
      if ( inputTag ) {
        this.node = document.createElement( inputTag );
        if ( inputType === "multiple" ) {
          this.node.multiple = true;
        }
      } else {        
        this.node = document.createElement( "input" );
        this.node.type = this.inputType === "line" ?
          "text" : this.inputType;
        if ( inputType === "password" ) {
          // we wil treat password as a line
          // for logic purposes, as we we will
          // not alter the input[type] during
          // runtime
          this.inputType = "line";
        }
      }

    } else {
      this.node = document.createElement(
        nonInputType2tag[ this.type]);
    }

    this.isText = this.type === "input" || 
      this.type === "text" || this.type === "html";


    if ( this.isText ) {
      this.node.style.cssText = defaultTextCss;
    } else {
      this.node.style.cssText = defaultCss;
    }

    if ( this.type === "input" && this.inputType === "multiline" ) {
      this.node.style.resize = "none";
    }
    

    if ( this.type === "image" ) {
      var part = this;
      LAY.$eventUtils.add( this.node, "load", function() {
        part.isImageLoaded = true;
        part.updateNaturalWidth();
        part.updateNaturalHeight();
        LAY.$solve();
      });
    }
   
  };

  // Precondition: not called on "/" level
  LAY.Part.prototype.remove = function () {
    if ( this.level.pathName !== "/" ) {
      var parentPart = this.level.parentLevel.part;
      parentPart.updateNaturalWidth();
      parentPart.updateNaturalHeight();
      // If the level is inexistent from the start
      // then the node will not have been attached
      if ( this.node.parentNode === parentPart.node ) {
        parentPart.node.removeChild( this.node );
      }
    }
  };

  LAY.Part.prototype.add = function () {
    if ( this.level.pathName !== "/" ) {
      var parentPart = this.level.parentLevel.part;
      parentPart.updateNaturalWidth();
      parentPart.updateNaturalHeight();
      this.level.parentLevel.part.node.appendChild( this.node );
    }
  };


  function checkIfLevelIsDisplayed ( level ) {
    var attrValDisplay = level.attr2attrVal.display;
    return !attrValDisplay || attrValDisplay.calcVal;
  }
  /*
  * Additional constraint of not being dependent upon
  * parent for the attr
  */
  LAY.Part.prototype.findChildMaxOfAttr =
   function ( attr ) {
    var
       curMaxVal = 0,
       childLevel, childLevelAttrVal;

    for ( var i = 0,
         childLevelS = this.level.childLevelS,
        len = childLevelS.length;
         i < len; i++ ) {
      childLevel = childLevelS[ i ];
      if ( childLevel.isPart && !childLevel.isHelper &&
        childLevel.isExist ) {
        if ( checkIfLevelIsDisplayed( childLevel ) ) {
          childLevelAttrVal = childLevel.attr2attrVal[ attr ];
       
          if (
              ( childLevelAttrVal !== undefined ) &&
              ( childLevelAttrVal.calcVal )
            ) {
            if ( childLevelAttrVal.calcVal > curMaxVal ) {
              curMaxVal = childLevelAttrVal.calcVal;
            }
          }
        }
      }
    }

    return curMaxVal;
  };

  
  LAY.Part.prototype.getImmidiateReadonlyVal = function ( attr ) {
    
    switch ( attr ) {
      case "$naturalWidth":
        return this.calculateNaturalWidth();
      case "$naturalHeight":
        return this.calculateNaturalHeight();
      case "$scrolledX":
        return this.node.scrollLeft;
      case "$scrolledY":
        return this.node.scrollTop;
      case "$focused":
        return node === document.activeElement;
      case "$input":
        if ( this.inputType === "multiple" ||
          this.inputType === "select" ) {
          var optionS =
            this.isInitiallyRendered ?
            this.node.options : 
            ( // input might not be calculated
              // as yet, thus OR with the empty array
            this.level.attr2attrVal.input.calcVal || [] );

          var valS = [];
          for ( var i = 0, len = optionS.length;
            i < len; i++ ) {
            if ( optionS[ i ].selected ) {
              valS.push( optionS[ i ].value )
            }
          }
          // Select the first option if none is selected
          // as that will be the default
          if ( optionS.length && !valS.length &&
              this.inputType === "select" ) {
            valS.push(optionS[ 0 ].value );
          }
          return this.inputType === "select" ? 
            valS[ 0 ] : valS ;
          
        } else {
          return this.node.value;
        }

    }
  };


  LAY.Part.prototype.updateNaturalWidth = function () {

    var naturalWidthAttrVal =
      this.level.$getAttrVal("$naturalWidth");
    if ( naturalWidthAttrVal ) {
      LAY.$arrayUtils.pushUnique(
        LAY.$naturalWidthDirtyPartS, 
        this );     
    }
  };

  LAY.Part.prototype.updateNaturalHeight = function () {
    var naturalHeightAttrVal =
      this.level.$getAttrVal("$naturalHeight");
    if ( naturalHeightAttrVal ) {
      LAY.$arrayUtils.pushUnique(
        LAY.$naturalHeightDirtyPartS, 
        this ); 
    }
  };

  LAY.Part.prototype.calculateNaturalWidth = function () {
    var attr2attrVal = this.level.attr2attrVal;
    if ( this.isText ) {
      return this.calculateTextNaturalDimesion( true );
    } else if ( this.type === "image" ) {
      return this.calculateImageNaturalDimesion( true );
    } else {
      return this.findChildMaxOfAttr( "right" );
    }
  };


  LAY.Part.prototype.calculateNaturalHeight = function () {
    var attr2attrVal = this.level.attr2attrVal;
    if ( this.isText ) {
      return this.calculateTextNaturalDimesion( false );
    } else if ( this.type === "image" ) {
      return this.calculateImageNaturalDimesion( false );
    } else {
      return this.findChildMaxOfAttr( "bottom" );
    }
  };

  LAY.Part.prototype.calculateImageNaturalDimesion = function ( isWidth ) {
    if ( !this.isImageLoaded ) {
      return 0;
    } else {
      imageSizeMeasureNode.src =
        this.level.attr2attrVal.imageUrl.calcVal;
      var otherDim = isWidth ? "height" : "width",
        otherDimAttrVal = this.level.attr2attrVal[ 
        otherDim ],
        otherDimVal = otherDimAttrVal ? 
          ( otherDimAttrVal.calcVal !== undefined ?
          otherDimAttrVal.calcVal + "px" : "auto" ) : "auto";

      if ( isWidth ) {
        imageSizeMeasureNode.style.height = otherDimVal;
        imageSizeMeasureNode.style.width = "auto";     
        return imageSizeMeasureNode.offsetWidth;
      } else {
        imageSizeMeasureNode.style.width = otherDimVal;
        imageSizeMeasureNode.style.height = "auto";     
        return imageSizeMeasureNode.offsetHeight;
      }
    }
  };

  /*
  * ( Height occupied naturally by text can be estimated
  * without creating a DOM node and checking ".offsetHeight"
  * if the text does not wrap, or it does wrap however with
  * extremely high probability does not span more than 1 line )
  * If the height can be estimated without using a DOM node
  * then return the estimated height, else return -1;
  */
  LAY.Part.prototype.estimateTextNaturalHeight = function ( text ) {
    if ( this.type === "html" &&
        checkIfTextMayHaveHTML ( text ) ) {
      return -1;
    } else {
      var heightAttr2default = {
        "textSize": 15,
        "textWrap": "nowrap",
        "textPaddingTop": 0,
        "textPaddingBottom": 0,
        "borderTopWidth": 0,
        "borderBottomWidth": 0,
        "textLineHeight": 1.3,
        "textLetterSpacing": 1,
        "textWordSpacing": 1,
        "width": null
      };

      var heightAttr2val = {};

      for ( var heightAttr in heightAttr2default ) {
        var attrVal = this.level.attr2attrVal[ heightAttr ];
        heightAttr2val[ heightAttr ] = ( attrVal === undefined ||
          attrVal.calcVal === undefined ) ?
          heightAttr2default[ heightAttr ] : attrVal.calcVal;
      }

      // Do not turn the below statement into a ternary as
      // it will end up being unreadable
      var isEstimatePossible = false;
      if ( heightAttr2val.textWrap === "nowrap" ) {
        isEstimatePossible = true;
      } else if (
          LAY.$isOkayToEstimateWhitespaceHeight &&
          ( heightAttr2val.textWrap === "normal" ||
          text.indexOf( "\\" ) === -1 ) && //escape characters can
          // contain whitespace characters such as line breaks and/or tabs
          heightAttr2val.textLetterSpacing ===  1 &&
          heightAttr2val.textWordSpacing === 1 &&
          heightAttr2val.width !== null ) {
        if ( text.length <  ( 0.7 *
            ( heightAttr2val.width / heightAttr2val.textSize ) ) ) {
          isEstimatePossible = true;
        }
      }

      if ( isEstimatePossible ) {
        return ( heightAttr2val.textSize * heightAttr2val.textLineHeight ) + 
          heightAttr2val.textPaddingTop +
          heightAttr2val.textPaddingBottom +
          heightAttr2val.borderTopWidth + 
          heightAttr2val.borderBottomWidth;
      } else {
        return -1;
      }      

    }
  };

  function checkIfTextMayHaveHTML( text ) {
    return text.indexOf( "<" ) !== -1 && text.indexOf( ">" ) !== -1;
  };
  LAY.Part.prototype.calculateTextNaturalDimesion = function ( isWidth ) {

    var dimensionAlteringAttr2fnStyle = {
      textSize: stringifyPxOrString,
      textFamily: null,
      textWeight: null,
      textAlign: null,
      textStyle: null,      
      textDirection: null,
      textTransform: null,
      textVariant: null,
      textLetterSpacing: stringifyPxOrStringOrNormal,
      textWordSpacing: stringifyPxOrStringOrNormal,
      textLineHeight: stringifyEmOrString,
      textOverflow: null,
      textIndent: stringifyPlusPx,
      textWrap: null,

      textWordBreak: null,
      textWordWrap: null,
      textRendering: null,

      textPaddingTop: stringifyPlusPx,
      textPaddingRight: stringifyPlusPx,
      textPaddingBottom: stringifyPlusPx,
      textPaddingLeft: stringifyPlusPx,
      borderTopWidth: stringifyPlusPx,
      borderRightWidth: stringifyPlusPx,
      borderBottomWidth: stringifyPlusPx,
      borderLeftWidth: stringifyPlusPx
    };

    var dimensionAlteringAttr2cssProp = {
      textSize: "font-size",
      textFamily: "font-family",
      textWeight: "font-weight",
      textAlign: "text-align",
      textStyle: "font-style",
      textDirection: "direction",
      textTransform: "text-transform",
      textVariant: "font-variant",
      textLetterSpacing: "letter-spacing",
      textWordSpacing: "word-spacing",
      textLineHeight: "line-height",
      textOverflow: "text-overflow",
      textIndent: "text-indent",
      textWrap: "white-space",
      textWordBreak: "word-break",
      textWordWrap: "word-wrap",
      textRendering: "text-rendering",
      textPaddingTop: "padding-top",
      textPaddingRight: "padding-right",
      textPaddingBottom: "padding-bottom",
      textPaddingLeft: "padding-left",
      borderTopWidth: "border-top-width",
      borderRightWidth: "border-right-width",
      borderBottomWidth: "border-bottom-width",
      borderLeftWidth: "border-left-width"
    };

    var
      attr2attrVal = this.level.attr2attrVal,
      dimensionAlteringAttr, fnStyle,
      textRelatedAttrVal,
      content, ret,
      cssText = textDimensionCalculateNodeCss;

    if ( this.type === "input" ) {
      if ( this.inputType === "select" ||
        this.inputType === "multiple" ) {
        content = "<select" +
          ( this.inputType === "multiple" ? 
          " multiple='true' " : "" ) +  ">" +
          generateSelectOptionsHTML(
            attr2attrVal.input.calcVal
           ) + "</select>";
      } else {
        content = attr2attrVal.$input ?
          attr2attrVal.$input.calcVal : "a";
      }
    } else {
      if ( attr2attrVal.text.isRecalculateRequired ) {
        return 0;
      }
      content = attr2attrVal.text.calcVal;
    }

    if ( typeof content !== "string" ) {
      content = content.toString();
    }

    if ( !isWidth ) {
      var estimatedHeight = this.estimateTextNaturalHeight( content );
      if ( estimatedHeight !== -1 ) {
        return estimatedHeight;
      }
    }

    for ( dimensionAlteringAttr in
       dimensionAlteringAttr2fnStyle ) {
      textRelatedAttrVal = attr2attrVal[ 
        dimensionAlteringAttr ];
      if ( textRelatedAttrVal &&
        textRelatedAttrVal.calcVal !== undefined ) {

        fnStyle = dimensionAlteringAttr2fnStyle[ 
            dimensionAlteringAttr ];
        
        cssText += 
          dimensionAlteringAttr2cssProp[
          dimensionAlteringAttr ] + ":" +
          ( (fnStyle === null) ?
          textRelatedAttrVal.calcVal :
          fnStyle( textRelatedAttrVal.calcVal ) ) + ";";
    
      }
    }
    

    if ( isWidth ) {
      cssText += "display:inline;width:auto;";
      textSizeMeasureNode.style.cssText = cssText;
      if ( this.type === "text" ) {
        setText( textSizeMeasureNode, content );
      } else {
        textSizeMeasureNode.innerHTML = content;
      }
      ret = textSizeMeasureNode.offsetWidth;

    } else {
      cssText += "width:" + 
        ( attr2attrVal.width.calcVal || 0 ) + "px;";
      textSizeMeasureNode.style.cssText = cssText;

      // If empty we will subsitute with the character "a"
      // as we wouldn't want the height to resolve to 0
      if ( this.type === "text" ) {
        setText( textSizeMeasureNode, content || "a" );
      } else {
        textSizeMeasureNode.innerHTML = content || "a";
      }
      
      ret = textSizeMeasureNode.offsetHeight;
      
    }
    return ret;    

  };



  LAY.Part.prototype.addNormalRenderDirtyAttrVal = function ( attrVal ) {

    LAY.$arrayUtils.remove( this.travelRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( this.normalRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( LAY.$renderDirtyPartS, this );

  };

  LAY.Part.prototype.addTravelRenderDirtyAttrVal = function ( attrVal ) {

    LAY.$arrayUtils.remove( this.normalRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( this.travelRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( LAY.$renderDirtyPartS, this );

  };

  LAY.Part.prototype.updateWhenEventType = function ( eventType ) {

    var
      numFnHandlersForEventType =
        this.level.attr2attrVal[ "$$num.when." + eventType ].val,
      fnMainHandler,
      thisLevel = this.level;

    if ( this.whenEventType2fnMainHandler[ eventType ] !== undefined ) {
      LAY.$eventUtils.remove( 
        this.node, eventType,
          this.whenEventType2fnMainHandler[ eventType ] );
    }

    if ( numFnHandlersForEventType !== 0 ) {

      fnMainHandler = function ( e ) {
        var i, len, attrValForFnHandler;
        for ( i = 0; i < numFnHandlersForEventType; i++ ) {
          attrValForFnHandler =
          thisLevel.attr2attrVal[ "when." + eventType + "." + ( i + 1 ) ];
          if ( attrValForFnHandler !== undefined ) {
            attrValForFnHandler.calcVal.call( thisLevel, e );
          }
        }
      };
      LAY.$eventUtils.add( this.node, eventType, fnMainHandler );
      this.whenEventType2fnMainHandler[ eventType ] = fnMainHandler;

    } else {
      this.whenEventType2fnMainHandler[ eventType ] = undefined;
    }
  
  };

  LAY.Part.prototype.checkIsPropInTransition = function ( prop ) {
    return ( this.level.attr2attrVal[ "transition." + prop  + ".type" ] !==
      undefined )  ||
      ( this.level.attr2attrVal[ "transition." + prop  + ".delay" ] !==
        undefined );
  };

  LAY.Part.prototype.updateTransitionProp = function ( transitionProp ) {

    if ( this.isInitiallyRendered ) {
      var
        attr2attrVal = this.level.attr2attrVal,
        attr, attrVal,
        transitionPrefix,
        transitionType, transitionDuration, transitionDelay, transitionDone,
        transitionArgS, transitionArg2val = {},
        transitionObj,
        i, len,
        allAffectedProp, // (eg: when `top` changes but transition
        //is provided by `positional`)
        affectedPropAttrVal;

      // TODO: change the below to a helper function
      if ( ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf(
         transitionProp ) !== -1  ) {
        return;
      }

      if ( !this.checkIsPropInTransition( transitionProp ) ) {
        if ( this.checkIsPropInTransition( "all" ) ) {
          allAffectedProp = transitionProp;
          transitionProp = "all";
        } else {
          return;
        }
      }

      transitionPrefix = "transition." + transitionProp + ".";

      transitionType =
        attr2attrVal[ transitionPrefix + "type" ] ?
        attr2attrVal[ transitionPrefix + "type" ].calcVal :
        "linear";

      transitionDuration =
        ( attr2attrVal[ transitionPrefix + "duration" ] ?
        attr2attrVal[ transitionPrefix + "duration" ].calcVal :
        0 );
      transitionDelay =
        ( attr2attrVal[ transitionPrefix + "delay" ] ?
        attr2attrVal[ transitionPrefix + "delay" ].calcVal :
        0 );
      transitionDone =
        ( attr2attrVal[ transitionPrefix + "done" ] ?
        attr2attrVal[ transitionPrefix + "done" ].calcVal :
        undefined );
      transitionArgS = LAY.$transitionType2args[ transitionType ] ?
        LAY.$transitionType2args[ transitionType ] : [];


      for ( i = 0, len = transitionArgS.length; i < len; i++ ) {

        transitionArg2val[ transitionArgS[ i ] ] = (
           attr2attrVal[ transitionPrefix + "args." +
            transitionArgS[ i ] ] ?
           attr2attrVal[ transitionPrefix + "args." +
            transitionArgS[ i ] ].calcVal : undefined );
      }

      if ( !allAffectedProp && ( transitionProp === "all" ) ) {

        for ( attr in attr2attrVal ) {
          attrVal = attr2attrVal[ attr ];
          // Only invoke a transition if:
          // (1) The prop is renderable (i.e has a render call)
          // (2) The prop doesn't have a transition of its
          //     own. For instance if "left" already has
          //     a transition then we will not want to override
          //     its transition with the lower priority "all" transition
          if ( attrVal.renderCall &&
              !this.checkIsPropInTransition( attrVal.attr ) ) {
            this.updateTransitionAttrVal(
              attrVal,
               transitionType, transitionDelay, transitionDuration,
               transitionArg2val, transitionDone
             );

          }
        }
      } else {

        this.updateTransitionAttrVal(
           attr2attrVal[ allAffectedProp || transitionProp ],
           transitionType, transitionDelay, transitionDuration,
           transitionArg2val, transitionDone
        );
      }
    }
  };

  LAY.Part.prototype.updateTransitionAttrVal = function ( attrVal,
    transitionType, transitionDelay, transitionDuration,
    transitionArg2val, transitionDone  ) {

    // First check if the transition information is complete
    if (
          transitionType &&
        ( transitionDuration !== undefined ) &&
        ( transitionDelay !== undefined ) &&
        ( attrVal !== undefined ) &&
        ( attrVal.isTransitionable )
        ) {

      attrVal.startCalcVal =  attrVal.transitionCalcVal;
      attrVal.transition = new LAY.Transition (
          transitionType,
          transitionDelay,
          transitionDuration, transitionArg2val,
          transitionDone );
    } else if ( attrVal !== undefined ) { // else delete the transition

      attrVal.transition = undefined;
    }
  }

  function stringifyPxOrString( val, defaultVal ) {
    return ( val === undefined ) ?
        defaultVal : ( typeof val === "number" ?
        ( val + "px" ) : val );
  }

  function stringifyPxOrStringOrNormal( val, defaultVal ) {
    if ( val === 0 ) {
      return "normal";
    } else {
      return stringifyPlusPx( val, defaultVal );
    }
  }

  function stringifyEmOrString( val, defaultVal ) {
    return ( val === undefined ) ?
        defaultVal : ( typeof val === "number" ?
        ( val + "em" ) : val );
  }

  function computePxOrString( attrVal, defaultVal ) {
    
    return stringifyPxOrString(
      attrVal && attrVal.transitionCalcVal,
      defaultVal );
    
  }

  function computePxOrStringOrNormal( attrVal, defaultVal ) {
  
    return stringifyPxOrStringOrNormal(
      attrVal && attrVal.transitionCalcVal,
      defaultVal );
    
  }

  function computeEmOrString( attrVal, defaultVal ) {
    return stringifyEmOrString(
      attrVal && attrVal.transitionCalcVal,
      defaultVal );
  }

  function computeColorOrString( attrVal, defaultVal ) {
    var transitionCalcVal =
      attrVal && attrVal.transitionCalcVal;
    return ( transitionCalcVal === undefined ) ?
        defaultVal : ( transitionCalcVal instanceof LAY.Color ?
        transitionCalcVal.stringify() : transitionCalcVal );
  }
  

  // Below we will customize prototypical functions
  // using conditionals. As per the results from
  // http://jsperf.com/foreign-function-within-prototype-chain
  // http://jsperf.com/dynamic-modification-of-prototype-chain
  // this will make no difference

  // The renderable prop can be
  // accessed via `part.renderFn_<prop>`

  LAY.Part.prototype.renderFn_x =  function () {
    var attr2attrVal = this.level.attr2attrVal;
    this.node.style.left =
      ( attr2attrVal.left.transitionCalcVal +
        ( attr2attrVal.shiftX !== undefined ?
          attr2attrVal.shiftX.transitionCalcVal : 0 ) ) +
          "px";
    };

  LAY.Part.prototype.renderFn_y =  function () {
    var attr2attrVal = this.level.attr2attrVal;
    this.node.style.top =
      ( attr2attrVal.top.transitionCalcVal +
        ( attr2attrVal.shiftY !== undefined ?
          attr2attrVal.shiftY.transitionCalcVal : 0 ) ) +
          "px";
    };

  if ( LAY.$isGpuAccelerated ) {

    // TODO: optimize to enter matrix3d directly
    LAY.Part.prototype.renderFn_positionAndTransform =   
    function () {
      var attr2attrVal = this.level.attr2attrVal;
      cssPrefix = cssPrefix === "-moz-" ? "" : cssPrefix;
      this.node.style[ cssPrefix + "transform" ] =
      
      "translate(" +
      ( ( attr2attrVal.left.transitionCalcVal + ( attr2attrVal.shiftX !== undefined ? attr2attrVal.shiftX.transitionCalcVal : 0 ) ) + "px, " ) +

      ( ( attr2attrVal.top.transitionCalcVal + ( attr2attrVal.shiftY !== undefined ? attr2attrVal.shiftY.transitionCalcVal : 0 ) ) + "px) " ) +
      ( attr2attrVal.z !== undefined ? "translateZ(" + attr2attrVal.z.transitionCalcVal + "px) " : "" ) +
      ( attr2attrVal.scaleX !== undefined ? "scaleX(" + attr2attrVal.scaleX.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleY !== undefined ? "scaleY(" + attr2attrVal.scaleY.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleZ !== undefined ? "scaleZ(" + attr2attrVal.scaleZ.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.skewX !== undefined ? "skewX(" + attr2attrVal.skewX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.skewY !== undefined ? "skewY(" + attr2attrVal.skewY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateX !== undefined ? "rotateX(" + attr2attrVal.rotateX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateY !== undefined ? "rotateY(" + attr2attrVal.rotateY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateZ !== undefined ? "rotateZ(" + attr2attrVal.rotateZ.transitionCalcVal + "deg)" : "" );

    };

    LAY.Part.prototype.renderFn_transform =   
    function () {
      var attr2attrVal = this.level.attr2attrVal;
      cssPrefix = cssPrefix === "-moz-" ? "" : cssPrefix;
      this.node.style[ cssPrefix + "transform" ] =
      ( attr2attrVal.scaleX !== undefined ? "scaleX(" + attr2attrVal.scaleX.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleY !== undefined ? "scaleY(" + attr2attrVal.scaleY.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleZ !== undefined ? "scaleZ(" + attr2attrVal.scaleZ.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.skewX !== undefined ? "skewX(" + attr2attrVal.skewX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.skewY !== undefined ? "skewY(" + attr2attrVal.skewY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateX !== undefined ? "rotateX(" + attr2attrVal.rotateX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateY !== undefined ? "rotateY(" + attr2attrVal.rotateY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateZ !== undefined ? "rotateZ(" + attr2attrVal.rotateZ.transitionCalcVal + "deg)" : "" );
    };

  } else {
    // legacy browser usage or forced non-gpu mode

    LAY.Part.prototype.renderFn_positionAndTransform =
      function () {
        this.renderFn_x();
        this.renderFn_y();
      };

    LAY.Part.prototype.renderFn_transform = function () {};
  }

  LAY.Part.prototype.renderFn_width = function () {
      this.node.style.width =
        this.level.attr2attrVal.width.transitionCalcVal + "px";
      if ( [ "canvas", "video", "image","iframe" ].indexOf(
          this.type ) !== -1 ) {
        this.node.width =
          this.level.attr2attrVal.width.transitionCalcVal;
      }
    };

  LAY.Part.prototype.renderFn_height = function () {
    this.node.style.height =
      this.level.attr2attrVal.height.transitionCalcVal + "px";
    if ( [ "canvas", "video", "image","iframe" ].indexOf(
          this.type ) !== -1 ) {
      this.node.height =
        this.level.attr2attrVal.height.transitionCalcVal;
    }
  };


  LAY.Part.prototype.renderFn_origin = function () {
    var attr2attrVal = this.level.attr2attrVal;

    this.node.style[ cssPrefix + "transform-origin" ] =
    ( ( attr2attrVal.originX !== undefined ? attr2attrVal.originX.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrVal.originY !== undefined ? attr2attrVal.originY.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( attr2attrVal.originZ !== undefined ? attr2attrVal.originZ.transitionCalcVal : 0  ) + "px";
  };


  LAY.Part.prototype.renderFn_perspective = function () {
    this.node.style[ cssPrefix + "perspective" ] =
     this.level.attr2attrVal.perspective.transitionCalcVal + "px";
  };

  LAY.Part.prototype.renderFn_perspectiveOrigin = function () {
    var attr2attrVal = this.level.attr2attrVal;
    this.node.style[ cssPrefix + "perspective-origin" ] =
    ( attr2attrVal.perspectiveOriginX ?
     ( attr2attrVal.perspectiveOriginX.transitionCalcVal * 100 )
      : 0 ) + "% " +
    ( attr2attrVal.perspectiveOriginY ?
     ( attr2attrVal.perspectiveOriginY.transitionCalcVal * 100 )
      : 0 ) + "%";
  };

  LAY.Part.prototype.renderFn_backfaceVisibility = function () {
    this.node.style[ cssPrefix + "backface-visibility" ] =
      this.level.attr2attrVal.backfaceVisibility.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_opacity = function () {
    this.node.style.opacity = this.level.attr2attrVal.opacity.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_display = function () {
    
    this.node.style.display =
      this.level.attr2attrVal.display.transitionCalcVal ?
        "block" : "none";
  };

  LAY.Part.prototype.renderFn_visible = function () {
    
    this.node.style.visibility =
      this.level.attr2attrVal.visible.transitionCalcVal ?
        "inherit" : "hidden";

  };

  LAY.Part.prototype.renderFn_zIndex = function () {

    this.node.style.zIndex =
      this.level.attr2attrVal.zIndex.transitionCalcVal || "auto";
  };


  LAY.Part.prototype.renderFn_focus = function () {
    if ( this.level.attr2attrVal.focus.transitionCalcVal ) {
      this.node.focus();
    } else if ( document.activeElement === this.node ) {
      document.body.focus();
    }
  };

  LAY.Part.prototype.renderFn_scrollX = function () {
    this.node.scrollLeft =
      this.level.attr2attrVal.scrollX.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_scrollY = function () {
    this.node.scrollTop =
      this.level.attr2attrVal.scrollY.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_scrollElastic = function () {
    this.node["-webkit-overflow-scrolling"] =
      this.level.attr2attrVal.scrollElastic.transitionCalcVal ?
       "touch" : "auto";
  };

  LAY.Part.prototype.renderFn_overflowX = function () {
    this.node.style.overflowX =
      this.level.attr2attrVal.overflowX.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_overflowY = function () {
    this.node.style.overflowY =
      this.level.attr2attrVal.overflowY.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_cursor = function () {
    this.node.style.cursor =
      this.level.attr2attrVal.
      cursor.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_userSelect = function () {
    if ( this.type !== "input" ) {
      this.node.style[ cssPrefix + "user-select" ] = 
        this.level.attr2attrVal.userSelect.transitionCalcVal;
    }
  };
  LAY.Part.prototype.renderFn_title = function () {
    this.node.title =
      this.level.attr2attrVal.
      title.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_tabindex = function () {
    this.node.tabindex =
      this.level.attr2attrVal.
      tabindex.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_backgroundColor = function () {
    this.node.style.backgroundColor =
      this.level.attr2attrVal.
      backgroundColor.transitionCalcVal.stringify();
  };

  LAY.Part.prototype.renderFn_backgroundImage = function () {
    this.node.style.backgroundImage =
      this.level.attr2attrVal.
      backgroundImage.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_backgroundAttachment = function () {
    this.node.style.backgroundAttachment = this.level.attr2attrVal.backgroundAttachment.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_backgroundRepeat = function () {
    this.node.style.backgroundRepeat = this.level.attr2attrVal.backgroundRepeat.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_backgroundSize = function () {
    
    this.node.style.backgroundSize =
      computePxOrString( 
        this.level.attr2attrVal.backgroundSizeX, "auto" ) +
      " " +
      computePxOrString(
        this.level.attr2attrVal.backgroundSizeY, "auto" );

  };

  LAY.Part.prototype.renderFn_backgroundPosition = function () {
    this.node.style.backgroundPosition =
      computePxOrString(
        this.level.attr2attrVal.backgroundPositionX, "0px" ) +
         " " +
      computePxOrString(
        this.level.attr2attrVal.backgroundPositionX, "0px" );
    
  };

  LAY.Part.prototype.renderFn_boxShadows = function () {
    if ( !LAY.$isBelowIE9 ) {
      var
      attr2attrVal = this.level.attr2attrVal,
      s = "",
      i, len;
      for ( i = 1, len = attr2attrVal[ "$$max.boxShadows" ].calcVal; i <= len;
       i++ ) {
        s +=
        ( ( attr2attrVal["boxShadows" + i + "Inset" ] !== undefined ?
         attr2attrVal["boxShadows" + i + "Inset" ].transitionCalcVal :
          false ) ? "inset " : "" ) +
        ( attr2attrVal["boxShadows" + i + "X" ].transitionCalcVal + "px " ) +
        ( attr2attrVal["boxShadows" + i + "Y" ].transitionCalcVal + "px " ) +
        ( ( attr2attrVal["boxShadows" + i + "Blur" ] !== undefined ?
          attr2attrVal["boxShadows" + i + "Blur" ].transitionCalcVal : 0 )
          + "px " ) +
        ( ( attr2attrVal["boxShadows" + i + "Spread" ] !== undefined ?
         attr2attrVal["boxShadows" + i + "Spread" ].transitionCalcVal : 0 )
          + "px " ) +
        ( attr2attrVal["boxShadows" + i + "Color" ].transitionCalcVal.stringify() );

        if ( i !== len ) {
          s += ",";
        }
      }
      this.node.style.boxShadow = s;
    }
  };



  LAY.Part.prototype.renderFn_filters = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
    s = "",
    i, len,
    filterType;
    for ( i = 1, len = attr2attrVal[ "$$max.filters" ].calcVal ; i <= len; i++ ) {
      filterType = attr2attrVal[ "filters" + i + "Type" ].calcVal;
      switch ( filterType ) {
        case "dropShadow":
          s +=  "drop-shadow(" +
          ( attr2attrVal["filters" + i + "X" ].transitionCalcVal + "px " ) +
          (  attr2attrVal["filters" + i + "Y" ].transitionCalcVal  + "px " ) +
          ( attr2attrVal["filters" + i + "Blur" ].transitionCalcVal + "px " ) +
    //      ( ( attr2attrVal["filters" + i + "Spread" ] !== undefined ? attr2attrVal[ "filters" + i + "Spread" ].transitionCalcVal : 0 ) + "px " ) +
          (  attr2attrVal["filters" + i + "Color" ].transitionCalcVal.stringify() ) +
          ") ";
          break;
        case "blur":
          s += "blur(" + attr2attrVal[ "filters" + i + "Blur" ] + ") ";
          break;
        case "hueRotate":
          s += "hue-rotate(" + attr2attrVal[ "filters" + i + "HueRotate" ] + "deg) ";
          break;
        case "url":
          s += "url(" + attr2attrVal[ "filters" + i + "Url" ] + ") ";
          break;
        default:
          s += filterType + "(" + ( attr2attrVal[ "filters" + i + LAY.$capitalize( filterType ) ] * 100 ) + "%) ";

      }
    }
    this.node.style[ cssPrefix + "filter" ] = s;

  };

  LAY.Part.prototype.renderFn_cornerRadiusTopLeft = function () {
    this.node.style.borderTopLeftRadius =
     this.level.attr2attrVal.cornerRadiusTopLeft.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_cornerRadiusTopRight = function () {
    this.node.style.borderTopRightRadius =
      this.level.attr2attrVal.cornerRadiusTopRight.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_cornerRadiusBottomRight = function () {
    this.node.style.borderBottomRightRadius =
      this.level.attr2attrVal.cornerRadiusBottomRight.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_cornerRadiusBottomLeft = function () {
    this.node.style.borderBottomLeftRadius =
      this.level.attr2attrVal.cornerRadiusBottomLeft.transitionCalcVal + "px";
  };



  LAY.Part.prototype.renderFn_borderTopStyle = function () {
    this.node.style.borderTopStyle =
      this.level.attr2attrVal.borderTopStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_borderRightStyle = function () {
    this.node.style.borderRightStyle =
      this.level.attr2attrVal.borderRightStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_borderBottomStyle = function () {
    this.node.style.borderBottomStyle =
      this.level.attr2attrVal.borderBottomStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_borderLeftStyle = function () {
    this.node.style.borderLeftStyle =
      this.level.attr2attrVal.borderLeftStyle.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_borderTopColor = function () {
    this.node.style.borderTopColor =
      this.level.attr2attrVal.borderTopColor.transitionCalcVal.stringify();
  };
  LAY.Part.prototype.renderFn_borderRightColor = function () {
    this.node.style.borderRightColor =
      this.level.attr2attrVal.borderRightColor.transitionCalcVal.stringify();
  };
  LAY.Part.prototype.renderFn_borderBottomColor = function () {
    this.node.style.borderBottomColor =
      this.level.attr2attrVal.borderBottomColor.transitionCalcVal.stringify();
  };
  LAY.Part.prototype.renderFn_borderLeftColor = function () {
    this.node.style.borderLeftColor =
      this.level.attr2attrVal.borderLeftColor.transitionCalcVal.stringify();
  };

  LAY.Part.prototype.renderFn_borderTopWidth = function () {
    this.node.style.borderTopWidth =
      this.level.attr2attrVal.borderTopWidth.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_borderRightWidth = function () {
    this.node.style.borderRightWidth =
      this.level.attr2attrVal.borderRightWidth.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_borderBottomWidth = function () {
    this.node.style.borderBottomWidth =
      this.level.attr2attrVal.borderBottomWidth.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_borderLeftWidth = function () {
    this.node.style.borderLeftWidth =
      this.level.attr2attrVal.borderLeftWidth.transitionCalcVal + "px";
  };



  /* Text Related */

  LAY.Part.prototype.renderFn_text = function () {
    var text = this.level.attr2attrVal.text.transitionCalcVal;
    if ( this.type === "text" ) {
      setText( this.node, text );
    } else { //else is type "html"
      this.node.innerHTML = text;
    }

  };

  LAY.Part.prototype.renderFn_textSize = function () {
    this.node.style.fontSize =
      computePxOrString( this.level.attr2attrVal.textSize );
  };
  LAY.Part.prototype.renderFn_textFamily = function () {
    this.node.style.fontFamily =
      this.level.attr2attrVal.textFamily.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_textWeight = function () {
    this.node.style.fontWeight =
      this.level.attr2attrVal.textWeight.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textColor = function () {
    this.node.style.color = 
      computeColorOrString( 
        this.level.attr2attrVal.textColor );
  };

  LAY.Part.prototype.renderFn_textVariant = function () {
    this.node.style.fontVariant =
      this.level.attr2attrVal.textVariant.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textTransform = function () {
    this.node.style.textTransform =
      this.level.attr2attrVal.textTransform.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textStyle = function () {
    this.node.style.fontStyle =
      this.level.attr2attrVal.textStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textDecoration = function () {
    this.node.style.textDecoration =
      this.level.attr2attrVal.textDecoration.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textLetterSpacing = function () {
    this.node.style.letterSpacing = computePxOrStringOrNormal( 
        this.level.attr2attrVal.textLetterSpacing ) ;
  };
  LAY.Part.prototype.renderFn_textWordSpacing = function () {
    this.node.style.wordSpacing = computePxOrStringOrNormal( 
        this.level.attr2attrVal.textWordSpacing );
  };
  LAY.Part.prototype.renderFn_textAlign = function () {
    this.node.style.textAlign =
      this.level.attr2attrVal.textAlign.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textDirection = function () {
    //var dir = this.level.attr2attrVal.textDirection.transitionCalcVal;
    //if ( dir ) { //IE <8 throws error when given undefined value
    this.node.style.direction =
      this.level.attr2attrVal.textDirection.transitionCalcVal;
    //}
  };
  LAY.Part.prototype.renderFn_textLineHeight = function () {
    this.node.style.lineHeight = computeEmOrString( 
        this.level.attr2attrVal.textLineHeight );
  };

  LAY.Part.prototype.renderFn_textOverflow = function () {
    this.node.style.textOverflow =
      this.level.attr2attrVal.textOverflow.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textIndent = function () {
    this.node.style.textIndent =
      this.level.attr2attrVal.textIndent.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textWrap = function () {
    this.node.style.whiteSpace =
      this.level.attr2attrVal.textWrap.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textWordBreak = function () {
    this.node.style.wordBreak =
      this.level.attr2attrVal.textWordBreak.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textWordWrap = function () {
    this.node.style.wordWrap =
      this.level.attr2attrVal.textWordWrap.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textSmoothing = function () {
    this.node.style[ cssPrefix + "font-smoothing" ] =
     this.level.attr2attrVal.textSmoothing.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textRendering = function () {
    this.node.style.textRendering =
      this.level.attr2attrVal.textRendering.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textPaddingTop = function () {
    this.node.style.paddingTop =
      this.level.attr2attrVal.textPaddingTop.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textPaddingRight = function () {
    this.node.style.paddingRight =
      this.level.attr2attrVal.textPaddingRight.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textPaddingBottom = function () {
    this.node.style.paddingBottom =
      this.level.attr2attrVal.textPaddingBottom.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textPaddingLeft = function () {
    this.node.style.paddingLeft =
      this.level.attr2attrVal.textPaddingLeft.transitionCalcVal + "px";
  };

  LAY.Part.prototype.renderFn_textShadows = function () {
    var attr2attrVal = this.level.attr2attrVal,
      s = "",
      i, len;
    for ( i = 1, len = attr2attrVal[ "$$max.textShadows" ].calcVal; i <= len; i++ ) {
      s +=
      (  attr2attrVal["textShadows" + i + "Color" ].transitionCalcVal.stringify() ) + " " +
      ( attr2attrVal["textShadows" + i + "X" ].transitionCalcVal + "px " ) +
      ( attr2attrVal["textShadows" + i + "Y" ].transitionCalcVal + "px " ) +
      ( attr2attrVal["textShadows" + i + "Blur" ].transitionCalcVal  + "px" );

      if ( i !== len ) {
        s += ",";
      }

    }
    this.node.style.textShadow = s;
  };

  /* Non <div> */

  /* Input Related */


  LAY.Part.prototype.renderFn_input = function () {
    var inputVal = this.level.attr2attrVal.input.transitionCalcVal;
    if ( this.inputType === "select" || this.inputType === "multiple" ) {
      this.node.innerHTML = generateSelectOptionsHTML( inputVal );
    } else {
      this.node.value = inputVal;
    }
  };


  LAY.Part.prototype.renderFn_inputLabel = function () {
    this.node.label = this.level.attr2attrVal.inputLabel.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputRows = function () {
    this.node.rows = this.level.attr2attrVal.inputRows.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputPlaceholder = function () {
    this.node.placeholder = this.level.attr2attrVal.inputPlaceholder.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputAutocomplete = function () {
    this.node.autocomplete = this.level.attr2attrVal.inputAutocomplete.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputAutocorrect = function () {
    this.node.autocorrect = this.level.attr2attrVal.inputAutocorrect.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputDisabled = function () {
    this.node.disabled = this.level.attr2attrVal.inputDisabled.transitionCalcVal;
  };

  /* Link (<a>) Related */

  LAY.Part.prototype.renderFn_linkHref = function () {
    this.node.href = this.level.attr2attrVal.linkHref.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_linkRel = function () {
    this.node.rel = this.level.attr2attrVal.linkRel.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_linkDownload = function () {
    this.node.download = this.level.attr2attrVal.linkDownload.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_linkTarget = function () {
    this.node.target = this.level.attr2attrVal.linkTarget.transitionCalcVal;
  };

  /* Image (<img>) related */
  LAY.Part.prototype.renderFn_imageUrl = function () {
    this.node.src = this.level.attr2attrVal.imageUrl.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_imageAlt = function () {
    this.node.alt = this.level.attr2attrVal.imageAlt.transitionCalcVal;
  };
  

  /* Audio (<audio>) related */

  LAY.Part.prototype.renderFn_audioSrc = function () {
    this.node.src = this.level.attr2attrVal.audioSrc.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_audioSources = function () {
    var
      attr2attrVal = this.level.attr2attrVal,
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
    for ( i = 1, len = attr2attrVal[ "$$max.audioSources" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "source" );
      childNode.type = attr2attrVal[ "audioSources" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "audioSources" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_audioTracks = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
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
    for ( i = 1, len = attr2attrVal[ "$$max.audioTracks" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "track" );
      childNode.type = attr2attrVal[ "audioTracks" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "audioTracks" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_audioVolume = function () {
    this.node.volume = this.level.attr2attrVal.audioVolume.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioController = function () {
    this.node.controls = this.level.attr2attrVal.audioController.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioLoop = function () {
    this.node.loop = this.level.attr2attrVal.audioLoop.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioMuted = function () {
    this.node.muted = this.level.attr2attrVal.audioMuted.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioPreload = function () {
    this.node.preload = this.level.attr2attrVal.audioPreload.transitionCalcVal;
  };

  /* Video (<video>) related */

  LAY.Part.prototype.renderFn_videoSrc = function () {
    this.node.src = this.level.attr2attrVal.videoSrc.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_videoSources = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
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
    for ( i = 1, len = attr2attrVal[ "$$max.videoSources" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "source" );
      childNode.type = attr2attrVal[ "videoSources" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "videoSources" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_videoTracks = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
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
    for ( i = 1, len = attr2attrVal[ "$$max.videoTracks" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "track" );
      childNode.type = attr2attrVal[ "videoTracks" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "videoTracks" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_videoAutoplay = function () {
    this.node.autoplay = this.level.attr2attrVal.videoAutoplay.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoController = function () {
    this.node.controls = this.level.attr2attrVal.videoController.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoCrossorigin = function () {
    this.node.crossorigin = this.level.attr2attrVal.videoCrossorigin.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoLoop = function () {
    this.node.loop = this.level.attr2attrVal.videoLoop.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoMuted = function () {
    this.node.muted = this.level.attr2attrVal.videoMuted.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoPreload = function () {
    this.node.preload = this.level.attr2attrVal.videoPreload.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoPoster = function () {
    this.node.poster = this.level.attr2attrVal.videoPoster.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_iframeSrc = function () {
    this.node.src = this.level.attr2attrVal.iframeSrc.transitionCalcVal;
  };


})();
