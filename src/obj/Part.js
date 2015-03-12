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


  allStyles = document.body.style;


  // check for matrix 3d support
  //if ( ( (cssPrefix + "transform" ) in allStyles ) ) {
    // source: https://gist.github.com/webinista/3626934 (http://tiffanybbrown.com/2012/09/04/testing-for-css-3d-transforms-support/)
    allStyles[ (cssPrefix + "transform" ) ] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
    isGpuAccelerated = Boolean( window.getComputedStyle( document.body, null ).getPropertyValue( ( cssPrefix + "transform" ) ) );
  //}

  //isGpuAccelerated = (  );


  allStyles = undefined;


  defaultCss = "position:absolute;display:block;margin:0;padding:0;" +
  "box-sizing:border-box;-moz-box-sizing:border-box;" +
  "transform-style:preserve-3d;-webkit-transform-style:preserve-3d;" +
  "overflow-x:hidden;overflow-y:hidden;" +
  "-webkit-overflow-scrolling:touch;";

  defaultTextCss = defaultCss + "font-size:16px;" +
  "font-family:sans-serif;color:black;";

  inputType2tag = {
    button: "button",
    multiline: "textarea",
    optgroup: "optgroup",
    option: "option"
  };

  LAID.Part = function ( level ) {

    this.level = level;
    this.node = undefined;

    this.$naturalWidthTextMode = false;
    this.$naturalHeightTextMode = false;

    this.$naturalWidthLevel = undefined;
    this.$naturalHeightLevel = undefined;

    this.$normalRenderDirtyAttrValS = [];
    this.$travelRenderDirtyAttrValS = [];

    this.$whenEventType2fnMainHandler = {};

    this.$absoluteY = undefined;
    this.$absoluteX = undefined;

    this.$isInitiallyRendered = false;

  };


  LAID.Part.prototype.$init = function () {

    var
      levelType = this.level.$lson.$type,
      inputType = this.level.$lson.$inputType,
      inputTypeTag = inputType2tag[ inputType ];

    if ( this.level.path === "/" ) {
      this.node = document.body;
    } else if ( inputType !== undefined ) {
      if ( inputTypeTag !== undefined ) {
        this.node = document.createElement( inputTypeTag );
      } else {
        this.node = document.createElement( "input" );
        this.node.type = inputType;
      }
    } else {
      this.node = document.createElement( ( ( levelType === "none" ) ||
       ( levelType === "text" ) ) ? "div" :
        ( levelType === "image" ?
         "img" : levelType ) );
    }
    this.node.style.cssText = ( levelType === "text" ) ? defaultTextCss : defaultCss;

    if ( this.level.$lson.$interface ) {
      this.node.style.visibility = "hidden";
    }
  };


  /*
  * Additional constraint of not being dependent upon
  * parent for the attr
  */
  LAID.Part.prototype.$findChildWithMaxOfAttr =
   function ( attr, attrValIndependentOf, attrChildIndepedentOf ) {
    var
       curMaxVal, curMaxLevel,
       childLevel, childLevelAttrVal,
       attrValChildIndepedentOf;
    for ( var i = 0,
         childLevelS = this.level.$childLevelS,
        len = childLevelS.length;
         i < len; i++ ) {
      childLevel = childLevelS[ i ];
      childLevelAttrVal = childLevel.$attr2attrVal[ attr ];
      attrValChildIndepedentOf =
        childLevel.$attr2attrVal[ attrChildIndepedentOf ];

      if (
          ( childLevelAttrVal !== undefined ) &&
          ( childLevelAttrVal.calcVal || (childLevelAttrVal.calcVal === 0 ) ) &&
          (  ( !attrValChildIndepedentOf ) ||
            ( !attrValChildIndepedentOf.checkIsDependentOnAttrVal(
               attrValIndependentOf )  ) ) ) {

        if ( curMaxLevel === undefined ) {
          curMaxLevel = childLevel;
          curMaxVal = childLevelAttrVal.calcVal;
        } else if ( childLevelAttrVal.calcVal > curMaxVal ) {
          curMaxLevel = childLevel;
        }
      }
    }
    return curMaxLevel;
  };

  LAID.Part.prototype.$updateAbsoluteX = function () {

    var 
      attr2attrVal = this.level.$attr2attrVal,
      relativeLeft = attr2attrVal.left.calcVal,
      shiftX = attr2attrVal.shiftX ? attr2attrVal.shiftX.calcVal : 0,
      parentAbsoluteX = this.level.path !== "/" ? 
        this.level.parentLevel.part.$absoluteX : 0,
      absoluteX = relativeLeft + shiftX + parentAbsoluteX;

    if ( typeof absoluteX === "number" ) {
      this.$absoluteX = absoluteX;
      if ( attr2attrVal.$absoluteX ) {
        attr2attrVal.$absoluteX.update( this.$absoluteX );
      }
      for ( var i = 0, childLevelS = this.level.$childLevelS,
         len = childLevelS.length; i < len; i++ ) {
        childLevelS[ i ].part.$updateAbsoluteX();
      }
    }
  };

  LAID.Part.prototype.$updateAbsoluteY = function () {

    var 
      attr2attrVal = this.level.$attr2attrVal,
      relativeTop = attr2attrVal.top.calcVal,
      shiftY = attr2attrVal.shiftY ? attr2attrVal.shiftY.calcVal : 0,
      parentAbsoluteY = this.level.path !== "/" ?
        this.level.parentLevel.part.$absoluteY : 0,
      absoluteY = relativeTop + shiftY + parentAbsoluteY;

    if ( typeof absoluteY === "number" ) {
      this.$absoluteY = absoluteY;
      if ( attr2attrVal.$absoluteY ) {
        attr2attrVal.$absoluteY.update( this.$absoluteY );
      }
      for ( var i = 0, childLevelS = this.level.$childLevelS,
         len = childLevelS.length; i < len; i++ ) {
        childLevelS[ i ].part.$updateAbsoluteY();
      }
    }
  };

  LAID.Part.prototype.$updateNaturalWidth = function () {
    var attr2attrVal = this.level.$attr2attrVal
    if ( this.level.path === "/" ) {
      attr2attrVal.$naturalWidth.update( window.innerWidth );

    } else if ( this.level.$lson.$type === "text" ) {
      this.$updateNaturalWidthFromText();
    } else {
      this.$naturalWidthLevel = this.$findChildWithMaxOfAttr( "right",
      attr2attrVal.$naturalWidth, "width" );
      attr2attrVal.$naturalWidth.update(
          this.$naturalWidthLevel ?
         ( this.$naturalWidthLevel.$attr2attrVal.right.calcVal || 0 ) :
         0
      );
    }
  };

  LAID.Part.prototype.$updateNaturalHeight = function () {
    var attr2attrVal = this.level.$attr2attrVal
    if ( this.level.path === "/" ) {
      attr2attrVal.$naturalHeight.update( window.innerHeight );
    } else if ( this.level.$lson.$type === "text" ) {
      this.$updateNaturalHeightFromText();
    } else {
      this.$naturalHeightLevel = this.$findChildWithMaxOfAttr( "bottom",
      attr2attrVal.$naturalHeight, "height");

      attr2attrVal.$naturalHeight.update(
          this.$naturalHeightLevel ?
         ( this.$naturalHeightLevel.$attr2attrVal.bottom.calcVal || 0 ) :
         0
      );
    }
  };



  LAID.Part.prototype.$updateNaturalWidthFromChild = function ( childLevel ) {

    var attr2attrVal = this.level.$attr2attrVal;

    if ( attr2attrVal.$naturalWidth &&
      ( this.level.path !== "/" ) &&
      ! LAID.$checkIsValidUtils.nan( childLevel.$attr2attrVal.right.calcVal ) &&
      ! childLevel.$attr2attrVal.width.checkIsDependentOnAttrVal(
        attr2attrVal.$naturalWidth)
      ) {

      if ( this.$naturalWidthLevel === undefined ) {
        this.$naturalWidthLevel = childLevel;
      } else if ( this.$naturalWidthLevel === childLevel ) {

        // Check If the current child level responsible for the stretch
        // of the naturalWidth boundary, has receeded
        // If this would be the case, then there is
        // a possibility that it has receded behind another
        // child element which has a higher right position
        // than the current child level responsible for the natural width
        if ( attr2attrVal.$naturalWidth.calcVal >
           childLevel.$attr2attrVal.right.calcVal  ) {
          // Find the child with the next largest right
          // This could be the same child level
          this.$naturalWidthLevel = this.$findChildWithMaxOfAttr( "right",
          attr2attrVal.$naturalWidth, "width");
        }
      } else {
        if ( childLevel.$attr2attrVal.right.calcVal >
          this.$naturalWidthLevel.$attr2attrVal.right.calcVal ) {
            this.$naturalWidthLevel = childLevel;
        }
      }
      attr2attrVal.$naturalWidth.update(
        this.$naturalWidthLevel ?
        ( this.$naturalWidthLevel.$attr2attrVal.right.calcVal || 0 ) :
        0
      );

    }
  };


  LAID.Part.prototype.$updateNaturalHeightFromChild = function ( childLevel ) {

    var attr2attrVal = this.level.$attr2attrVal;

    if ( attr2attrVal.$naturalHeight &&
        ( this.level.path !== "/" ) &&
       !LAID.$checkIsValidUtils.nan( childLevel.$attr2attrVal.bottom.calcVal ) &&
       !( childLevel.$attr2attrVal.height.checkIsDependentOnAttrVal(
         attr2attrVal.$naturalHeight) )
       ) {

      if ( this.$naturalHeightLevel === undefined ) {
        this.$naturalHeightLevel = childLevel;
      } else if ( this.$naturalHeightLevel === childLevel ) {
        // Check If the current child level responsible for the stretch
          // of the naturalHeight boundary, has receeded
          // If this would be the case, then there is
          // a possibility that it has receded behind another
          // child element which has a higher bottom position
          // than the current child level responsible for the natural height
         if ( attr2attrVal.$naturalHeight.calcVal >
           childLevel.$attr2attrVal.bottom.calcVal  ) {
          // Find the child with the next largest bottom
          // This could be the same child level
          this.$naturalHeightLevel = this.$findChildWithMaxOfAttr( "bottom",
          attr2attrVal.$naturalHeight, "height");
        }
      } else {
        if ( childLevel.$attr2attrVal.bottom.calcVal >
          this.$naturalHeightLevel.$attr2attrVal.bottom.calcVal ) {
            this.$naturalHeightLevel = childLevel;
          }
        }


      attr2attrVal.$naturalHeight.update(
          this.$naturalHeightLevel ?
          ( this.$naturalHeightLevel.$attr2attrVal.bottom.calcVal || 0 ) :
          0
      );
    }
  };

  LAID.Part.prototype.$updateNaturalWidthFromText = function () {

    var attr2attrVal = this.level.$attr2attrVal;

    if ( attr2attrVal.$naturalWidth ) {

        this.$naturalWidthTextMode = true;
        this.$addNormalRenderDirtyAttrVal( attr2attrVal.text );

        if ( attr2attrVal.scrollX !== undefined ) {
          this.$addNormalRenderDirtyAttrVal( attr2attrVal.scrollX );
        }
        // temporarily (for current recalculate) cycle
        // set the value to 0. This is only
        // as a render cycle is required for learning
        // the natural width
        attr2attrVal.$naturalWidth.update( 0 );

    }
  };

  LAID.Part.prototype.$updateNaturalHeightFromText = function () {

    var attr2attrVal = this.level.$attr2attrVal;

    if ( attr2attrVal.$naturalHeight) {
      this.$naturalHeightTextMode = true;
      this.$addNormalRenderDirtyAttrVal( attr2attrVal.text );

      if ( attr2attrVal.scrollY !== undefined ) {
        this.$addNormalRenderDirtyAttrVal( attr2attrVal.scrollY );
      }
      // temporarily (for current recalculate) cycle
      // set the value to 0. This is only
      // as a render cycle is required for learning
      // the natural height
      attr2attrVal.$naturalHeight.update( 0 );

    }
  };

  LAID.Part.prototype.$addNormalRenderDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.remove( this.$travelRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( this.$normalRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$renderDirtyPartS, this );

  };

  LAID.Part.prototype.$addTravelRenderDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.remove( this.$normalRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( this.$travelRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$renderDirtyPartS, this );

  };

  LAID.Part.prototype.$updateWhenEventType = function ( eventType ) {

    var
      numFnHandlersForEventType =
        this.level.$attr2attrVal[ "$$num.when." + eventType ].val,
      fnMainHandler,
      thisLevel = this.level;

    if ( this.$whenEventType2fnMainHandler[ eventType ] !== undefined ) {
      LAID.$eventUtils.remove( 
        this.node, eventType,
          this.$whenEventType2fnMainHandler[ eventType ] );
    }

    if ( numFnHandlersForEventType !== 0 ) {

      fnMainHandler = function ( e ) {
        var i, len, attrValForFnHandler;
        for ( i = 0; i < numFnHandlersForEventType; i++ ) {
          attrValForFnHandler =
          thisLevel.$attr2attrVal[ "when." + eventType + "." + ( i + 1 ) ];
          if ( attrValForFnHandler !== undefined ) {
            attrValForFnHandler.calcVal.call( thisLevel, e );
          }
        }
      };
      LAID.$eventUtils.add( this.node, eventType, fnMainHandler );
      this.$whenEventType2fnMainHandler[ eventType ] = fnMainHandler;

    } else {
      this.$whenEventType2fnMainHandler[ eventType ] = undefined;

    }
  };

  LAID.Part.prototype.$checkIsPropInTransition = function ( prop ) {
    return ( this.level.$attr2attrVal[ "transition." + prop  + ".type" ] !==
      undefined )  ||
      ( this.level.$attr2attrVal[ "transition." + prop  + ".delay" ] !==
        undefined );
  };

  LAID.Part.prototype.$updateTransitionProp = function ( transitionProp ) {


    if ( this.$isInitiallyRendered ) {

      var
        attr2attrVal = this.level.$attr2attrVal,
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

      if ( !this.$checkIsPropInTransition( transitionProp ) ) {
        if ( this.$checkIsPropInTransition( "all" ) ) {
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
      transitionArgS = LAID.$transitionType2args[ transitionType ] ?
        LAID.$transitionType2args[ transitionType ] : [];


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
              !this.$checkIsPropInTransition( attrVal.attr ) ) {
            this.$updateTransitionAttrVal(
              attrVal,
               transitionType, transitionDelay, transitionDuration,
               transitionArg2val, transitionDone
             );

          }
        }
      } else {

        this.$updateTransitionAttrVal(
           attr2attrVal[ allAffectedProp || transitionProp ],
           transitionType, transitionDelay, transitionDuration,
           transitionArg2val, transitionDone
         );

      }
    }
  };

  LAID.Part.prototype.$updateTransitionAttrVal = function ( attrVal,
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

      attrVal.transition = new LAID.Transition (
          transitionType,
          transitionDelay ,
          transitionDuration, transitionArg2val,
          transitionDone );
    } else if ( attrVal !== undefined ) { // else delete the transition

      attrVal.transition = undefined;
    }
  }


  // Below we will customize prototypical functions
  // using conditionals. As per the results from
  // http://jsperf.com/foreign-function-within-prototype-chain
  // http://jsperf.com/dynamic-modification-of-prototype-chain
  // this will make no difference

  // The renderable prop can be accessed via `part.$renderFn_<prop>`


  if ( isGpuAccelerated ) {


    LAID.Part.prototype.$renderFn_positional =   // TODO: optimize to enter matrix3d directly
    function () {
      var attr2attrVal = this.level.$attr2attrVal;
      cssPrefix = cssPrefix === "-moz-" ? "" : cssPrefix;
      this.node.style[ cssPrefix + "transform" ] =
      "scale3d(" +
      ( attr2attrVal.scaleX !== undefined ? attr2attrVal.scaleX.transitionCalcVal : 1 ) + "," +
      ( attr2attrVal.scaleY !== undefined ? attr2attrVal.scaleY.transitionCalcVal : 1 ) + "," +
      ( attr2attrVal.scaleZ !== undefined ? attr2attrVal.scaleZ.transitionCalcVal : 1 ) + ") " +
      "translate3d(" +
      
      ( ( attr2attrVal.left.transitionCalcVal + ( attr2attrVal.shiftX !== undefined ? attr2attrVal.shiftX.transitionCalcVal : 0 ) ) + "px, " ) +
      //attr2attrVal.width.transitionCalcVal * ( attr2attrVal.originX !== undefined ? attr2attrVal.originX.transitionCalcVal : 0.5 ) )  + "px ," ) +

      ( ( attr2attrVal.top.transitionCalcVal + ( attr2attrVal.shiftY !== undefined ? attr2attrVal.shiftY.transitionCalcVal : 0 ) ) + "px, " ) +
      //attr2attrVal.height.transitionCalcVal * ( attr2attrVal.originY !== undefined ? attr2attrVal.originY.transitionCalcVal : 0.5 ) )  + "px ," ) +

      ( attr2attrVal.z ? attr2attrVal.z.transitionCalcVal : 0 )  + "px) " +
      "skew(" +
      ( attr2attrVal.skewX !== undefined ? attr2attrVal.skewX.transitionCalcVal : 0 ) + "deg," +
      ( attr2attrVal.skewY !== undefined ? attr2attrVal.skewY.transitionCalcVal : 0 ) + "deg) " +
      "rotateX(" + ( attr2attrVal.rotateX !== undefined ? attr2attrVal.rotateX.transitionCalcVal : 0 ) + "deg) " +
      "rotateY(" + ( attr2attrVal.rotateY !== undefined ? attr2attrVal.rotateY.transitionCalcVal : 0 ) + "deg) " +
      "rotateZ(" + ( attr2attrVal.rotateZ !== undefined ? attr2attrVal.rotateZ.transitionCalcVal : 0 ) + "deg)";

    };

    LAID.Part.prototype.$renderFn_width = function () {
      this.node.style.width = this.level.$attr2attrVal.width.transitionCalcVal + "px";
      //this.$renderFn_positional(); //apply change to transform
    };

    LAID.Part.prototype.$renderFn_height = function () {
      this.node.style.height = this.level.$attr2attrVal.height.transitionCalcVal + "px";
      //this.$renderFn_positional(); //apply change to transform
    };



  } else {
    // legacy browser usage or forced non-gpu mode

    LAID.Part.prototype.$renderFn_width = function () {
      this.node.style.width = this.level.$attr2attrVal.width.transitionCalcVal + "px";
    };

    LAID.Part.prototype.$renderFn_height = function () {
      this.node.style.height = this.level.$attr2attrVal.height.transitionCalcVal + "px";
    };

    LAID.Part.prototype.$renderFn_positional = function () {
      var attr2attrVal = this.level.$attr2attrVal;
      this.node.style.left = ( attr2attrVal.left.transitionCalcVal + ( attr2attrVal.shiftX !== undefined ? attr2attrVal.shiftX.transitionCalcVal : 0 ) ) + "px";
      this.node.style.top = ( attr2attrVal.top.transitionCalcVal + ( attr2attrVal.shiftY !== undefined ? attr2attrVal.shiftY.transitionCalcVal : 0 ) ) + "px";

    };

  }




  LAID.Part.prototype.$renderFn_origin = function () {
    var attr2attrVal = this.level.$attr2attrVal;

      console.log("origin!", ( ( attr2attrVal.originX !== undefined ? attr2attrVal.originX.transitionCalcVal : 0.5 ) * 100 ) + "% " +
      ( ( attr2attrVal.originY !== undefined ? attr2attrVal.originY.transitionCalcVal : 0.5 ) * 100 ) + "% " +
      ( ( attr2attrVal.originZ !== undefined ? attr2attrVal.originZ.transitionCalcVal : 0.5 ) * 100 ) + "%");
    this.node.style[ cssPrefix + "transform-origin" ] =
    ( ( attr2attrVal.originX !== undefined ? attr2attrVal.originX.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrVal.originY !== undefined ? attr2attrVal.originY.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( attr2attrVal.originZ !== undefined ? attr2attrVal.originZ.transitionCalcVal : 0  ) + "px";
    //this.$renderFn_positional(); //apply change to transform
  };


  LAID.Part.prototype.$renderFn_perspective = function () {
    this.node.style[ cssPrefix + "perspective" ] = this.level.$attr2attrVal.perspective.transitionCalcVal + "px";
  };

  LAID.Part.prototype.$renderFn_perspectiveOrigin = function () {
    var attr2attrVal = this.level.$attr2attrVal;
    this.node.style[ cssPrefix + "perspective-origin" ] =
    ( attr2attrVal.perspectiveOriginX.transitionCalcVal * 100 ) + "% " +
    ( attr2attrVal.perspectiveOriginY.transitionCalcVal * 100 ) + "%";
  };

  LAID.Part.prototype.$renderFn_backfaceVisibility = function () {
    this.node.style[ cssPrefix + "backface-visibility" ] = this.level.$attr2attrVal.perspective.transitionCalcVal;
  };


  LAID.Part.prototype.$renderFn_opacity = function () {
    this.node.style.opacity = this.level.$attr2attrVal.opacity.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_userSelect = function () {
    this.node.style[ cssPrefix + "user-select" ] = 
      this.level.$attr2attrVal.userSelect.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_display = function () {
    this.node.style.display = this.level.$attr2attrVal.display ?
    "block" : "none";
  };

  LAID.Part.prototype.$renderFn_zIndex = function () {

    this.node.style.zIndex =
      this.level.$attr2attrVal.zIndex.transitionCalcVal || "auto";
  };


  LAID.Part.prototype.$renderFn_scrollX = function () {
    this.node.scrollLeft = this.level.$attr2attrVal.scrollX.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_scrollY = function () {
    this.node.scrollTop = this.level.$attr2attrVal.scrollY.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_overflowX = function () {
    this.node.style.overflowX = this.level.$attr2attrVal.overflowX.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_overflowY = function () {
    this.node.style.overflowY = this.level.$attr2attrVal.overflowY.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_cursor = function () {
    this.node.style.cursor = this.level.$attr2attrVal.cursor.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_backgroundColor = function () {
    this.node.style.backgroundColor = this.level.$attr2attrVal.backgroundColor.transitionCalcVal.stringify();
  };

  LAID.Part.prototype.$renderFn_backgroundImage = function () {
    this.node.style.backgroundImage = this.level.$attr2attrVal.backgroundImage.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_backgroundAttachment = function () {
    this.node.style.backgroundAttachment = this.level.$attr2attrVal.backgroundAttachment.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_backgroundRepeat = function () {
    this.node.style.backgroundRepeat = this.level.$attr2attrVal.backgroundColor.transitionCalcVal;
  };

  LAID.Part.prototype.$renderFn_backgroundSize = function () {
    var backgroundSizeX = this.level.$attr2attrVal.backgroundSizeX,
    backgroundSizeY = this.level.$attr2attrVal.backgroundSizeY;

    this.node.style.backgroundSize =
    (  ( backgroundSizeX !== undefined &&
       backgroundSizeX.transitionCalcVal !== undefined ) ?
        backgroundSizeX.transitionCalcVal + "px " : "auto " ) +
    (  ( backgroundSizeY !== undefined &&
      backgroundSizeY.transitionCalcVal !== undefined ) ?
       backgroundSizeY.transitionCalcVal + "px" : "auto" );

  };

  LAID.Part.prototype.$renderFn_backgroundPosition = function () {
    this.node.style.backgroundPosition =
    ( this.level.$attr2attrVal.backgroundPositionX !== undefined ?
       this.level.$attr2attrVal.backgroundPositionX.transitionCalcVal : 0 ) +
    "px " +
    ( this.level.$attr2attrVal.backgroundPositionY !== undefined ?
       this.level.$attr2attrVal.backgroundPositionY.transitionCalcVal : 0 ) +
    "px" ;
  };

  LAID.Part.prototype.$renderFn_boxShadows = function () {
    var
    attr2attrVal = this.level.$attr2attrVal,
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
  };



  LAID.Part.prototype.$renderFn_filters = function () {
    var
    attr2attrVal = this.level.$attr2attrVal,
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
          s += filterType + "(" + ( attr2attrVal[ "filters" + i + LAID.$capitalize( filterType ) ] * 100 ) + "%) ";

      }
    }
    this.node.style[ cssPrefix + "filter" ] = s;

  };

  LAID.Part.prototype.$renderFn_cornerRadiusTopLeft = function () {
    this.node.style.borderTopLeftRadius = this.level.$attr2attrVal.cornerRadiusTopLeft.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_cornerRadiusTopRight = function () {
    this.node.style.borderTopRightRadius = this.level.$attr2attrVal.cornerRadiusTopRight.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_cornerRadiusBottomRight = function () {
    this.node.style.borderBottomRightRadius = this.level.$attr2attrVal.cornerRadiusBottomRight.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_cornerRadiusBottomLeft = function () {
    this.node.style.borderBottomLeftRadius = this.level.$attr2attrVal.cornerRadiusBottomLeft.transitionCalcVal + "px";
  };



  LAID.Part.prototype.$renderFn_borderTopStyle = function () {
    this.node.style.borderTopStyle = this.level.$attr2attrVal.borderTopStyle.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_borderRightStyle = function () {
    this.node.style.borderRightStyle = this.level.$attr2attrVal.borderRightStyle.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_borderBottomStyle = function () {
    this.node.style.borderBottomStyle = this.level.$attr2attrVal.borderBottomStyle.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_borderLeftStyle = function () {
    this.node.style.borderLeftStyle = this.level.$attr2attrVal.borderLeftStyle.transitionCalcVal;
  };


  LAID.Part.prototype.$renderFn_borderTopColor = function () {
    this.node.style.borderTopColor = this.level.$attr2attrVal.borderTopColor.transitionCalcVal.stringify();
  };
  LAID.Part.prototype.$renderFn_borderRightColor = function () {
    this.node.style.borderRightColor = this.level.$attr2attrVal.borderRightColor.transitionCalcVal.stringify();
  };
  LAID.Part.prototype.$renderFn_borderBottomColor = function () {
    this.node.style.borderBottomColor = this.level.$attr2attrVal.borderBottomColor.transitionCalcVal.stringify();
  };
  LAID.Part.prototype.$renderFn_borderLeftColor = function () {
    this.node.style.borderLeftColor = this.level.$attr2attrVal.borderLeftColor.transitionCalcVal.stringify();
  };

  LAID.Part.prototype.$renderFn_borderTopWidth = function () {
    this.node.style.borderTopWidth = this.level.$attr2attrVal.borderTopWidth.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_borderRightWidth = function () {
    this.node.style.borderRightWidth = this.level.$attr2attrVal.borderRightWidth.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_borderBottomWidth = function () {
    this.node.style.borderBottomWidth = this.level.$attr2attrVal.borderBottomWidth.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_borderLeftWidth = function () {
    this.node.style.borderLeftWidth = this.level.$attr2attrVal.borderLeftWidth.transitionCalcVal + "px";
  };



  /* Text Related */

  LAID.Part.prototype.$renderFn_text = function () {
    if ( this.$naturalWidthTextMode ) {
      this.node.style.display = "inline";
      this.node.style.width = "auto";
      this.node.innerHTML = this.level.$attr2attrVal.text.transitionCalcVal;

      this.level.$changeAttrVal( "$naturalWidth", this.node.getBoundingClientRect().width );
      this.node.style.display = "block";
      this.$naturalWidthTextMode = false;
    }
    if ( this.$naturalHeightTextMode ) {
      this.node.style.height = "auto";
      this.node.innerHTML = this.level.$attr2attrVal.text.transitionCalcVal;

      this.level.$changeAttrVal( "$naturalHeight", this.node.getBoundingClientRect().height );
      this.$naturalHeightTextMode = false;
    }

    this.node.innerHTML = this.level.$attr2attrVal.text.transitionCalcVal;

  };

  LAID.Part.prototype.$renderFn_textSize = function () {
    this.node.style.fontSize = this.level.$attr2attrVal.textSize.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_textFamily = function () {
    this.node.style.fontFamily = this.level.$attr2attrVal.textFamily.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textWeight = function () {

    this.node.style.fontWeight = this.level.$attr2attrVal.textWeight.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textColor = function () {
    this.node.style.color = this.level.$attr2attrVal.textColor.transitionCalcVal.stringify();
  };


  LAID.Part.prototype.$renderFn_textShadows = function () {
    var
    attr2attrVal = this.level.$attr2attrVal,
    s = "",
    i, len;
    for ( i = 1, len = attr2attrVal[ "$$max.textShadows" ].calcVal; i <= len; i++ ) {
      s +=
      (  attr2attrVal["textShadow" + i + "Color" ].transitionCalcVal.stringify() ) + " " +
      ( attr2attrVal["textShadows" + i + "X" ].transitionCalcVal + "px " ) +
      ( attr2attrVal["textShadows" + i + "Y" ].transitionCalcVal + "px " ) +
      ( attr2attrVal["textShadows" + i + "Blur" ].transitionCalcVal  + "px" );

      if ( i !== len ) {
        s += ",";
      }

    }
    this.node.style.textShadow = s;
  };

  LAID.Part.prototype.$renderFn_textVariant = function () {
    this.node.style.fontVariant = this.level.$attr2attrVal.textVariant.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textStyle = function () {
    this.node.style.fontStyle = this.level.$attr2attrVal.textStyle.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textDecoration = function () {
    this.node.style.textDecoration = this.level.$attr2attrVal.textDecoration.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textAlign = function () {
    this.node.style.textAlign = this.level.$attr2attrVal.textAlign.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textLetterSpacing = function () {
    var textLetterSpacing = this.level.$attr2attrVal.textLetterSpacing;
    this.node.style.letterSpacing = textLetterSpacing !== undefined && textLetterSpacing.transitionCalcVal !== undefined ?
      textLetterSpacing.transitionCalcVal + "px" : "normal";
  };
  LAID.Part.prototype.$renderFn_textWordSpacing = function () {
    var textWordSpacing = this.level.$attr2attrVal.textWordSpacing;
    this.node.style.WordSpacing = textWordSpacing !== undefined && textWordSpacing.transitionCalcVal !== undefined ?
    textWordSpacing.transitionCalcVal + "px" : "normal";
  };
  LAID.Part.prototype.$renderFn_textOverflow = function () {
    this.node.style.textOverflow = this.level.$attr2attrVal.textOverflow.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textIndent = function () {
    this.node.style.textIndent = this.level.$attr2attrVal.textIndent.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_textWhitespace = function () {
    this.node.style.whitespace = this.level.$attr2attrVal.textWhitespace.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_textPaddingTop = function () {
    this.node.style.paddingTop = this.level.$attr2attrVal.textPaddingTop.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_textPaddingRight = function () {
    this.node.style.paddingRight = this.level.$attr2attrVal.textPaddingRight.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_textPaddingBottom = function () {
    this.node.style.paddingBottom = this.level.$attr2attrVal.textPaddingBottom.transitionCalcVal + "px";
  };
  LAID.Part.prototype.$renderFn_textPaddingLeft = function () {
    this.node.style.paddingLeft = this.level.$attr2attrVal.textPaddingLeft.transitionCalcVal + "px";
  };


  /* Non <div> */

  /* Input (<input/> and <textarea>) Related */

  LAID.Part.prototype.$renderFn_inputLabel = function () {
    this.node.label = this.level.$attr2attrVal.inputLabel.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_inputRows = function () {
    this.node.rows = this.level.$attr2attrVal.inputRows.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_input = function () {
    this.node.value = this.level.$attr2attrVal.input.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_inputPlaceholder = function () {
    this.node.placeholder = this.level.$attr2attrVal.inputPlaceholder.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_inputAutocomplete = function () {
    this.node.autocomplete = this.level.$attr2attrVal.inputAutocomplete.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_inputAutocorrect = function () {
    this.node.autocorrect = this.level.$attr2attrVal.inputAutocorrect.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_inputDisabled = function () {
    this.node.disabled = this.level.$attr2attrVal.inputDisabled.transitionCalcVal;
  };


  /* Link (<a>) Related */

  LAID.Part.prototype.$renderFn_linkHref = function () {
    this.node.href = this.level.$attr2attrVal.linkHref.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_linkRel = function () {
    this.node.rel = this.level.$attr2attrVal.linkRel.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_linkDownload = function () {
    this.node.download = this.level.$attr2attrVal.linkDownload.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_linkTarget = function () {
    this.node.target = this.level.$attr2attrVal.linkTarget.transitionCalcVal;
  };


  /* Image (<img>) related */
  LAID.Part.prototype.$renderFn_imageUrl = function () {
    this.node.src = this.level.$attr2attrVal.imageUrl.transitionCalcVal;
  };

  /* Audio (<audio>) related */
  LAID.Part.prototype.$renderFn_audioSources = function () {
    var
    attr2attrVal = this.level.$attr2attrVal,
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

  LAID.Part.prototype.$renderFn_audioTracks = function () {
    var
    attr2attrVal = this.level.$attr2attrVal,
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

  LAID.Part.prototype.$renderFn_audioVolume = function () {
    this.node.volume = this.level.$attr2attrVal.audioVolume.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_audioControls = function () {
    this.node.controls = this.level.$attr2attrVal.audioControls.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_audioLoop = function () {
    this.node.loop = this.level.$attr2attrVal.audioLoop.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_audioMuted = function () {
    this.node.muted = this.level.$attr2attrVal.audioMuted.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_audioPreload = function () {
    this.node.preload = this.level.$attr2attrVal.audioPreload.transitionCalcVal;
  };

  /* Video (<video>) related */
  LAID.Part.prototype.$renderFn_videoSources = function () {
    var
    attr2attrVal = this.level.$attr2attrVal,
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

  LAID.Part.prototype.$renderFn_videoTracks = function () {
    var
    attr2attrVal = this.level.$attr2attrVal,
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

  LAID.Part.prototype.$renderFn_videoAutoplay = function () {
    this.node.autoplay = this.level.$attr2attrVal.videoAutoplay.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_videoControls = function () {
    this.node.controls = this.level.$attr2attrVal.videoControls.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_videoCrossorigin = function () {
    this.node.crossorigin = this.level.$attr2attrVal.videoCrossorigin.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_videoLoop = function () {
    this.node.loop = this.level.$attr2attrVal.videoLoop.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_videoMuted = function () {
    this.node.muted = this.level.$attr2attrVal.videoMuted.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_videoPreload = function () {
    this.node.preload = this.level.$attr2attrVal.videoPreload.transitionCalcVal;
  };
  LAID.Part.prototype.$renderFn_videoPoster = function () {
    this.node.poster = this.level.$attr2attrVal.videoPoster.transitionCalcVal;
  };



})();
