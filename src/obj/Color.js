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

  LSON.Color.prototype.alpha = function () {

    return this.alpha;
  };


  LSON.Color.prototype.hsl = function () {
    if ( this.format === "hsl" ) {

      return { h: this.h, s: this.s, l: this.l };


    } else {

      // calculate
      // source: http://stackoverflow.com/a/9493060
      r = this.r / 255; g = this.g / 255; b = this.b / 255;
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
  };


  // source: http://stackoverflow.com/a/9493060
  LSON.Color.prototype.rgb = function () {
    if ( this.format === "rgb" ) {

      return { r: this.r, g: this.g, b: this.b };


    } else {

      // calculate
      // source: http://stackoverflow.com/a/9493060
      var r, g, b;

      if(this.s === 0){
        r = g = b = this.l; // achromatic
      }else{


        var q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s;
        var p = 2 * this.l - q;
        r = hue2rgb(p, q, this.h + 1/3);
        g = hue2rgb(p, q, this.h);
        b = hue2rgb(p, q, this.h - 1/3);
      }

      return { r: r * 255, g: g * 255, b: b * 255 };

    }
  };


  function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }





  ///more! check spec for supported colors (including transparent)


})();
