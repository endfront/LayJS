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
    isGpuAccelerated = window.getComputedStyle( document.body, null ).getPropertyValue( ( cssPrefix + "transform" ) );
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



  LSON.Part = function ( level ) {

    this.level = level;

    LSON.dirtyPartS.push( this );

  };

  function convertColorToCss ( lsonColor ) {

  }

  // Below we will customize prototypical functions
  // using conditionals. As per the results from
  // http://jsperf.com/foreign-function-within-prototype-chain
  // http://jsperf.com/dynamic-modification-of-prototype-chain
  // this will make no difference

  // The renderable prop can be accessed via `part.$renderFn_<prop>`

  // TODO: optimize to enter matrix3d directly
  function renderPositionGpu() {
    /* jshint ignore:start */
    var attr2attrValue = this.level.$attr2attrValue;

    this.node.style[ cssPrefix + "transform" ] =
    "scale3d(" +
    attr2attrValue.scaleX.curCalcValue + "," +
    attr2attrValue.scaleY.curCalcValue + "," +
    attr2attrValue.scaleZ.curCalcValue + ") " +
    "translate3d(" +

    ( ( ( attr2attrValue.left.curCalcValue + attr2attrValue.shiftX.curCalcValue ) +
     attr2attrValue.width.curCalcValue * attr2attrValue.originX.curCalcValue )  + "px ," ) +

     ( ( ( attr2attrValue.top.curCalcValue + attr2attrValue.shiftY.curCalcValue ) +
     attr2attrValue.height.curCalcValue * attr2attrValue.originY.curCalcValue )  + "px ," ) +

    ( attr2attrValue.Z.curCalcValue) + "px) " +
    "skew(" +
    attr2attrValue.skewX.curCalcValue + "deg," +
    attr2attrValue.skewY.curCalcValue + "deg) " +
    "rotateX(" + attr2attrValue.rotateX.curCalcValue + "deg) " +
    "rotateY(" + attr2attrValue.rotateY.curCalcValue + "deg) " +
    "rotateZ(" + attr2attrValue.rotateZ.curCalcValue + "deg)";
    /* jshint ignore:end */
  }

  function renderPositionNonGpuX() {
    /* jshint ignore:start */
    var attr2attrValue = this.level.$attr2attrValue;
    this.node.style.left = ( attr2attrValue.left.curCalcValue + attr2attrValue.shiftX.curCalcValue ) + "px";
    /* jshint ignore:end */
  }

  function renderPositionNonGpuY() {
    /* jshint ignore:start */
    var attr2attrValue = this.level.$attr2attrValue;
    this.node.style.top = ( attr2attrValue.top.curCalcValue + attr2attrValue.shiftY.curCalcValue ) + "px";
    /* jshint ignore:end */
  }
  function renderOrigin() {
    /* jshint ignore:start */
    var attr2attrValue = this.level.$attr2attrValue;
    this.node.style[ cssPrefix + "origin" ] =
    attr2attrValue.originX.curCalcValue + "% " +
    attr2attrValue.originY.curCalcValue + "% " +
    attr2attrValue.originZ.curCalcValue + "%";
    this.$renderFn_left(); //apply change to transform
    /* jshint ignore:end */
  }

  function renderPerspectiveOrigin() {
    /* jshint ignore:start */
    var attr2attrValue = this.level.$attr2attrValue;
    this.node.style[ cssPrefix + "perspective-origin" ] =
    attr2attrValue.perspectiveOriginX.curCalcValue + "% " +
    attr2attrValue.perspectiveOriginY.curCalcValue + "%";
    /* jshint ignore:end */
  }

  if ( isGpuAccelerated ) {
    LSON.Part.prototype.$renderFn_left = renderPositionGpu;
    LSON.Part.prototype.$renderFn_top = renderPositionGpu;
    LSON.Part.prototype.$renderFn_shiftX = renderPositionGpu;
    LSON.Part.prototype.$renderFn_shiftY = renderPositionGpu;
    LSON.Part.prototype.$renderFn_z = renderPositionGpu;
    LSON.Part.prototype.$renderFn_skewX = renderPositionGpu;
    LSON.Part.prototype.$renderFn_skewY = renderPositionGpu;
    LSON.Part.prototype.$renderFn_rotateX = renderPositionGpu;
    LSON.Part.prototype.$renderFn_rotateY = renderPositionGpu;
    LSON.Part.prototype.$renderFn_rotateZ = renderPositionGpu;
    LSON.Part.prototype.$renderFn_scaleX = renderPositionGpu;
    LSON.Part.prototype.$renderFn_scaleY = renderPositionGpu;
    LSON.Part.prototype.$renderFn_scaleZ = renderPositionGpu;

    LSON.Part.prototype.$renderFn_originX = renderOrigin;
    LSON.Part.prototype.$renderFn_originY = renderOrigin;
    LSON.Part.prototype.$renderFn_originZ = renderOrigin;

    LSON.Part.prototype.$renderFn_perspectiveOriginX = renderPerspectiveOrigin;
    LSON.Part.prototype.$renderFn_perspectiveOriginY = renderPerspectiveOrigin;
    LSON.Part.prototype.$renderFn_perspective = function () {
      this.node.style[ cssPrefix + "perspective" ] = this.level.$attr2attrValue.perspective.curCalcValue + "px";
    };

    LSON.Part.prototype.$renderFn_width = function () {
      this.node.style.width = this.level.$attr2attrValue.width.curCalcValue + "px";
      this.$renderFn_left(); //apply change to transform
    };

    LSON.Part.prototype.$renderFn_height = function () {
      this.node.style.height = this.level.$attr2attrValue.height.curCalcValue + "px";
      this.$renderFn_left(); //apply change to transform
    };


  } else {
    LSON.Part.prototype.$renderFn_left = renderPositionNonGpuX;
    LSON.Part.prototype.$renderFn_top = renderPositionNonGpuY;
    LSON.Part.prototype.$renderFn_shiftX = renderPositionNonGpuX;
    LSON.Part.prototype.$renderFn_shiftY = renderPositionNonGpuY;

    LSON.Part.prototype.$renderFn_width = function () {
      this.node.style.width = this.level.$attr2attrValue.width.curCalcValue + "px";
    };

    LSON.Part.prototype.$renderFn_height = function () {
      this.node.style.height = this.level.$attr2attrValue.height.curCalcValue + "px";
    };
  }




  LSON.Part.prototype.$renderFn_opacity = function () {
    this.node.style.opacity = this.level.$attr2attrValue.opacity.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_scrollX = function () {
    this.node.scrollTop = this.level.$attr2attrValue.scrollX.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_scrollY = function () {
    this.node.scrollLeft = this.level.$attr2attrValue.scrollY.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_overflowX = function () {
    this.node.style.overflowX = this.level.$attr2attrValue.overflowX.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_overflowY = function () {
    this.node.style.overflowY = this.level.$attr2attrValue.overflowY.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_cursor = function () {
    this.node.style.cursor = this.level.$attr2attrValue.cursor.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_backgroundColor = function () {
    this.node.style.backgroundColor = convertColorToCss( this.level.$attr2attrValue.backgroundColor.curCalcValue );
  };

  LSON.Part.prototype.$renderFn_backgroundImage = function () {
    this.node.style.backgroundImage = this.level.$attr2attrValue.backgroundImage.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_backgroundAttachment = function () {
    this.node.style.backgroundAttachment = this.level.$attr2attrValue.backgroundAttachment.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_backgroundRepeat = function () {
    this.node.style.backgroundRepeat = this.level.$attr2attrValue.backgroundColor.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_backgroundSize = function () {
    this.node.style.backgroundColor = this.level.$attr2attrValue.backgroundSize.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_backgroundPosition = function () {
    this.node.style.backgroundPosition = this.level.$attr2attrValue.backgroundPosition.curCalcValue;
  };

  LSON.Part.prototype.$renderFn_boxShadows = function () {
    var boxShadow, i, numBoxShadows, attr2attrValue;
    attr2attrValue = this.level.$attr2attrValue;
    var s="";
    for ( i = 1; i <= len; i++ ) {
      s +=
      ( attr2attrValue["boxShadow" + i + "Inset" ].curCalcValue ? "inset " : "" ) +
      ( attr2attrValue["boxShadow" + i + "X" ].curCalcValue + "px " ) +
      ( attr2attrValue["boxShadow" + i + "Y" ].curCalcValue + "px " ) +
      ( attr2attrValue["boxShadow" + i + "Blur" ].curCalcValue + "px " ) +
      ( attr2attrValue["boxShadow" + i + "Spread" ].curCalcValue + "px " ) +
      ( convertColorToCss( attr2attrValue["boxShadow" + i + "Color" ].curCalcValue ) );

    }
  };



})();
