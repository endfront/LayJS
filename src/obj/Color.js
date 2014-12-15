(function() {
  "use strict";


  LSON.Color = function ( format, key2value, alpha ) {

    this.format = format;

    this.r = key2value.r;
    this.g = key2value.g;
    this.b = key2value.b;

    this.h = key2value.h;
    this.s = key2value.s;
    this.l = key2value.l;

    this.a = alpha;

  };

  LSON.Color.prototype.copy = function () {

    return this.format === "rgb" ?
     new LSON.Color( "rgb", { r: this.r, g: this.g,  b: this.b } , this.a ) :
     new LSON.Color( "hsl", { h: this.h, s: this.s,  l: this.l } , this.a );

  };


  /* Sets alpha */
  LSON.Color.prototype.alpha = function ( alpha ) {

    this.a = alpha;
  };

  LSON.Color.protoype.darken = function ( fraction ) {

    var hsl = this.hsl();
    hsl.l = hsl.l - ( hsl.l * fraction );
    if ( this.format === "rgb" ) {
      this.l = l;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = r;
      this.g = g;
      this.b = b;
    }
  };

  LSON.Color.protoype.lighten = function ( fraction ) {

    var hsl = this.hsl();
    hsl.l = hsl.l + ( hsl.l * fraction );
    if ( this.format === "rgb" ) {
      this.l = l;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = r;
      this.g = g;
      this.b = b;
    }
  };

  LSON.Color.prototype.hsla = function () {

      var hsl = this.hsl();
      hsl.a = this.a;
      return hsl;

  };

  LSON.Color.prototype.rgba = function () {

    var rgb = this.rgb();
    rgb.a = this.a;
    return rgb;

  };

  LSON.Color.prototype.hsl = function () {
    if ( this.format === "hsl" ) {

      return { h: this.h, s: this.s, l: this.l };


    } else {

      return convertRgbToHsl( this.r, this.g, this.b );
    }
  };


  // source: http://stackoverflow.com/a/9493060
  LSON.Color.prototype.rgb = function () {
    if ( this.format === "rgb" ) {

      return { r: this.r, g: this.g, b: this.b };


    } else {

      return convertHslToRgb( this.r, this.g, this.b );

    }
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

  };

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
  };


  function convertHueToRgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }





  ///more! check spec for supported colors (including transparent)


})();
