( function () {
  "use strict";



  var isGpuAccelerated, cssPrefix;


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

  var type2htmlTag = {

    "default": "div",
    canvas: "canvas",
    image: "img",
    video: "video",
    svg: "svg"

  };

  var inputWhichIsAnHtmlTagS = [

  "textarea",
  "select"

  ];



  LAID.Part = function ( level ) {

    this.level = level;

    LAID.dirtyPartS.push( this );

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
      attr2attrValue.scaleX.transitionCalcValue + "," +
      attr2attrValue.scaleY.transitionCalcValue + "," +
      attr2attrValue.scaleZ.transitionCalcValue + ") " +
      "translate3d(" +

      ( ( ( attr2attrValue.left.transitionCalcValue + attr2attrValue.shiftX.transitionCalcValue ) +
      attr2attrValue.width.transitionCalcValue * attr2attrValue.originX.transitionCalcValue )  + "px ," ) +

      ( ( ( attr2attrValue.top.transitionCalcValue + attr2attrValue.shiftY.transitionCalcValue ) +
      attr2attrValue.height.transitionCalcValue * attr2attrValue.originY.transitionCalcValue )  + "px ," ) +

      ( attr2attrValue.Z.transitionCalcValue) + "px) " +
      "skew(" +
      attr2attrValue.skewX.transitionCalcValue + "deg," +
      attr2attrValue.skewY.transitionCalcValue + "deg) " +
      "rotateX(" + attr2attrValue.rotateX.transitionCalcValue + "deg) " +
      "rotateY(" + attr2attrValue.rotateY.transitionCalcValue + "deg) " +
      "rotateZ(" + attr2attrValue.rotateZ.transitionCalcValue + "deg)";
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
      this.node.style.left = ( attr2attrValue.left.transitionCalcValue + attr2attrValue.shiftX.transitionCalcValue ) + "px";
      this.node.style.top = ( attr2attrValue.top.transitionCalcValue + attr2attrValue.shiftY.transitionCalcValue ) + "px";

    };

  }




  LAID.Part.prototype.$renderFn_origin = function () {
    var attr2attrValue = this.level.$attr2attrValue;
    this.node.style[ cssPrefix + "origin" ] =
    ( attr2attrValue.originX.transitionCalcValue * 100 ) + "% " +
    ( attr2attrValue.originY.transitionCalcValue * 100 ) + "% " +
    ( attr2attrValue.originZ.transitionCalcValue * 100 ) + "%";
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


  LAID.Part.prototype.$renderFn_opacity = function () {
    this.node.style.opacity = this.level.$attr2attrValue.opacity.transitionCalcValue;
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
    this.node.style.backgroundColor = convertColorToCss( this.level.$attr2attrValue.backgroundColor.transitionCalcValue.stringify() );
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
    this.node.style.backgroundColor = this.level.$attr2attrValue.backgroundSize.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_backgroundPosition = function () {
    this.node.style.backgroundPosition = this.level.$attr2attrValue.backgroundPosition.transitionCalcValue;
  };

  LAID.Part.prototype.$renderFn_boxShadows = function () {
    var boxShadow, i, numBoxShadows, attr2attrValue;
    attr2attrValue = this.level.$attr2attrValue;
    var s="";
    for ( i = 1; i <= len; i++ ) {
      s +=
      ( attr2attrValue["boxShadow" + i + "Inset" ].transitionCalcValue ? "inset " : "" ) +
      ( attr2attrValue["boxShadow" + i + "X" ].transitionCalcValue + "px " ) +
      ( attr2attrValue["boxShadow" + i + "Y" ].transitionCalcValue + "px " ) +
      ( attr2attrValue["boxShadow" + i + "Blur" ].transitionCalcValue + "px " ) +
      ( ( attr2attrValue["boxShadow" + i + "Spread" ].transitionCalcValue || 0 ) + "px " ) +
      ( attr2attrValue["boxShadow" + i + "Color" ].transitionCalcValue.stringify() );

    }
  };

  LAID.Part.prototype.$renderFn_when = function () {



  };


})();
