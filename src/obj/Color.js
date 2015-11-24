(function() {
  "use strict";

  // Check for CSS3 color support within the browser
  // source inspired from:
  // http://lea.verou.me/2009/03/check-whether-the-browser-supports-rgba-and-other-css3-values/  

  var isCss3ColorSupported = (function () {
    var prevColor = document.body.style.color;
    try {
      document.body.style.color = "rgba(0,0,0,0)";
    } catch (e) {}
    var result = document.body.style.color !== prevColor;
    document.body.style.color = prevColor;
    return result;

  })();

  
  // inspiration from: sass (https://github.com/sass/sass/)

  LAID.Color = function ( format, key2value, alpha ) {

    this.format = format;

    this.r = key2value.r;
    this.g = key2value.g;
    this.b = key2value.b;

    this.h = key2value.h;
    this.s = key2value.s;
    this.l = key2value.l;

    this.a = alpha;

  };

  LAID.Color.prototype.getFormat = function () {
    return this.format;
  };

  LAID.Color.prototype.getRed = function () {
    return this.r;

  };

  LAID.Color.prototype.getGreen = function () {
    return this.g;
  };

  LAID.Color.prototype.getBlue = function () {
    return this.b;
  };

  LAID.Color.prototype.getHue = function () {
    return this.h;
  };

  LAID.Color.prototype.getSaturation = function () {
    return this.s;

  };

  LAID.Color.prototype.getLightness = function () {
    return this.l;

  };

  LAID.Color.prototype.getAlpha = function () {
    return this.a;
  };

  LAID.Color.prototype.stringify = function () {

    var rgb, hsl;
    if ( isCss3ColorSupported ) {

      if ( this.format === "hsl" ) {
        hsl = this.getHsl();
        if ( this.a === 1 ) {
          return "hsl(" + hsl.h + "," + hsl.s + "," + hsl.l + ")";
        } else {
          return "hsla(" + hsl.h + "," + hsl.s + "," + hsl.l + "," + this.a + ")";
        }

      } else {
        rgb = this.getRgb();
        if ( this.a === 1 ) {
          return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        } else {
          return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this.a + ")";
        }
      }

    } else {

      // for IE8 and legacy browsers
      // where rgb is the sole color
      // mode available
      if ( this.a < 0.1 ) {
        return "transparent";
      } else {
        rgb = this.getRgb();
        return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
      }

    }

  };

  LAID.Color.prototype.copy = function () {

    return this.format === "rgb" ?
      new LAID.Color( "rgb", { r: this.r, g: this.g,  b: this.b } , this.a ) :
      new LAID.Color( "hsl", { h: this.h, s: this.s,  l: this.l } , this.a );

  };

  LAID.Color.prototype.equals = function ( otherColor ) {

     return ( this.format === otherColor.format ) &&
      ( this.a === otherColor.a ) &&
      (
        (
          this.format === "rgb" &&
          this.r === otherColor.r &&
          this.g === otherColor.g &&
          this.b === otherColor.b
        )
        ||
        (
          this.format === "hsl" &&
          this.h === otherColor.h &&
          this.s === otherColor.s &&
          this.l === otherColor.l
        )
      );


  };

  LAID.Color.prototype.getRgb = function () {
    if ( this.format === "rgb" ) {

      return { r: this.r, g: this.g, b: this.b };


    } else {

      return convertHslToRgb( this.r, this.g, this.b );

    }
  };

  LAID.Color.prototype.getHsl = function () {
    if ( this.format === "hsl" ) {

      return { h: this.h, s: this.s, l: this.l };

    } else {

      return convertRgbToHsl( this.r, this.g, this.b );
    }
  };


  LAID.Color.prototype.getRgba = function () {

    var rgb = this.getRgb();
    rgb.a = this.a;
    return rgb;

  };



  LAID.Color.prototype.getHsla = function () {

    var hsl = this.getHsl();
    hsl.a = this.a;
    return hsl;

  };

  // mix, invert, saturate, desaturate



  LAID.Color.prototype.red = function ( val ) {

    if ( this.format === "rgb" ) {
      this.r = val;
    } else {
      var rgb = this.getRgb();
      var hsl = convertRgbToHsl( val, rgb.g, rgb.b );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };

  LAID.Color.prototype.green = function ( val ) {

    if ( this.format === "rgb" ) {
      this.g = val;
    } else {
      var rgb = this.getRgb();
      var hsl = convertRgbToHsl( rgb.r, val, rgb.b );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };

  LAID.Color.prototype.blue = function ( val ) {

    if ( this.format === "rgb" ) {
      this.b = val;
    } else {
      var rgb = this.getRgb();
      var hsl = convertRgbToHsl( rgb.r, rgb.g, val );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };

  LAID.Color.prototype.hue = function ( val ) {

    if ( this.format === "hsl" ) {
      this.h = val;
    } else {
      var hsl = this.getHsl();
      var rgb = convertHslToRgb( val, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAID.Color.prototype.saturation = function ( val ) {

    if ( this.format === "hsl" ) {
      this.s = val;
    } else {
      var hsl = this.getHsl();
      var rgb = convertHslToRgb( hsl.h, val, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAID.Color.prototype.lightness = function ( val ) {

    if ( this.format === "hsl" ) {
      this.l = val;
    } else {
      var hsl = this.getHsl();
      var rgb = convertHslToRgb( hsl.h, hsl.s, val );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };


  /* Sets alpha */
  LAID.Color.prototype.alpha = function ( alpha ) {
    this.a = alpha;
    return this;
  };

  LAID.Color.prototype.darken = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.l = hsl.l - ( hsl.l * fraction );
    if ( this.format === "hsl" ) {
      this.l = hsl.l;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAID.Color.prototype.lighten = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.l = hsl.l + ( hsl.l * fraction );
    if ( this.format === "hsl" ) {
      this.l = hsl.l;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAID.Color.prototype.saturate = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.s = hsl.s + ( hsl.s * fraction );
    if ( this.format === "hsl" ) {
      this.s = hsl.s;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAID.Color.prototype.desaturate = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.s = hsl.s - ( hsl.s * fraction );
    if ( this.format === "hsl" ) {
      this.s = hsl.s;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };


  LAID.Color.prototype.invert = function ( ) {

    var rgb = this.getRgb();
    rgb.r = 255 - rgb.r;
    rgb.g = 255 - rgb.g;
    rgb.b = 255 - rgb.b;

    if ( this.format === "rgb" ) {

      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;

    } else {
      var hsl = convertRgbToHsl( rgb.r, rgb.g, rgb.b );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };



  function convertHslToRgb( h, s, l ) {

    // calculate
    // source: http://stackoverflow.com/a/9493060
    var r, g, b;

    if(s === 0){
      r = g = b = l; // achromatic
    }else{


      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = convertHueToRgb(p, q, h + 1/3);
      g = convertHueToRgb(p, q, h);
      b = convertHueToRgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };

  }

  function convertRgbToHsl( r, g, b ) {
    // calculate
    // source: http://stackoverflow.com/a/9493060
    r = r / 255; g = g / 255; b = b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h, s: s, l: l };
  }


  function convertHueToRgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }



})();
