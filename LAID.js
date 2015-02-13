/*

optgroup {
font-weight: bold;
}

textarea {
overflow: auto;
}


button {
overflow: visible;
}


abbr[title] {
border-bottom: 1px dotted;
}



b,
strong {
font-weight: bold;
}

dfn {
font-style: italic;
}



h1 {
font-size: 2em;
margin: 0.67em 0;
}



mark {
background: #ff0;
color: #000;
}



small {
font-size: 80%;
}



sub,
sup {
font-size: 75%;
line-height: 0;
position: relative;
vertical-align: baseline;
}

sup {
top: -0.5em;
}

sub {
bottom: -0.25em;
}



*/

(function () {
  "use strict";

  /*
  var
    textTestNodeCSS = "position:absolute;isibility:hidden;box-sizing:border-box;-moz-box-sizing:border-box;font-family:sans-serif:font-size:13px;",
    textWidthTestNode = document.createElement( "span" ),
    textHeightTestNode = document.createElement( "div" );

  textHeightTestNode.id = "t-height";
  textWidthTestNode.id = "t-width";

  textWidthTestNode.style.cssText = textTestNodeCSS;
  textHeightTestNode.style.cssText = textTestNodeCSS;


  document.body.appendChild( textWidthTestNode );
  document.body.appendChild( textHeightTestNode );

*/

  window.laid = window.LAID = {

    $path2level: {},
    $cloggedLevelS: [],
    $newPartS: [],
    $newlyInstalledStateLevelS: [],
    $newlyUninstalledStateLevelS: [],
    $newLevelS: [],
    $recalculateDirtyLevelS: [],
    $renderDirtyLevelS: [],
    $prevFrameTime: 0,
    //$uninitialized: {},
    $isClogged:false,
    $isSolvingNewLevels: false,
    $isRequestedForAnimationFrame: false
  };

})();

( function () {
  "use strict";

  // The naming convention:
  // attr -> string attr name
  // attrVal -> class AttrVal

  LAID.AttrVal = function ( attr, level ) {

    // undefined initializations:
    // (1) performance (http://jsperf.com/objects-with-undefined-initialized-properties/2)
    // (2) readability

    this.level = level;
    this.val = undefined;
    this.valUsedForLastRecalculation = undefined;
    this.isTaken = undefined;
    this.attr = attr;
    this.isRecalculateRequired = true;

    this.calcVal = undefined;
    this.transitionCalcVal = undefined;
    this.transition = undefined;

    this.isStateProjectedAttr = checkIsStateProjectedAttr( attr );
    this.isEventReadonlyAttr = LAID.$eventReadonlyUtils.checkIsEventReadonlyAttr( attr );
    this.renderCall = level && ( level.isPart ) && ( LAID.$findRenderCall( attr ) );

    this.takerAttrValS = [];

    this.eventReadonlyEventType2boundFnHandler = {};

  }

  /*
  * For attrs which are of type state ( i.e state.<name> )
  * Return the name component.
  * Else return the empty string.
  */
  function getStateNameOfOnlyIf ( attr ) {
    var match = attr.match( /^([\w\-]+).onlyif$/ );

    return ( match !== null && match[ 1 ] !== "data" ) ?
    match[ 1 ] : "";

  }

  /*
  * For attrs which are of type when ( i.e state.<eventType><eventNum> )
  * Return the event type component.
  * Else return the empty string.
  */
  function getWhenEventTypeOfAttrWhen ( attr ) {

    return attr.startsWith( "when." ) ?
    attr.slice( 5, attr.length - 1 ) : "";

  }

  function getTransitionPropOfAttrTransition( attr ) {

      return  attr.startsWith( "transition." ) ?
        attr.slice( 11, attr.indexOf(".", 11 ) ) : "";

  }


  function checkIsStateProjectedAttr( attr ) {
    var i = attr.indexOf( "." );
    if ( ( i === -1 ) && ( attr[ 0 ] !== "$" ) ) {
      return true;
    } else {
      var prefix = attr.slice( 0, i );
      return ( ( [ "when", "transition", "$$num", "$$max" ] ).indexOf(
         prefix ) !== -1 );
    }
  }




  /* TODO: update this doc below along with its slash-asterisk
  formatting

  Returns true if the value is different,
  false otherwise */
  LAID.AttrVal.prototype.update = function ( val ) {

    this.val = val;

    if ( ( val !== this.valUsedForLastRecalculation ) &&
      !( LAID.$checkIsNan( val ) &&
       LAID.$checkIsNan( this.valUsedForLastRecalculation ) )
      ) {

      if ( this.val instanceof LAID.Take ) {
        this.takeNot();
      }

      this.isTaken = false;
      this.requestRecalculation();

      return true;

    }

  };

  /*
  * Request the level corresponding to the given AttrVal
  * to recalculate this AttrVal.
  */
  LAID.AttrVal.prototype.requestRecalculation = function () {
    this.isRecalculateRequired = true;
    this.level.$addRecalculateDirtyAttrVal( this );
  };


  /*
  * TODO: update this doc below
  *
  * Recalculate the value of the attr value.
  * Propagate the change across the LOM (LAID object model)
  * if the change in value produces a change.
  * For constraint (take) based attributes, recalculate the
  * value, for non constraint based use the `value` parameter
  * as the change.
  * Return true if calculation successful, false if
  * a circular reference rendered it unsuccessful
  */
  LAID.AttrVal.prototype.recalculate = function () {

    var
      isDirty = false,
      reCalc,
      level = this.level,
      i, len;

    if ( this.val instanceof LAID.Take ) { // is LAID.Take
      if ( !this.isTaken ) {
        this.isTaken = this.take();
        // if the attrval has not been taken
        // as yet then there is chance that
        // the giver attrval has not been
        // initialized as yet. Thus we
        // skip a round of solving to
        // let the other attrvals complete calculation
        return false;

      }

      reCalc = this.val.execute( this.level );
      if ( reCalc !== this.calcVal ) {
        isDirty = true;
        this.calcVal = reCalc;
      }
    } else {
      if ( this.val !== this.calcVal ) {
        this.calcVal = this.val;
        isDirty = true;
      }
    }

    if ( isDirty ) {
      var
        attr = this.attr,
        stateName = getStateNameOfOnlyIf( attr ),
        whenEventType = getWhenEventTypeOfAttrWhen( attr ),
        transitionProp = getTransitionPropOfAttrTransition( attr );

      /*if ( !this.transitionCalcVal && ( this.transitionCalcVal !== 0 ) ) {
        this.transitionCalcVal = this.calcVal;
      }*/

      this.valUsedForLastRecalculation = this.val;

      for ( i = 0, len = this.takerAttrValS.length; i < len; i++ ) {
        this.takerAttrValS[ i ].requestRecalculation();
      }

      if ( this.renderCall ) {
        level.$addRenderDirtyAttrVal( this );
        if ( ( attr === "text" ) ||
          ( attr.startsWith( "textPadding" ) )
        )  {

          level.$updateNaturalWidthFromText();
          level.$updateNaturalHeightFromText();
        }

        // In case there exists a transition
        // for the given prop then update it
        level.$updateTransitionProp( attr );

      } else if ( stateName !== "" ) {
        if ( this.calcVal ) { // state
          if ( LAID.$arrayUtils.pushUnique( level.$stateS, stateName ) ) {
            level.$updateStates();
            // remove from the list of uninstalled states (which may/may not be present within)
            LAID.$arrayUtils.remove( level.$newlyUninstalledStateS, stateName );
            // add state to the list of newly installed states
            LAID.$arrayUtils.pushUnique( level.$newlyInstalledStateS, stateName );
            // add level to the list of levels which have newly installed states
            LAID.$arrayUtils.pushUnique( LAID.$newlyInstalledStateLevelS, level );
          }
        } else { // remove state
          if ( LAID.$arrayUtils.remove( level.$stateS, stateName ) ) {

            level.$updateStates();
            // remove from the list of installed states (which may/may not be present within)
            LAID.$arrayUtils.remove( level.$newlyInstalledStateS, stateName );
            // add state to the list of newly uninstalled states
            LAID.$arrayUtils.pushUnique( level.$newlyUninstalledStateS, stateName );
            // add level to the list of levels which have newly uninstalled states
            LAID.$arrayUtils.pushUnique( LAID.$newlyUninstalledStateLevelS, level );
          }
        }
      } else if ( whenEventType !== "" ) {
        level.$updateWhenEventType( whenEventType );
      } else if ( transitionProp !== "" ) {
        level.$updateTransitionProp( transitionProp );
      } else if ( attr === "right" ) {
        if ( level.parentLevel !== undefined ) {
          level.parentLevel.$updateNaturalWidthFromChild( level );
        }
      } else if ( attr === "bottom" ) {
        if ( level.parentLevel !== undefined ) {
          level.parentLevel.$updateNaturalHeightFromChild( level );
        }
      } else if ( attr === "width" ) {
        if ( level.$attr2attrVal.text !== undefined ) {
          level.$updateNaturalHeightFromText();
        }
      }
    }
    this.isRecalculateRequired = false;
    return true;
  };

  LAID.AttrVal.prototype.give = function ( attrVal ) {
    if ( LAID.$arrayUtils.pushUnique( this.takerAttrValS, attrVal ) &&
     this.takerAttrValS.length === 1 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that a reference exists, add event listeners
        var
        eventType2fnHandler = LAID.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
        eventType,
        fnBoundHandler;
        for ( eventType in eventType2fnHandler ) {
          fnBoundHandler =
           eventType2fnHandler[ eventType ].bind( this.level );
          LAID.$eventUtils.add( this.level.part.node, eventType, fnBoundHandler );

          this.eventReadonlyEventType2boundFnHandler[ eventType ] = fnBoundHandler;
        }
      }
    }
  };
  LAID.AttrVal.prototype.giveNot = function ( attrVal ) {
    if ( LAID.$arrayUtils.remove( this.takerAttrValS, attrVal ) && this.takerAttrValS.length === 0 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that no reference exists, remove event listeners
        var
         eventType2fnHandler =
         LAID.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
         eventType,
         fnBoundHandler;
        for ( eventType in eventType2fnHandler ) {
          fnBoundHandler = eventReadonlyEventType2boundFnHandler[ eventType ];
          LAID.$eventUtils.remove( this.level.part.node, eventType, fnBoundHandler );
          this.eventReadonlyEventType2boundFnHandler[ eventType ] = undefined;
        }
      }
    }
  };


  LAID.AttrVal.prototype.take = function () {

    if ( this.val instanceof LAID.Take ) {
      var _relPath00attr_S, relPath, level, attr,
      i, len;
      // value is of type `LAID.Take`
      _relPath00attr_S = this.val._relPath00attr_S;

      for ( i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];
        level = relPath.resolve( this.level );

        if ( level === undefined ) {
          return false;
        }

        if ( ( level.$attr2attrVal[ attr ] === undefined ) )  {
          level.$createLazyAttr( attr );
          return false;
        }

        if ( level.$attr2attrVal[ attr ].isRecalculateRequired ) {
          return false;
        }
      }

      for ( i = 0; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];

        relPath.resolve( this.level ).$getAttrVal( attr ).give( this );

      }
    }
    return true;

  };

  LAID.AttrVal.prototype.takeNot = function ( attrVal ) {

    if ( this.val instanceof LAID.Take ) {
      var _relPath00attr_S, relPath, level, attr;
      _relPath00attr_S = this.val._relPath00attr_S;

      for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];

        level = relPath.resolve( this.level );
        if ( ( level !== undefined ) && ( level.$getAttrVal( attr ) !== undefined ) ) {
          level.$getAttrVal( attr ).giveNot( this );
        }
      }
    }

  };

  LAID.AttrVal.prototype.checkIsDependentOnAttrVal = function( attrVal ) {



    if ( !attrVal ) {
      return false;
    } else if ( attrVal === this ) {
      return true;
    } else {

      var _relPath00attr_S, i, len, level;

      if ( !( this.val instanceof LAID.Take ) ) {
        return false;
      } else {
        _relPath00attr_S = this.val._relPath00attr_S;
        for ( i = 0, len = _relPath00attr_S.length; i < len; i++ ) {
          level = ( _relPath00attr_S[ i ][ 0 ] ).resolve( this.level );
          if ( level &&
             ( level.$getAttrVal( _relPath00attr_S[ i ][ 1 ] ).checkIsDependentOnAttrVal( attrVal ) ) ) {
               return true;
             }
        }

        return false;
      }
    }
  };



})();

(function() {
  "use strict";

  // Check for CSS3 color support within the browser
  document.body.style.color = "rgba(0,0,0,0)";
  var isCss3ColorSupported = Boolean( window.getComputedStyle( document.body, null ).getPropertyValue( "color" ) );


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

  LAID.Color.prototype.stringify = function () {

    var rgb, hsl;
    if ( isCss3ColorSupported ) {

      if ( this.format === "hsl" ) {
        hsl = this.hsl();
        if ( this.a === 1 ) {
          return "hsl(" + hsl.h + "," + hsl.s + "," + hsl.l + ")";
        } else {
          return "hsla(" + hsl.h + "," + hsl.s + "," + hsl.l + "," + this.a + ")";
        }

      } else {
        rgb = this.rgb();
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
      rgb = this.rgb();
      return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";

    }

  };

  LAID.Color.prototype.copy = function () {

    return this.format === "rgb" ?
      new LAID.Color( "rgb", { r: this.r, g: this.g,  b: this.b } , this.a ) :
      new LAID.Color( "hsl", { h: this.h, s: this.s,  l: this.l } , this.a );

  };

  LAID.Color.prototype.rgb = function () {
    if ( this.format === "rgb" ) {

      return { r: this.r, g: this.g, b: this.b };


    } else {

      return convertHslToRgb( this.r, this.g, this.b );

    }
  };

  LAID.Color.prototype.hsl = function () {
    if ( this.format === "hsl" ) {

      return { h: this.h, s: this.s, l: this.l };

    } else {

      return convertRgbToHsl( this.r, this.g, this.b );
    }
  };


  LAID.Color.prototype.rgba = function () {

    var rgb = this.rgb();
    rgb.a = this.a;
    return rgb;

  };



  LAID.Color.prototype.hsla = function () {

    var hsl = this.hsl();
    hsl.a = this.a;
    return hsl;

  };

  // mix, invert, saturate, desaturate, greyscale



  LAID.Color.prototype.red = function ( val ) {

    if ( this.format === "rgb" ) {
      this.r = val;
    } else {
      var rgb = this.rgb();
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
      var rgb = this.rgb();
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
      var rgb = this.rgb();
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
      var hsl = this.hsl();
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
      var hsl = this.hsl();
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
      var hsl = this.hsl();
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

    var hsl = this.hsl();
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

    var hsl = this.hsl();
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

    var hsl = this.hsl();
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

    var hsl = this.hsl();
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

  LAID.Color.prototype.grayscale = function ( ) {

    this.desaturate( 1 );
    return this;

  };

  LAID.Color.prototype.invert = function ( ) {

    var rgb = this.rgb();
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

( function () {
  "use strict";


  function checkIsValidLevelName( levelName ) {

    return ( /^[\w\-]+$/ ).test( levelName );
  }


  LAID.Level = function ( path, lson, parent ) {

    this.path = path;
    this.parentLevel = parent; // parent Level
    // True if the Level is a Part Level,
    // false if the Level is a Many Level.
    this.isPart = undefined;
    // This is relevant if the Level is a Part.
    // If true it implies that this Part
    // has been generated by a Many Level.
    this.isManyDerived = undefined;

    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.part = undefined;
    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.many = undefined;
    // If the Level is derived from a Many Level
    // (i.e this.isManyDerived is true)
    // then this.derivedMany will hold
    // a reference to that Many object
    this.derivedMany = undefined;

    this.$lson = lson;

    this.$attr2attrVal = {};
    this.$recalculateDirtyAttrValS = [];
    this.$renderDirtyAttrValS = [];

    this.$childLevelS = [];

    this.$stateS = [];
    this.$stringHashedStates2_cachedAttr2val_ =  {};
    this.$newlyInstalledStateS = [];
    this.$newlyUninstalledStateS = [];


    this.$whenEventType2fnMainHandler = {};

    this.$naturalWidthLevel = undefined;
    this.$naturalHeightLevel = undefined;



  };
/*

  LAID.Level.prototype.$initNecessaryAttrs = function() {
    var necessaryReadonlyPropS = [
    //"$naturalWidth", "$naturalHeight",
     "$numberOfChildren",
    //"$absoluteLeft", "$absoluteTop"
     ], i, len;

    this.$attr2attrVal.$numberOfChildren
    for ( i = 0, len = necessaryReadonlyPropS.length; i < len; i++ ) {
      this.$attr2attrVal[ necessaryReadonlyPropS[ i ] ] =
      new LAID.AttrVal( necessaryReadonlyPropS[ i ], this );
    }
    this.$attr2attrVal.$numberOfChildren.update( this.$childLevelS.length );

  }
*/
  LAID.Level.prototype.$init = function () {

    LAID.$path2level[ this.path ] = this;

    if ( !LAID.$isClogged ) {
      LAID.$newLevelS.push( this );
      if ( !LAID.$isSolvingNewLevels ) {
        LAID.$solveForNew();
      }

    } else {
      LAID.$cloggedLevelS.push( this );
    }

  };

  LAID.Level.prototype.addChildren = function ( name2lson ) {

    var childPath, childLevel, name;
    if ( name2lson !== undefined ) {
      for ( name in name2lson ) {

        if ( !checkIsValidLevelName( name ) ) {
          throw ( "LAID Error: Invalid Level Name: " + name );
        }

        childPath = this.path + ( this.path === "/" ? "" : "/" ) + name;
        if ( LAID.$path2level[ childPath ] !== undefined ) {
          throw ( "LAID Error: Level already exists with path: " + childPath );
        }
        childLevel = new LAID.Level( childPath, name2lson[ name ], this );
        this.$childLevelS.push( childLevel );
        childLevel.$init();

      }
    }

  };


  /*
  * Return false if the level could not be inherited (due
  * to another level not being present or started as yet)
  * Else add the level's children to the tree and return true
  */
  LAID.Level.prototype.$inheritAndReproduce = function () {

    var lson, refS, i, len, ref, level, inheritedAndNormalizedLson;

    LAID.$normalize( this.$lson, false );
    if ( this.$lson.inherits !== undefined ) { // does not contain anything to inherit from

      lson = { type: "none" };
      refS = this.$lson.inherits;
      for ( i = 0, len = refS.length; i < len; i++ ) {

        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference

          level = ( new LAID.RelPath( ref ) ).resolve( this );
          if ( level === undefined ) {

            return false;

          }
        }
      }
      for ( i = 0; i < len; i++ ) {

        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference

          level = ( new LAID.RelPath( ref ) ).resolve( this );
          inheritedAndNormalizedLson = level.$lson;

        } else { // object reference
          inheritedAndNormalizedLson = LAID.$normalize( ref, true );
        }

        LAID.$inherit( lson, inheritedAndNormalizedLson, false, false );
      }

      LAID.$inherit( lson, this.$lson, false, false );
      this.$lson = lson;
    }

    LAID.$defaultizeLsonRootProps( this.$lson );

    if ( this.$lson.children !== undefined ) {
      this.addChildren( this.$lson.children );
    }

    this.isPart = this.$lson.many === undefined;

    if ( this.isPart ) {
      this.part = new LAID.Part( this );
      this.part.$init();
      LAID.$newPartS.push( this.part );
    } else {
      this.many = new LAID.Many( this );
    }
    return true;

  };



  function initAttrsObj( attrPrefix, key2val, attr2val ) {

    var key, val;

    for ( key in key2val ) {
      attr2val[ attrPrefix + key ] = key2val[ key ];
    }
  }

  function initAttrsArray( attrPrefix, elementS, attr2val ) {

    var i, len;

    for ( i = 0, len = elementS.length ; i < len; i++ ) {
      attr2val[ attrPrefix + ( i + 1 ) ] = elementS[ i ];
    }
  }

  /* Flatten the slson to attr2val dict */
  function convertSLSONtoAttr2Val( slson, attr2val ) {

    var prop,
    transitionProp, transitionDirective,
    transitionPropPrefix,
    eventType, fnCallbackS,
    prop2val = slson.props,
    when = slson.when,
    transition = slson.transition,
    i, len;

    initAttrsObj( "", slson.props, attr2val );


    for ( transitionProp in transition ) {
      transitionDirective = transition[ transitionProp ];
      transitionPropPrefix =  "transition." + transitionProp + ".";
      if ( transitionDirective.type !== undefined ) {
        attr2val[ transitionPropPrefix + "type" ] = transitionDirective.type;
      }
      if ( transitionDirective.duration !== undefined ) {
        attr2val[ transitionPropPrefix + "duration" ] = transitionDirective.duration;
      }
      if ( transitionDirective.delay !== undefined ) {
        attr2val[ transitionPropPrefix + "delay" ] = transitionDirective.delay;
      }
      if ( transitionDirective.done !== undefined ) {
        attr2val[ transitionPropPrefix + "done" ] = transitionDirective.done;
      }
      if ( transitionDirective.args !== undefined ) {
        initAttrsObj( transitionPropPrefix + "args.", transitionDirective.args, attr2val );
      }
    }

    for ( eventType in when ) {
      fnCallbackS = when[ eventType ];
      initAttrsArray(  "when." + eventType, fnCallbackS, attr2val );
    }

    if ( slson.$$num !== undefined ) {
      initAttrsObj( "$$num.", slson.$$num, attr2val );
    }

    if ( slson.$$max !== undefined ) {
      initAttrsObj(  "$$max.", slson.$$max, attr2val );
    }

    /*if ( slson.$$keys !== undefined ) {initAttrsObj( statePrefix + "$$keys.", slson.$$keys, attr2val );}*/


  }

  LAID.Level.prototype.$initAllAttrs = function () {

    var
    //eventReadonly2defaultVal = LAID.$eventReadonlyUtils.getEventReadonly2defaultVal(),
    //eventReadonly,
    observableEventReadonlyS = this.$lson.observe,
    observableEventReadonly, i, len;

    if ( this.isPart ) {
      //this.$initNecessaryAttrs();
    }

    /*for ( eventReadonly in eventReadonly2defaultVal ) {
      this.$attr2attrVal[ eventReadonly ] = new LAID.AttrVal(
         eventReadonly, this );
    }*/

    if ( observableEventReadonlyS !== undefined ) {
      for ( i = 0, len = observableEventReadonlyS.length; i < len; i++ ) {
        observableEventReadonly = observableEventReadonlyS[ i ];
        if ( eventReadonly2defaultVal[ observableEventReadonly ] === undefined ) {
          console.error("LAID Warning: Non Event Read-Only: " + observableEventReadonly );
        } else {
          this.$attr2attrVal[ observableEventReadonly ].give( LAID.$emptyAttrVal );
        }
      }
    }

    this.$initNonStateProjectedAttrs();
    this.$updateStates();

  };

  LAID.Level.prototype.$initNonStateProjectedAttrs = function () {

    var i, key, val, stateName, state,

    states = this.$lson.states, when = this.$lson.when,
    transition = this.$lson.transition,
    attr2val = {};



    initAttrsObj( "data.", this.$lson.data, attr2val );

    if ( this.$lson.load !== undefined ) {
      attr2val.load = this.$lson.load;
    }

    //convertSLSONtoAttr2Val( this.$lson, attr2val, "root.", true );


    for ( stateName in states ) {
        state = states[ stateName ];
        attr2val[ stateName + "." + "onlyif" ] = state.onlyif;
        attr2val[ stateName + "." + "install" ] = state.install;
        attr2val[ stateName + "." + "uninstall" ] = state.uninstall;
    //  convertSLSONtoAttr2Val( states[ stateName ] , attr2val, stateName + ".",
    //   false );
    }

    this.$commitAttr2Val( attr2val );

  };

  LAID.Level.prototype.$commitAttr2Val = function ( attr2val ) {

    var attr, val, attrVal;
    for ( attr in attr2val ) {
      val = attr2val[ attr ];
      attrVal = this.$attr2attrVal[ attr ];
      if ( ( attrVal === undefined ) ) {
        attrVal = this.$attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );
      }
      attrVal.update( val );

    }
  };

  /*
  * Return true if attr was created as it exists (in lazy form),
  * false otherwise (it is not present at all to be created)
  */
  LAID.Level.prototype.$createLazyAttr = function ( attr ) {
    var
     readonlyDefaultVal = LAID.$getReadonlyAttrDefaultVal( attr ),
     splitAttrLsonComponentS, attrLsonComponentObj, i, len;
    if ( readonlyDefaultVal !== undefined ) {

      this.$attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );



      if ( readonlyDefaultVal === null ) {
        switch ( attr ) {
          case "$numberOfChildren":
            this.$attr2attrVal[ attr ].update( this.$childLevelS.length );
              break;
          case "$naturalWidth":


            this.$updateNaturalWidth();
            break;
          case "$naturalHeight":

            this.$updateNaturalHeight();
            break;
        }
      } else {

        this.$attr2attrVal[ attr ].update( readonlyDefaultVal );

      }
    } else {
      if ( attr.indexOf( "." ) === -1 ) {
        return false;
      } else {

        if ( attr.startsWith( "data." ) ) {
          this.$attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );
          this.$attr2attrVal[ attr ].update( undefined );
        } else {
          splitAttrLsonComponentS = attr.split( "." );

          if ( this.$lson.states === undefined ) {
            return false;
          } else {

            if ( attr.startsWith("root.") ) {  // "root." state
              attrLsonComponentObj = this.$lson;

            } else { // non root state
              attrLsonComponentObj = this.$lson.states[
               splitAttrLsonComponentS[ 0 ] ];
            }
            // rempve the state part of the attr components
            splitAttrLsonComponentS.shift();
            if ( (["when", "transition", "$$num", "$$max", "type",
                "inherits", "data", "observe", "interface", "many"]).
              indexOf( splitAttrLsonComponentS[ 0 ] ) === -1 ) {
                attrLsonComponentObj = attrLsonComponentObj.props;
              }

            for ( i = 0, len = splitAttrLsonComponentS.length; i < len; i++ ) {
              attrLsonComponentObj =
               attrLsonComponentObj[ splitAttrLsonComponentS[ i ] ];

              if ( attrLsonComponentObj === undefined ) {
                break;
              }
            }
            // Not present within states
            if ( attrLsonComponentObj === undefined ) {
              return false;
            } else {

              this.$attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );
              this.$attr2attrVal[ attr ].update( attrLsonComponentObj );
            }
          }
        }
      }
    }
    return true;
  };

  /*
  * Solve by recalculating each attr within the
  * level which requires recalculation
  * Return 1 if all attributes were solved
  * Return 2 if some attributes were solved
  * Return 3 if no attributes were solved
  */
  LAID.Level.prototype.$solveForRecalculation = function () {

    var i,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      recalculateDirtyAttrValS = this.$recalculateDirtyAttrValS;

    do {
      isSolveProgressed = false;
      for ( i = 0; i < recalculateDirtyAttrValS.length; i++ ) {
        isSolveProgressed = recalculateDirtyAttrValS[ i ].recalculate();
        //console.log( "\trecalculate", this.path, isSolveProgressed,
        //  recalculateDirtyAttrValS[ i ]);
        if ( isSolveProgressed ) {
          isSolveProgressedOnce = true;
          LAID.$arrayUtils.removeAtIndex( recalculateDirtyAttrValS, i );
          i--;
        }
      }

    } while ( ( recalculateDirtyAttrValS.length !== 0 ) && isSolveProgressed );

    return recalculateDirtyAttrValS.length === 0 ? 1 : ( isSolveProgressedOnce ? 2 : 3 );

  };

  /*
  Undefine all current attributes which are influencable
  by states: props, transition, when, $$num, $$max
  */
  LAID.Level.prototype.$undefineStateProjectedAttrs = function() {

    var attr;
    for ( attr in this.$attr2attrVal ) {
      if ( this.$attr2attrVal[ attr ].isStateProjectedAttr ) {
        this.$attr2attrVal[ attr ].update( undefined );
      }
    }
  };





  /* Return the attr2value generated
  by the current states */
  LAID.Level.prototype.getStateAttr2val = function () {

    var attr2val = {};

    if ( this.isManyDerived ) {
      // TODO:MANY: get from Many object
    } else {
      var stringHashedStates = this.$stateS.sort().join( "&" );
      if ( this.$stringHashedStates2_cachedAttr2val_[ stringHashedStates ] === undefined ) {
        convertSLSONtoAttr2Val( this.generateSLSON(), attr2val);
        this.$stringHashedStates2_cachedAttr2val_[ stringHashedStates ] = attr2val;
      }
      return this.$stringHashedStates2_cachedAttr2val_[ stringHashedStates ];
    }

  };


  /*
  *  From the current states generate the
  *  correspinding SLSON (state projected lson)
  *  Requirement: the order of states must be sorted
  */
  LAID.Level.prototype.generateSLSON =  function () {

    this.$stateS.sort();

    var slson = {}, attr2val;

    LAID.$inherit( slson, this.$lson, true, true );

    for ( var i = 0, len = this.$stateS.length; i < len; i++ ) {
      LAID.$inherit( slson, this.$lson.states[ this.$stateS[ i ] ] , true, true );
    }

    return slson;

  };




  LAID.Level.prototype.$updateStates = function () {

    var
    attr2val = this.getStateAttr2val(),
    attr, val,
    attrVal,
    i, len;

    // TODO: fix this outdated comment below
    //
    // state projected attributes are those attributes which
    // can be (key-)value modified by a state. This essentially
    // includes keys within "props", "when", and "transition".
    //
    // Get the entire list of state projected attributes with
    // the motive of removing (splicing) those attributes which
    // have been modified by the state. Ideally the list should
    // be empty at the end of

    // Algorithm
    //
    // allATTRS = filter(curATTRS)
    // for ATTR in (stateProjected) newATTRS
    //   dirty ATTR (=new value)
    //   remove ATTR from allATTRS
    // for ATTR in allATTRS
    //   dirty ATTR (=undefined)
    //

    this.$undefineStateProjectedAttrs();
    this.$commitAttr2Val( attr2val );

    console.log("NEW STATE", this.path, this.$stateS );

  };


  LAID.Level.prototype.attr = function ( attr ) {
    return this.$attr2attrVal[ attr ] ?
      this.$attr2attrVal[ attr ].calcVal : undefined;
  };

  LAID.Level.prototype.data = function ( dataKey, value ) {
    this.$changeAttrVal( "data." + dataKey, value );
  };

  LAID.Level.prototype.$getAttrVal = function ( attr ) {
    return this.$attr2attrVal[ attr ];
  };

  /* Manually change attr value */
  LAID.Level.prototype.$changeAttrVal = function ( attr, val ) {
    this.$attr2attrVal[ attr ].update( val );
    LAID.$solveForRecalculation();
  };

  LAID.Level.prototype.$addRecalculateDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.pushUnique( this.$recalculateDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$recalculateDirtyLevelS, this );

  };

  LAID.Level.prototype.$addRenderDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.pushUnique( this.$renderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$renderDirtyLevelS, this );

  };


  /*
  * Additional constraint of not being dependent upon
  * parent for the attr
  */
  LAID.Level.prototype.$findChildWithMaxOfAttr = function ( attr, attrValIndependentOf ) {
    var
      i, len, curMaxVal, curMaxLevel,
       childLevelS = this.$childLevelS,
       childLevel, childLevelAttrVal;
    for ( i = 0, len = childLevelS.length; i < len; i++ ) {
      childLevel = childLevelS[ i ];
        childLevelAttrVal = childLevel.$attr2attrVal[ attr ];
        if (
          ( childLevelAttrVal !== undefined ) &&
          ( childLevelAttrVal.calcVal || (childLevelAttrVal.calcVal === 0 ) ) &&
          ! ( childLevelAttrVal.checkIsDependentOnAttrVal( attrValIndependentOf ) ) ) {

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

  /*
  * Example: if a child level's "height" is its parent's "height", then
  * it is dependent upon its parent for the attr "height"
  */
  /*LAID.Level.prototype.$checkIsDependentOnParentForAttr = function ( attr ) {
    //return false;
    var attrVal = this.$attr2attrVal[ attr ];

    if ( !attrVal ) {
      return false;
    } else {
      return attrVal.checkIsDependentOnAttrVal( this.parentLevel.$getAttrVal( attr ) )
    }
  }*/

  LAID.Level.prototype.$updateNaturalWidth = function () {
    if ( this.path === "/" ) {
      this.$attr2attrVal.$naturalWidth.update( window.innerWidth );
    } else if ( this.$lson.type === "text" ) {
      this.$updateNaturalWidthFromText();
    } else {
      this.$naturalWidthLevel = this.$findChildWithMaxOfAttr( "right",
      this.$attr2attrVal.$naturalWidth);
      this.$attr2attrVal.$naturalWidth.update(
          this.$naturalWidthLevel ?
         ( this.$naturalWidthLevel.$attr2attrVal.right.calcVal || 0 ) :
         0
      );
    }
  };

  LAID.Level.prototype.$updateNaturalHeight = function () {
    if ( this.path === "/" ) {
      this.$attr2attrVal.$naturalHeight.update( window.innerHeight );
    } else if ( this.$lson.type === "text" ) {
      this.$updateNaturalHeightFromText();
    } else {
      this.$naturalHeightLevel = this.$findChildWithMaxOfAttr( "bottom",
      this.$attr2attrVal.$naturalHeight);

      this.$attr2attrVal.$naturalHeight.update(
          this.$naturalHeightLevel ?
         ( this.$naturalHeightLevel.$attr2attrVal.bottom.calcVal || 0 ) :
         0
      );
    }
  };

/*
  LAID.Level.prototype.$kickBackScrollX = function () {
    if ( this.$attr2attrVal.scrollX !== undefined ) {
      this.$addRenderDirtyAttrVal( this.$attr2attrVal.scrollX, true );
    }
  };

  LAID.Level.prototype.$kickBackScrollY = function () {
    if ( this.$attr2attrVal.scrollY !== undefined ) {
      this.$addRenderDirtyAttrVal( this.$attr2attrVal.scrollY, true );
    }
  };
*/

  LAID.Level.prototype.$updateNaturalWidthFromChild = function ( childLevel ) {

    if ( this.$attr2attrVal.$naturalWidth &&
      ( this.path !== "/" ) &&
      ! LAID.$checkIsNan( childLevel.$attr2attrVal.right.calcVal ) &&
      ! childLevel.$attr2attrVal.right.checkIsDependentOnAttrVal(
        this.$attr2attrVal.$naturalWidth)
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
        if ( this.$attr2attrVal.$naturalWidth.calcVal >
           childLevel.$attr2attrVal.right.calcVal  ) {
          // Find the child with the next largest right
          // This could be the same child level
          this.$naturalWidthLevel = this.$findChildWithMaxOfAttr( "right",
          this.$attr2attrVal.$naturalWidth);
        }
      } else {
        if ( childLevel.$attr2attrVal.right.calcVal >
          this.$naturalWidthLevel.$attr2attrVal.right.calcVal ) {
            this.$naturalWidthLevel = childLevel;
        }
      }
      this.$attr2attrVal.$naturalWidth.update(
        this.$naturalWidthLevel ?
        ( this.$naturalWidthLevel.$attr2attrVal.right.calcVal || 0 ) :
        0
      );

    }
  };


  LAID.Level.prototype.$updateNaturalHeightFromChild = function ( childLevel ) {

    if ( this.$attr2attrVal.$naturalHeight &&
        ( this.path !== "/" ) &&
       !LAID.$checkIsNan( childLevel.$attr2attrVal.bottom.calcVal ) &&
       !( childLevel.$attr2attrVal.bottom.checkIsDependentOnAttrVal(
         this.$attr2attrVal.$naturalHeight) )
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
         if ( this.$attr2attrVal.$naturalHeight.calcVal >
           childLevel.$attr2attrVal.bottom.calcVal  ) {
          // Find the child with the next largest bottom
          // This could be the same child level
          this.$naturalHeightLevel = this.$findChildWithMaxOfAttr( "bottom",
          this.$attr2attrVal.$naturalHeight);
        }
      } else {
        if ( childLevel.$attr2attrVal.bottom.calcVal >
          this.$naturalHeightLevel.$attr2attrVal.bottom.calcVal ) {
            this.$naturalHeightLevel = childLevel;
          }
        }


      this.$attr2attrVal.$naturalHeight.update(
          this.$naturalHeightLevel ?
          ( this.$naturalHeightLevel.$attr2attrVal.bottom.calcVal || 0 ) :
          0
      );
    }
  };

  LAID.Level.prototype.$updateNaturalWidthFromText = function () {

    if ( this.$attr2attrVal.$naturalWidth ) {

        this.part.$naturalWidthTextMode = true;
        this.$addRenderDirtyAttrVal( this.$attr2attrVal.text );

        if ( this.$attr2attrVal.scrollX !== undefined ) {
          this.$addRenderDirtyAttrVal( this.$attr2attrVal.scrollX );
        }
        // temporarily (for current recalculate) cycle
        // set the value to 0. This is only
        // as a render cycle is required for learning
        // the natural width
        this.$attr2attrVal.$naturalWidth.update( 0 );

    }
  };

  LAID.Level.prototype.$updateNaturalHeightFromText = function () {
    if ( this.$attr2attrVal.$naturalHeight) {
      this.part.$naturalHeightTextMode = true;
      this.$addRenderDirtyAttrVal( this.$attr2attrVal.text );

      if ( this.$attr2attrVal.scrollY !== undefined ) {
        this.$addRenderDirtyAttrVal( this.$attr2attrVal.scrollY );
      }
      // temporarily (for current recalculate) cycle
      // set the value to 0. This is only
      // as a render cycle is required for learning
      // the natural height
      this.$attr2attrVal.$naturalHeight.update( 0 );

    }
  };

  /*LAID.Level.prototype.$updateNaturalWidthFromText = function () {
    if ( this.$attr2attrVal.$naturalWidth.takerAttrValS.length ) {
      var textWidthTestNode = document.getElementById("t-width");
      var textProps = {
        textSize: "fontSize",
        textFamily: "fontFamily",
        textLetterSpacing: "letterSpacing",
        textWordSpacing: "wordSpacing",
        textWordVariant: "wordSpacing"


      };
      textHeightTestNode.style.fontSize = this.$attr2attrVal.textSize &&
                                          this.$attr2attrVal.textSize.calcVal;
      textHeightTestNode.style.fontFamily = this.$attr2attrVal.textFamily &&
                                          this.$attr2attrVal.textFamily.calcVal;

      textWidthTestNode.innerHTML = this.$attr2attrVal.text.calcVal;
      this.$attr2attrVal.$naturalWidth.update( ( textWidthTestNode.getBoundingClientRect().width ) +
        ( this.$attr2attrVal.textPaddingLeft !== undefined ? this.$attr2attrVal.textPaddingLeft.calcVal : 0  ) +
        ( this.$attr2attrVal.textPaddingRight !== undefined ? this.$attr2attrVal.textPaddingRight.calcVal : 0  )
      );
    }
  };*/

/*

  LAID.Level.prototype.$updateNaturalHeightFromText = function () {

    if ( this.$attr2attrVal.$naturalHeight.takerAttrValS.length ) {

      var textHeightTestNode = document.getElementById("t-height");
      textHeightTestNode.innerHTML = this.$attr2attrVal.text.calcVal;
      textHeightTestNode.style.width = this.$attr2attrVal.width.calcVal;
      if ( textHeightTestNode.style.textPaddingLeft !== undefined ) {
        textHeightTestNode.style.textPaddingLeft = this.$attr2attrVal.textPaddingLeft.calcVal;
      }
      if ( textHeightTestNode.style.textPaddingRight !== undefined ) {
        textHeightTestNode.style.textPaddingRight = this.$attr2attrVal.textPaddingRight.calcVal;
      }

      this.$attr2attrVal.$naturalHeight.update( ( textWidthTestNode.getBoundingClientRect().height ) +
        ( this.$attr2attrVal.textPaddingTop !== undefined ? this.$attr2attrVal.textPaddingTop.calcVal : 0  ) +
        ( this.$attr2attrVal.textPaddingBottom !== undefined ? this.$attr2attrVal.textPaddingBottom.calcVal : 0  )
      );

    }
  };

*/
  LAID.Level.prototype.$updateWhenEventType = function ( eventType ) {

    var
    numFnHandlersForEventType = this.$attr2attrVal[ "$$num.when." + eventType ].val,
    fnMainHandler,
    thisLevel = this;

    if ( this.$whenEventType2fnMainHandler[ eventType ] !== undefined ) {
      LAID.$eventUtils.remove( this.part.node, eventType, this.$whenEventType2fnMainHandler[ eventType ] );
    }

    if ( numFnHandlersForEventType !== 0 ) {

      fnMainHandler = function ( e ) {
        var i, len, attrValForFnHandler;
        for ( i = 0; i < numFnHandlersForEventType; i++ ) {
          attrValForFnHandler = thisLevel.$attr2attrVal[ "when." + eventType + ( i + 1 ) ];
          if ( attrValForFnHandler !== undefined ) {
            attrValForFnHandler.calcVal.call( thisLevel, e );
          }
        }
      };
      LAID.$eventUtils.add( this.part.node, eventType, fnMainHandler );
      this.$whenEventType2fnMainHandler[ eventType ] = fnMainHandler;

    } else {
      this.$whenEventType2fnMainHandler[ eventType ] = undefined;

    }
  };

  LAID.Level.prototype.$checkIsPropInTransition = function ( prop ) {
    return ( this.$attr2attrVal[ "transition." + prop  + ".type" ] !==
      undefined )  ||
      ( this.$attr2attrVal[ "transition." + prop  + ".delay" ] !==
        undefined );
  };

  LAID.Level.prototype.$updateTransitionProp = function ( transitionProp ) {

    var
      attr2attrVal = this.$attr2attrVal,
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
         attr2attrVal[ transitionPrefix + "args." + transitionArgS[ i ] ] ?
         attr2attrVal[ transitionPrefix + "args." + transitionArgS[ i ] ].calcVal :
          undefined );
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
  };

  LAID.Level.prototype.$updateTransitionAttrVal = function ( attrVal,
    transitionType, transitionDelay, transitionDuration,
    transitionArg2val, transitionDone  ) {

    // First check if the transition information is complete
    if (
          transitionType &&
        ( transitionDuration !== undefined ) &&
        ( transitionDelay !== undefined ) &&
        ( attrVal !== undefined ) &&
        ( attrVal.transitionCalcVal !== undefined ) &&
        ( attrVal.calcVal !== undefined ) ) {

      attrVal.transition = new LAID.Transition (
          transitionType,
          attrVal.transitionCalcVal,
          transitionDelay ,
          transitionDuration, transitionArg2val,
          transitionDone );
    } else if ( attrVal !== undefined ) { // else delete the transition

      attrVal.transition = undefined;
    }
  }








})();

(function() {
  "use strict";


  LAID.Many = function ( level ) {

    this.level = level;


  };


})();

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

  isGpuAccelerated = ( (cssPrefix + "transform" ) in allStyles );

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

  };


  LAID.Part.prototype.$init = function () {

    var
    levelType = this.level.$lson.type,
    inputType = this.level.$lson.inputType,
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

  };

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
    this.node.style[ cssPrefix + "transform-origin" ] =
    ( ( attr2attrVal.originX !== undefined ? attr2attrVal.originX.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrVal.originY !== undefined ? attr2attrVal.originY.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrVal.originZ !== undefined ? attr2attrVal.originZ.transitionCalcVal : 0.5 ) * 100 ) + "%";
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
      (  attr2attrVal["boxShadows" + i + "Blur" ].transitionCalcVal
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

(function () {
  "use strict";

  LAID.RelPath = function ( relativePath ) {


    if ( relativePath === "this" ) {

      this.me = true;

    } else {

      this.me = false;
      if ( relativePath[ 0 ] === "/" ) {
        this.absolute = true;
        this.absolutePath = relativePath;
      } else {
        this.absolute = false;
        this.numberOfParentTraversals =
         ( relativePath.match(/^(..\/)*/)[0].length ) / 3;
        // strip off the "../"s
        // eg: "../../Body" should become "Body"
        this.childPath = this.numberOfParentTraversals === 0 ? relativePath :
         relativePath.substring( (
           (this.numberOfParentTraversals) * 3 ) );

      }
    }

  };


  LAID.RelPath.prototype.resolve = function ( referenceLevel ) {

    if ( this.me ) {
      return referenceLevel;
    } else {
      if ( this.absolute ) {
          return LAID.$path2level[ this.absolutePath ];
      } else {
        for ( var i = 0; i < this.numberOfParentTraversals; ++i && (referenceLevel = referenceLevel.parentLevel ) ) {
        }

          return ( this.childPath === "" ) ? referenceLevel :
              LAID.$path2level[ referenceLevel.path +
              ( ( referenceLevel.path === "/" ) ? "" : "/" )+
              this.childPath ];
      }
    }
  };



})();

( function () {
  "use strict";

  LAID.Take = function ( relativePath, attr ) {

    var _relPath00attr_S;

    if ( attr !== undefined ) {
      var path = new LAID.RelPath( relativePath );
      _relPath00attr_S = [ [ path, attr ] ];

      this.executable = function () {

        return path.resolve( this ).$getAttrVal( attr ).calcVal;

      };
    } else { // direct value provided
      _relPath00attr_S = [];
      // note that 'relativePath' is misleading name
      // here in this second overloaded case
      var directValue = relativePath;

      this.executable = function () {
        return directValue;
      };
    }

    this._relPath00attr_S = _relPath00attr_S;

  };


  LAID.Take.prototype.execute = function ( contextPart ) {

    // pass in context part for relative path lookups
    return this.executable.call( contextPart );

  };



  LAID.Take.prototype.$mergePathAndProps = function ( take ) {

    var _relPath00attr_S = take._relPath00attr_S;
    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {
      this._relPath00attr_S.push( _relPath00attr_S[ i ] );

    }

  };


  LAID.Take.prototype.colorLighten = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) + val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) + val;
      };
    }
    return this;
  };


  LAID.Take.prototype.add = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) + val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) + val;
      };
    }
    return this;
  };



  LAID.Take.prototype.subtract = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) - val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) - val;
      };
    }
    return this;
  };

  LAID.Take.prototype.divide = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) / val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) / val;
      };
    }
    return this;
  };

  LAID.Take.prototype.multiply = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) * val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) * val;
      };
    }
    return this;
  };

  LAID.Take.prototype.remainder = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) % val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) % val;
      };
    }
    return this;
  };

  LAID.Take.prototype.half = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) / 2;
    };

    return this;
  };

  LAID.Take.prototype.double = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) * 2;
    };

    return this;
  };


  LAID.Take.prototype.contains = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).indexOf( val.execute( this ) ) !== -1;
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).indexOf( val ) !== -1;
      };
    }
    return this;
  };

  LAID.Take.prototype.eq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) === val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) === val;
      };
    }
    return this;
  };

  LAID.Take.prototype.gt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) > val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) > val;
      };
    }
    return this;
  };

  LAID.Take.prototype.gte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) >= val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) >= val;
      };
    }
    return this;
  };

  LAID.Take.prototype.lt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) < val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) < val;
      };
    }
    return this;
  };

  LAID.Take.prototype.lte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) <= val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) <= val;
      };
    }
    return this;
  };

  LAID.Take.prototype.or = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) || val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) || val;
      };
    }
    return this;
  };

  LAID.Take.prototype.and = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) && val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) && val;
      };
    }
    return this;
  };

  LAID.Take.prototype.not = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return !oldExecutable.call( this );
    };

    return this;
  };

  LAID.Take.prototype.positive = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return +oldExecutable.call( this );
    };

    return this;
  };

  LAID.Take.prototype.negative = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return -oldExecutable.call( this );
    };

    return this;
  };

  LAID.Take.prototype.method = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this )[ val.execute( this ) ]();
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this )[ val ]();
      };
    }
    return this;
  };

  LAID.Take.prototype.key = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this )[ val.execute( this ) ];
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this )[ val ];
      };
    }
    return this;
  };

  LAID.Take.prototype.index = LAID.Take.prototype.key;




  LAID.Take.prototype.min = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.min( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.min( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LAID.Take.prototype.max = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.max( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.max( oldExecutable.call( this ), val );
      };
    }
    return this;
  };


  LAID.Take.prototype.ceil = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.ceil( oldExecutable.call( this ) );
    };
    return this;
  };

  LAID.Take.prototype.floor = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.floor( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.sin = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.sin( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.cos = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.cos( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.tan = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.tan( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.pow = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LAID.Take.prototype.log = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.log( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.log( oldExecutable.call( this ), val );
      };
    }
    return this;
  };



  LAID.Take.prototype.format = function () {

    var argS = Array.prototype.slice.call( arguments ),
      takeFormat = new LAID.Take( LAID.$format );

    argS.unshift( this );

    return takeFormat.fn.apply( takeFormat, argS );

    // Add the `format` function
    //argS.push(LAID.$format);
    //return this.fn.apply( this, argS );

  };




  LAID.Take.prototype.i18nFormat = function () {

    this._relPath00attr_S.push( [ new LAID.RelPath( '/' ), 'data.lang' ] );

    var argS = Array.prototype.slice.call(arguments),
      takeFormat = new LAID.Take( fnWrapperI18nFormat );

    argS.unshift( this );

    return takeFormat.fn.apply( takeFormat, argS);

    // Add the `i18nFormat` function
    //argS.push(i18nFormat);
    //return this.fn.apply( this, argS );

  };

  function fnWrapperI18nFormat () {

    var argS = Array.prototype.slice.call( arguments );
    argS[ 0 ] = ( argS[ 0 ] )[ LAID.level( '/' ).attr( 'data.lang' ) ];

    if ( argS[ 0 ] === undefined ) {
      throw "LAID Error: No language defined for i18nFormat";
    }

    return LAID.$format.apply( undefined, argS );

  }

  LAID.Take.prototype.concat = LAID.Take.prototype.add;


  LAID.Take.prototype.match = function () {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).match( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).match( val );
      };
    }
    return this;

  };




  LAID.Take.prototype.colorLighten = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().lighten( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().lighten( val );
      };
    }
    return this;

  };


  LAID.Take.prototype.colorDarken = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().darken( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().darken( val );
      };
    }
    return this;

  };


  LAID.Take.prototype.colorStringify = function ( ) {

    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).copy().stringify( );
    };

    return this;

  };

  LAID.Take.prototype.colorInvert = function ( ) {

    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).copy().invert();
    };

    return this;

  };

  LAID.Take.prototype.colorSaturate = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturate( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturate( val );
      };
    }
    return this;

  };

  LAID.Take.prototype.colorDesaturate = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().desaturate( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().desaturate( val );
      };
    }
    return this;

  };

  LAID.Take.prototype.colorGrayscale = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ).copy().grayscale();
    };

    return this;

  };

  LAID.Take.prototype.colorAlpha = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().alpha( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().alpha( val );
      };
    }
    return this;

  };

  LAID.Take.prototype.colorRed = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val );
      };
    }
    return this;
  }

  LAID.Take.prototype.colorGreen = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val );
      };
    }
    return this;
  }
  LAID.Take.prototype.colorBlue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val );
      };
    }
    return this;
  }
  LAID.Take.prototype.colorHue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val );
      };
    }
    return this;
  }
  LAID.Take.prototype.colorSaturation = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val );
      };
    }
    return this;
  }
  LAID.Take.prototype.colorLightness = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val );
      };
    }
    return this;
  }

  /*
  * Call custom function with arguments, where arguments
  * can be LAID.Take objects.
  */
  LAID.Take.prototype.fn = function ( ) {

    var fnExecutable = this.executable;
    //console.log(fnExecutable.call(this));
    //console.log(fnExecutable, arguments, arguments.length);
    if ( arguments.length === 0 ) {

      this.executable = function () {
        return fnExecutable.call( this ).call( this );
      };

    } else if ( arguments.length === 1 ) {

      var arg = arguments[ 0 ];

      if ( arg instanceof LAID.Take ) {

        this.$mergePathAndProps( arg );
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg.execute( this ) );
        };
      } else {
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg );
        };
      }

    } else if ( arguments.length === 2 ) {

      var arg1 = arguments[ 0 ];
      var arg2 = arguments[ 1 ];

      if ( arg1 instanceof LAID.Take ) {

        this.$mergePathAndProps( arg1 );

        if ( arg2 instanceof LAID.Take ) {

          this.$mergePathAndProps( arg2 );

          this.executable = function () {
            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2.execute( this ) );
          };

        } else {
          this.executable = function () {

            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2 );
          };
        }

      } else if ( arg2 instanceof LAID.Take ) {

        this.$mergePathAndProps( arg2 );
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg1, arg2.execute( this ) );
        };


      } else {

        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg1, arg2 );
        };
      }
    } else {

      var argSlength = arguments.length;
      var argS = Array.prototype.slice.call( arguments );

      for ( var i = 0, curArg; i < argSlength; i++ ) {

        curArg = arguments[ i ];

        if ( curArg instanceof LAID.Take ) {

          this.$mergePathAndProps( curArg );

        }
      }

      this.executable = function () {

        var executedArgS = new Array( argSlength );

        for ( var i = 0, arg; i < argSlength; i++ ) {

          arg = argS[ i ];

          executedArgS[ i ] = arg instanceof LAID.Take ? arg.execute( this ) : arg;

        }

        return fnExecutable.call( this ).apply( this, executedArgS );

      };
    }

    return this;

    /*

    var fn;
    var oldExecutable = this.executable;

    if ( arguments.length === 1 ) {

    fn = arguments[ 0 ];

    if ( fn instanceof LAID.Take ) {

    this.$mergePathAndProps( fn );
    this.executable = function () {

    return (fn.execute( this )).call( this, oldExecutable.call( this ) );

  };

} else {

this.executable = function () {

return fn.call( this, oldExecutable.call( this ) );

};
}
}

else if (arguments.length === 2 ) {

var arg = arguments[ 0 ];
fn = arguments[ 1 ];

if ( fn instanceof LAID.Take ) {

this.$mergePathAndProps( fn );

if ( arg instanceof LAID.Take ) {

this.$mergePathAndProps( arg );

this.executable = function () {

return (fn.execute( this )).call( this, oldExecutable.call( this ), arg.execute( this ) );

};

} else {

this.executable = function () {

return (fn.execute( this )).call( this, oldExecutable.call( this ), arg );

};

}

} else {

if ( arg instanceof LAID.Take ) {

this.$mergePathAndProps( arg );

this.executable = function () {

return fn.call( this, oldExecutable.call( this ), arg.execute( this ) );

};

} else {

this.executable = function () {

return fn.call( this, oldExecutable.call( this ), arg );

};
}
}

} else {

var argSlength = arguments.length - 1;
var argS = Array.prototype.slice.call( arguments );

for ( var i = 0, curArg; i < argSlength; i++ ) {

curArg = arguments[ i ];

if ( curArg instanceof LAID.Take ) {

this.$mergePathAndProps( curArg );

}
}

fn = argS[ argSlength - 1 ];

if ( fn instanceof LAID.Take ) {

this.executable = function () {


// The "+1" allocates space for the first argument which is of the LAID.Take in current context.
var callableArgS = new Array( argSlength + 1 );
callableArgS[ 0 ] = oldExecutable.call( this );

for ( var i = 0, arg; i < argSlength; i++ ) {

arg = argS[ i ];

callableArgS[ i ] = arg instanceof LAID.Take ? arg.execute( this ) : arg;

}

return ( fn.execute( this ) ).apply( this, callableArgS );

};

} else {

this.executable = function () {

// The "+1" allocates space for the first argument which is of the LAID.Take in current context.
var callableArgS = new Array( argSlength + 1 );
callableArgS[ 0 ] = oldExecutable.call( this );

for ( var i = 0, arg; i < argSlength; i++ ) {

arg = argS[ i ];

callableArgS[ i ] = arg instanceof LAID.Take ? arg.execute( this ) : arg;

}

return fn.apply( window, callableArgS );


};
}
}

return this;
*/

};

}());

( function () {
  "use strict";

  var transitionType2fn,
    epsilon = 1e-6;

  LAID.Transition = function ( type, startCalcValue, delay, duration, args, done ) {
    this.startCalcValue = startCalcValue;
    this.done = done;
    this.delay = delay;
    this.transition = ( transitionType2fn[ type ] )( duration, args );

  }


  LAID.Transition.prototype.generateNext = function ( delta ) {
    return this.transition.generateNext( delta );
  };

  LAID.Transition.prototype.checkIsComplete = function () {
    return this.transition.checkIsComplete();
  };

  function LinearTransition ( duration, args ) {

    this.curTime = 0;
    this.duration = duration;

  }

  LinearTransition.prototype.generateNext = function ( delta ) {
    return ( ( this.curTime += delta ) / this.duration );
  };

  LinearTransition.prototype.checkIsComplete = function () {
    return this.curTime >= this.duration;
  };

  function CubicBezierTransition ( duration, args ) {

    this.curTime = 0;
    this.duration = duration;

    this.cx = 3.0 * args.a;
    this.bx = 3.0 * (args.c - args.a) - this.cx
    this.ax = 1.0 - this.cx - this.bx
    this.cy = 3.0 * args.b;
    this.by = 3.0 * (args.d - args.b) - this.cy
    this.ay = 1.0 - this.cy - this.by

  }


  // source of cubic bezier code below:
  // facebook pop framework & framer.js
  CubicBezierTransition.prototype.generateNext = function ( delta ) {

    return this.sampleCurveY( this.solveCurveX(
       (this.curTime += delta) / this.duration
    ) );

  }

  CubicBezierTransition.prototype.checkIsComplete = function () {
    return this.curTime >= this.duration;
  };


  CubicBezierTransition.prototype.sampleCurveX = function ( t ) {
    // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  };

  CubicBezierTransition.prototype.sampleCurveY = function ( t ) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  };

  CubicBezierTransition.prototype.sampleCurveDerivativeX = function( t ) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  };

  CubicBezierTransition.prototype.solveCurveX = function( x ) {
      var t0, t1, t2, x2, d2, i;

      // First try a few iterations of Newton's method -- normally very fast.
      for ( t2 = x, i = 0; i < 8; i++ ) {
        x2 = this.sampleCurveX( t2 ) - x;
        if ( Math.abs( x2 ) < epsilon )
          return t2;
        d2 = this.sampleCurveDerivativeX( t2 );
        if ( Math.abs( d2 ) < 1e-6 )
          break;
        t2 = t2 - x2 / d2;
      }

      // Fall back to the bisection method for reliability.
      t0 = 0.0;
      t1 = 1.0;
      t2 = x;

      if ( t2 < t0 )
        return t0;
      if ( t2 > t1 )
        return t1;

      while ( t0 < t1 ) {
        x2 = this.sampleCurveX( t2 );
        if ( Math.abs( x2 - x ) < epsilon )
          return t2;
        if ( x > x2 )
          t0 = t2;
        else
          t1 = t2;
        t2 = ( t1 - t0 ) * .5 + t0;
      }

      // Failure.
      return t2;
  };



  transitionType2fn = {
    linear: function ( duration, args ) {
      return new LinearTransition( duration, args );
    },
    "cubic-bezier": function ( duration, args ) {
      return new CubicBezierTransition( duration, args );
    },
    ease: function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.25, b: 0.1, c: 0.25, d: 1
      });
    },
    "ease-in": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.42, b: 0, c: 1, d: 1
      });
    },
    "ease-out": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0, b: 0, c: 0.58, d: 1
      });
    },
    "ease-in-out": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.42, b: 0, c: 0.58, d: 1
      });
    },
    /*
    ease: function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.25, b: 0.1, c: 0.25, d: 1
      });
    },
    "ease-in": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.42, b: 0, c: 1, d: 1
      });
    },
    "ease-out": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0, b: 0, c: 0.58, d: 1
      });
    },
    "ease-in-out": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.42, b: 0, c: 0.58, d: 1
      });
    }*/
  };






})();

( function () {
  "use strict";

  LAID.clog = function () {

    LAID.$isClogged = true;

  };

})();

( function() {
  "use strict";


  LAID.color = function ( colorName ) {


    var colorValue = colorName2colorValue[ colorName ];
    if ( colorValue === undefined ) {
      throw ("LAID Error: Color name: " + colorName +  " not found." );
    }
    else {
      return new LAID.Color( 'rgb', colorValue, 1 );

    }

  };

  // source page: http://www.w3.org/TR/css3-color/
  // source code: for ( var i=2, len=tbody.childNodes.length; i < len; i++) { var m = tbody.childNodes[i].childNodes[5].innerText.match(/(\d+),(\d+),(\d+)/); d[tbody.childNodes[i].childNodes[3].childNodes[0].innerText] = {r:m[1], g:m[2], b:m[3]}}

  var colorName2colorValue = {
    aliceblue : { r: 240 , g: 248 , b: 255 },
    antiquewhite : { r: 250 , g: 235 , b: 215 },
    aqua : { r: 0 , g: 255 , b: 255 },
    aquamarine : { r: 127 , g: 255 , b: 212 },
    azure : { r: 240 , g: 255 , b: 255 },
    beige : { r: 245 , g: 245 , b: 220 },
    bisque : { r: 255 , g: 228 , b: 196 },
    black : { r: 0 , g: 0 , b: 0 },
    blanchedalmond : { r: 255 , g: 235 , b: 205 },
    blue : { r: 0 , g: 0 , b: 255 },
    blueviolet : { r: 138 , g: 43 , b: 226 },
    brown : { r: 165 , g: 42 , b: 42 },
    burlywood : { r: 222 , g: 184 , b: 135 },
    cadetblue : { r: 95 , g: 158 , b: 160 },
    chartreuse : { r: 127 , g: 255 , b: 0 },
    chocolate : { r: 210 , g: 105 , b: 30 },
    coral : { r: 255 , g: 127 , b: 80 },
    cornflowerblue : { r: 100 , g: 149 , b: 237 },
    cornsilk : { r: 255 , g: 248 , b: 220 },
    crimson : { r: 220 , g: 20 , b: 60 },
    cyan : { r: 0 , g: 255 , b: 255 },
    darkblue : { r: 0 , g: 0 , b: 139 },
    darkcyan : { r: 0 , g: 139 , b: 139 },
    darkgoldenrod : { r: 184 , g: 134 , b: 11 },
    darkgray : { r: 169 , g: 169 , b: 169 },
    darkgreen : { r: 0 , g: 100 , b: 0 },
    darkgrey : { r: 169 , g: 169 , b: 169 },
    darkkhaki : { r: 189 , g: 183 , b: 107 },
    darkmagenta : { r: 139 , g: 0 , b: 139 },
    darkolivegreen : { r: 85 , g: 107 , b: 47 },
    darkorange : { r: 255 , g: 140 , b: 0 },
    darkorchid : { r: 153 , g: 50 , b: 204 },
    darkred : { r: 139 , g: 0 , b: 0 },
    darksalmon : { r: 233 , g: 150 , b: 122 },
    darkseagreen : { r: 143 , g: 188 , b: 143 },
    darkslateblue : { r: 72 , g: 61 , b: 139 },
    darkslategray : { r: 47 , g: 79 , b: 79 },
    darkslategrey : { r: 47 , g: 79 , b: 79 },
    darkturquoise : { r: 0 , g: 206 , b: 209 },
    darkviolet : { r: 148 , g: 0 , b: 211 },
    deeppink : { r: 255 , g: 20 , b: 147 },
    deepskyblue : { r: 0 , g: 191 , b: 255 },
    dimgray : { r: 105 , g: 105 , b: 105 },
    dimgrey : { r: 105 , g: 105 , b: 105 },
    dodgerblue : { r: 30 , g: 144 , b: 255 },
    firebrick : { r: 178 , g: 34 , b: 34 },
    floralwhite : { r: 255 , g: 250 , b: 240 },
    forestgreen : { r: 34 , g: 139 , b: 34 },
    fuchsia : { r: 255 , g: 0 , b: 255 },
    gainsboro : { r: 220 , g: 220 , b: 220 },
    ghostwhite : { r: 248 , g: 248 , b: 255 },
    gold : { r: 255 , g: 215 , b: 0 },
    goldenrod : { r: 218 , g: 165 , b: 32 },
    gray : { r: 128 , g: 128 , b: 128 },
    green : { r: 0 , g: 128 , b: 0 },
    greenyellow : { r: 173 , g: 255 , b: 47 },
    grey : { r: 128 , g: 128 , b: 128 },
    honeydew : { r: 240 , g: 255 , b: 240 },
    hotpink : { r: 255 , g: 105 , b: 180 },
    indianred : { r: 205 , g: 92 , b: 92 },
    indigo : { r: 75 , g: 0 , b: 130 },
    ivory : { r: 255 , g: 255 , b: 240 },
    khaki : { r: 240 , g: 230 , b: 140 },
    lavender : { r: 230 , g: 230 , b: 250 },
    lavenderblush : { r: 255 , g: 240 , b: 245 },
    lawngreen : { r: 124 , g: 252 , b: 0 },
    lemonchiffon : { r: 255 , g: 250 , b: 205 },
    lightblue : { r: 173 , g: 216 , b: 230 },
    lightcoral : { r: 240 , g: 128 , b: 128 },
    lightcyan : { r: 224 , g: 255 , b: 255 },
    lightgoldenrodyellow : { r: 250 , g: 250 , b: 210 },
    lightgray : { r: 211 , g: 211 , b: 211 },
    lightgreen : { r: 144 , g: 238 , b: 144 },
    lightgrey : { r: 211 , g: 211 , b: 211 },
    lightpink : { r: 255 , g: 182 , b: 193 },
    lightsalmon : { r: 255 , g: 160 , b: 122 },
    lightseagreen : { r: 32 , g: 178 , b: 170 },
    lightskyblue : { r: 135 , g: 206 , b: 250 },
    lightslategray : { r: 119 , g: 136 , b: 153 },
    lightslategrey : { r: 119 , g: 136 , b: 153 },
    lightsteelblue : { r: 176 , g: 196 , b: 222 },
    lightyellow : { r: 255 , g: 255 , b: 224 },
    lime : { r: 0 , g: 255 , b: 0 },
    limegreen : { r: 50 , g: 205 , b: 50 },
    linen : { r: 250 , g: 240 , b: 230 },
    magenta : { r: 255 , g: 0 , b: 255 },
    maroon : { r: 128 , g: 0 , b: 0 },
    mediumaquamarine : { r: 102 , g: 205 , b: 170 },
    mediumblue : { r: 0 , g: 0 , b: 205 },
    mediumorchid : { r: 186 , g: 85 , b: 211 },
    mediumpurple : { r: 147 , g: 112 , b: 219 },
    mediumseagreen : { r: 60 , g: 179 , b: 113 },
    mediumslateblue : { r: 123 , g: 104 , b: 238 },
    mediumspringgreen : { r: 0 , g: 250 , b: 154 },
    mediumturquoise : { r: 72 , g: 209 , b: 204 },
    mediumvioletred : { r: 199 , g: 21 , b: 133 },
    midnightblue : { r: 25 , g: 25 , b: 112 },
    mintcream : { r: 245 , g: 255 , b: 250 },
    mistyrose : { r: 255 , g: 228 , b: 225 },
    moccasin : { r: 255 , g: 228 , b: 181 },
    navajowhite : { r: 255 , g: 222 , b: 173 },
    navy : { r: 0 , g: 0 , b: 128 },
    oldlace : { r: 253 , g: 245 , b: 230 },
    olive : { r: 128 , g: 128 , b: 0 },
    olivedrab : { r: 107 , g: 142 , b: 35 },
    orange : { r: 255 , g: 165 , b: 0 },
    orangered : { r: 255 , g: 69 , b: 0 },
    orchid : { r: 218 , g: 112 , b: 214 },
    palegoldenrod : { r: 238 , g: 232 , b: 170 },
    palegreen : { r: 152 , g: 251 , b: 152 },
    paleturquoise : { r: 175 , g: 238 , b: 238 },
    palevioletred : { r: 219 , g: 112 , b: 147 },
    papayawhip : { r: 255 , g: 239 , b: 213 },
    peachpuff : { r: 255 , g: 218 , b: 185 },
    peru : { r: 205 , g: 133 , b: 63 },
    pink : { r: 255 , g: 192 , b: 203 },
    plum : { r: 221 , g: 160 , b: 221 },
    powderblue : { r: 176 , g: 224 , b: 230 },
    purple : { r: 128 , g: 0 , b: 128 },
    red : { r: 255 , g: 0 , b: 0 },
    rosybrown : { r: 188 , g: 143 , b: 143 },
    royalblue : { r: 65 , g: 105 , b: 225 },
    saddlebrown : { r: 139 , g: 69 , b: 19 },
    salmon : { r: 250 , g: 128 , b: 114 },
    sandybrown : { r: 244 , g: 164 , b: 96 },
    seagreen : { r: 46 , g: 139 , b: 87 },
    seashell : { r: 255 , g: 245 , b: 238 },
    sienna : { r: 160 , g: 82 , b: 45 },
    silver : { r: 192 , g: 192 , b: 192 },
    skyblue : { r: 135 , g: 206 , b: 235 },
    slateblue : { r: 106 , g: 90 , b: 205 },
    slategray : { r: 112 , g: 128 , b: 144 },
    slategrey : { r: 112 , g: 128 , b: 144 },
    snow : { r: 255 , g: 250 , b: 250 },
    springgreen : { r: 0 , g: 255 , b: 127 },
    steelblue : { r: 70 , g: 130 , b: 180 },
    tan : { r: 210 , g: 180 , b: 140 },
    teal : { r: 0 , g: 128 , b: 128 },
    thistle : { r: 216 , g: 191 , b: 216 },
    tomato : { r: 255 , g: 99 , b: 71 },
    turquoise : { r: 64 , g: 224 , b: 208 },
    violet : { r: 238 , g: 130 , b: 238 },
    wheat : { r: 245 , g: 222 , b: 179 },
    white : { r: 255 , g: 255 , b: 255 },
    whitesmoke : { r: 245 , g: 245 , b: 245 },
    yellow : { r: 255 , g: 255 , b: 0 },
    yellowgreen : { r: 154 , g: 205 , b: 50 }
  };

})();

(function() {
  "use strict";


  LAID.hsl = function ( h, s, l ) {

    return LAID.hsla( h, s, l, 1 );

  };

})();

(function() {
  "use strict";

  function takeHSLA ( h, s, l, a ) {

    var color = new LAID.Color( "hsl", { h: h, s: s, l: l }, a );

  }

  LAID.hsla = function ( h, s, l, a ) {

    if ( h instanceof LAID.Take ||
      s instanceof LAID.Take ||
      l instanceof LAID.Take ||
      a instanceof LAID.Take ) {

        return new LAID.Take( takeHSLA ).fn( h, s, l, a );

      } else {
        return new LAID.Color( "hsl", { h: h, s: s, l: l }, a );
      }

    };

  })();

(function() {
  "use strict";

  LAID.level = function ( path, refLevel ) {

    return ( refLevel !== undefined ) ?
    ( new LAID.RelPath( path ) ).resolve( refLevel ) :
    LAID.$path2level[ path ];

  };


})();

(function() {
  "use strict";


  LAID.rgb = function ( r, g, b ) {

    return LAID.rgba( r, g, b, 1 );

  };

})();

(function() {
  "use strict";


  function takeRGBA ( h, s, l, a ) {

    var color = new LAID.Color( "rgb", { r: r, g: g, b: b }, a );

  }

  LAID.rgba = function ( r, g, b, a ) {


    if ( r instanceof LAID.Take ||
      g instanceof LAID.Take ||
      b instanceof LAID.Take ||
      a instanceof LAID.Take ) {

          return new LAID.Take( takeRGBA ).fn( r, g, b, a );

      } else {

        return new LAID.Color( "rgb", { r: r, g: g, b: b }, a );
      }

    };

  })();

(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    var
      rootLevel;



    //rootLson.props.width = window.innerWidth;
    //rootLson.props.height = window.innerHeight;

    rootLevel = new LAID.Level( "/", rootLson, undefined );
    rootLevel.$init();
    LAID.$newLevelS = [ rootLevel ];

    window.onresize = updateSize;

    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );
    LAID.$solveForRecalculation();

  }




})();

(function() {
  "use strict";


  LAID.take = function ( relativePath, prop ) {


    if ( ( prop !== undefined ) && ( LAID.$checkIsExpanderAttr( prop ) ) ) {
        throw ( "LAID Error: takes using expander props such as '" + relativePath  + "' are not permitted." );
    } else {

      return new LAID.Take( relativePath, prop );
    }

  };

})();

( function() {
  "use strict";


  LAID.transparent = function ( ) {

    return new LAID.Color( 'rgb', { r: 0, g: 0, b: 0 }, 0 );

  };

})();

(function () {
  "use strict";

  // source: jquery-2.1.1.js (line 302, 529)

  var typeIdentifier2_type_ = {
  '[object Boolean]':    'boolean',
  '[object Number]':     'number',
  '[object String]':     'string',
  '[object Function]':    'function',
  '[object Array]':     'array',
  '[object Date]':      'date',
  '[object RegExp]':    'regExp',
  '[object Object]':    'object',
  '[object Error]':     'error'
};


  LAID.type = function( obj ) {
    if ( obj === null ) {
      return obj + "";
    }
    // Support: Android < 4.0, iOS < 6 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
    typeIdentifier2_type_[ toString.call(obj) ] || "object" :
    typeof obj;
  };

})();

(function() {
  "use strict";


  LAID.unclog = function () {

    var i, len,
     cloggedLevelS = LAID.cloggedLevelS;
    for ( i = 0, len = cloggedLevelS.length; i < len; i++ ) {
      LAID.$newLevelS.push( cloggedLevelS[ i ] );

    }
    LAID.$solveForNew();
    
  };

})();

( function () {
  "use strict";

  LAID.$arrayUtils = {
    /*
    * Add to array if element does not exist already
    * Return true the element was added (as it did not exist previously)
    */
    pushUnique: function ( elementS, element ) {
      if ( elementS.indexOf( element ) === -1  ) {
        elementS.push( element );
        return true;
      }
      return false;
    },


    /*
    * Remove from array if element exists in it
    * Return true the element was remove (as it did exist previously)
    */
    remove: function ( elementS, element ) {
      var ind = elementS.indexOf( element );
      if ( ind !== -1 ) {
        elementS.splice( ind, 1 );
        return true;
      }
      return false;
    },

    /*
    * Remove element at index i
    */
    removeAtIndex: function ( elementS, ind ) {
      elementS.splice( ind, 1 );

    },



    /* Clone array at a single level */
    cloneSingleLevel: function ( elementS ) {
      return elementS.slice( 0 );
    }
  };





})();

(function(){
  "use strict";
  LAID.$capitalize = function( string ) {

    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );

  };
})();

(function() {
  "use strict";


  var expanderAttrS = [
  "border", "background", "boxShadows", "textShadows", "videoSources", "audioSources", "videoTracks", "audioTracks", "filters",
   "borderTop", "borderRight", "borderBottom", "borderLeft",
    "data", "when", "transition", "state", "type", "inherits", "states"
     ];
  var regexExpanderAttrs = /(^boxShadows\d+$)|(^textShadows\d+$)|(^videoSources\d+$)|(^audioSources\d+$)|(^videoTracks\d+$)|(^audioTracks\d+$)|(^filters\d+$)|(^filters\d+DropShadow$)|(^transition\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+\.args$)|(^when\.[a-zA-Z]+$)/;
  var nonStateAttrPrefixS = [ "data", "when", "transition", "state" ];

  function stripStateAttrPrefix( attr ) {
    var i = attr.indexOf(".");
    if ( i === -1 ) {
      return attr;
    } else {
      var prefix = attr.slice( 0, i );
      if ( nonStateAttrPrefixS.indexOf( prefix ) ) {
        return attr;
      } else {
        return attr.slice( i + 1 );
      }
    }
  }

  LAID.$checkIsExpanderAttr = function ( attr ) {
    var strippedStateAttr = stripStateAttrPrefix( attr );
    return ( ( expanderAttrS.indexOf( strippedStateAttr ) !== -1 ) ||
    ( regexExpanderAttrs.test( strippedStateAttr ) )
  );
  };

})();

( function () {
  "use strict";

  // Source: underscore.js

  LAID.$checkIsNan = function ( val ) {
    return ( typeof val === "number" ) &&
     ( val !== +val );
  }

} )();

(function() {
  "use strict";


  LAID.$checkIsPropAttr = function ( attr ) {
    return ( ( attr.indexOf( "." ) === -1 ) &&
     ( attr[ 0 ] !== "$") );
   };

})();

(function () {
  "use strict";

  // source: https://github.com/pvorb/node-clone/blob/master/clone.js

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }

  // shim for Node's 'util' package
  // DO NOT REMOVE THIS! It is required for compatibility with EnderJS (http://enderjs.com/).
  var util = {
    isArray: function (ar) {
      return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
    },
    isDate: function (d) {
      return typeof d === 'object' && objectToString(d) === '[object Date]';
    },
    isRegExp: function (re) {
      return typeof re === 'object' && objectToString(re) === '[object RegExp]';
    },
    getRegExpFlags: function (re) {
      var flags = '';
      re.global && (flags += 'g');
      re.ignoreCase && (flags += 'i');
      re.multiline && (flags += 'm');
      return flags;
    }
  };


  /**
  * Clones (copies) an Object using deep copying.
  *
  * This function supports circular references by default, but if you are certain
  * there are no circular references in your object, you can save some CPU time
  * by calling clone(obj, false).
  *
  * Caution: if `circular` is false and `parent` contains circular references,
  * your program may enter an infinite loop and crash.
  *
  * @param `parent` - the object to be cloned
  * @param `circular` - set to true if the object to be cloned may contain
  *    circular references. (optional - true by default)
  * @param `depth` - set to a number if the object is only to be cloned to
  *    a particular depth. (optional - defaults to Infinity)
  * @param `prototype` - sets the prototype to be used when cloning an object.
  *    (optional - defaults to parent prototype).
  */

  LAID.$clone = function (parent, circular, depth, prototype) {
    // maintain two arrays for circular references, where corresponding parents
    // and children have the same index
    var allParents = [];
    var allChildren = [];

    var useBuffer = typeof Buffer != 'undefined';

    if (typeof circular == 'undefined')
      circular = true;

      if (typeof depth == 'undefined')
        depth = Infinity;

        // recurse this function so we don't reset allParents and allChildren
        function _clone(parent, depth) {
          // cloning null always returns null
          if (parent === null)
            return null;

            if (depth === 0)
              return parent;

              var child;
              var proto;
              if (typeof parent != 'object') {
                return parent;
              }

              if (util.isArray(parent)) {
                child = [];
              } else if (util.isRegExp(parent)) {
                child = new RegExp(parent.source, util.getRegExpFlags(parent));
                if (parent.lastIndex) child.lastIndex = parent.lastIndex;
              } else if (util.isDate(parent)) {
                child = new Date(parent.getTime());
              } else if (useBuffer && Buffer.isBuffer(parent)) {
                child = new Buffer(parent.length);
                parent.copy(child);
                return child;
              } else {
                if (typeof prototype == 'undefined') {
                  proto = Object.getPrototypeOf(parent);
                  child = Object.create(proto);
                }
                else {
                  child = Object.create(prototype);
                  proto = prototype;
                }
              }

              if (circular) {
                var index = allParents.indexOf(parent);

                if (index != -1) {
                  return allChildren[index];
                }
                allParents.push(parent);
                allChildren.push(child);
              }

              for (var i in parent) {
                var attrs;
                if (proto) {
                  attrs = Object.getOwnPropertyDescriptor(proto, i);
                }

                if (attrs && attrs.set === null) {
                  continue;
                }
                child[i] = _clone(parent[i], depth - 1);
              }

              return child;
            }

            return _clone(parent, depth);
          };



        })();

( function () {
  "use strict";

  var
    essentialProp2defaultValue,
    lazyProp2defaultValue;

  LAID.$defaultizeLsonRootProps = function ( lson ) {
    var
      essentialProp,
      props = lson.props,
      states = lson.states,
      stateName, state,
      prop,
      when, transition, metaMax, maxProp,
      eventType, transitionProp;

    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( props[ essentialProp ] === undefined ) {
        props[ essentialProp ] = essentialProp2defaultValue[ essentialProp ];
      }
    }


    if ( states ) {
      for ( stateName in states ) {
        state = states[ stateName ];
        props = state.props;
        when = state.when;
        transition = state.transition;
        metaMax = state.$$max;

        for ( prop in props ) {

          if ( ( lson.props[ prop ] === undefined ) &&
              ( lazyProp2defaultValue[ prop ] !== undefined )
            ) {

              lson.props[ prop ] = lazyProp2defaultValue[ prop ];
          }
        }
      }

      for ( maxProp in metaMax ) {
        lson.$$max = lson.$$max || {};

        if ( !lson.$$max[ maxProp ] ) {
          lson.$$max[ metaMax ] = metaMax[ maxProp ];
        }
      }

      for ( eventType in when ) {
        if ( !lson.when[ eventType ] ) {
          lson.when[ eventType ] = [];
        }
      }

      for ( transitionProp in transition ) {
        if ( !lson.transition[ transitionProp ] )  {
          lson.transition[ transitionProp ] = {};
        }
      }
    }

    if ( lson.props.text !== undefined ) {
      lson.type = "text";
    } else if ( lson.type === undefined ) {
      lson.type = "none";
    } else if ( lson.type.startsWith( "input:" ) ) {
      lson.inputType = lson.type.slice( ( "input:").length );
    }


  };

  essentialProp2defaultValue = {
    width:  new LAID.Take( "this", "$naturalWidth" ),
    height:  new LAID.Take( "this", "$naturalHeight" ),
    top: 0,
    left: 0
  };

  // These match the psuedo defaults for non expander props
  lazyProp2defaultValue = {
    display: true,
    z: 0,
    shiftX: 0,
    shiftY: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ:1,
    skewX: 0,
    skewY: 0,
    originX: 0.5,
    originY: 0.5,
    originZ: 0.5,
    perspective:0,
    perspectiveOriginX: 0.5,
    perspectiveOriginY: 0.5,
    backfaceVisibility: false,
    opacity:1.0,
    zIndex: "auto",
    overflowX: "hidden",
    overflowY: "hidden",
    scrollX: 0,
    scrollY: 0,
    scrollElastic: true,
    cursor: "auto",
    backgroundColor: LAID.transparent(),
    backgroundImage: "none",
    backgroundAttachmented: "scroll",
    backgroundRepeat: true,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: undefined,
    backgroundSizeY: undefined,


    cornerRadiusTopLeft: 0,
    cornerRadiusTopRight: 0,
    cornerRadiusBottomLeft: 0,
    cornerRadiusBottomRight: 0,

    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",

    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,


    borderTopColor: LAID.transparent(),
    borderBottomColor: LAID.transparent(),
    borderRightColor: LAID.transparent(),
    borderLeftColor: LAID.transparent(),

    text: "",
    textSize: 16,
    textFamily: "sans-serif",
    textWeight: "normal",
    textcolor: LAID.color("black"),
    textVariant: "normal",
    textStyle: "normal",
    textDecoration: "none",
    textAlign: "start",
    textLetterSpacing: undefined,
    textWordSpacing: undefined,
    textOverflow: "clip",
    textIndent: 0,
    textWhitespace: "normal",

    textPaddingTop: 0,
    textPaddingRight: 0,
    textPaddingBottom: 0,
    textPaddingLeft: 0,

    input: "",
    inputLabel: "",
    inputRows: 2,
    inputPlaceholder: "",
    inputAutocomplete: false,
    inputAutocorrect: true,
    inputDisabled: false,

    videoAutoplay: false,
    videoControls: true,
    videoCrossorigin: "anonymous",
    videoLoop: false,
    videoMuted: false,
    videoPreload: "auto",
    videoPoster: null,


    audioControls: true,
    audioLoop: false,
    audioMuted: false,
    audioPreload: "auto",
    audioVolume: 0.7

  };
})();

( function(){
  "use strict";

  var eventReadonly2_eventType2fnHandler_ = {
    $hovered: {
      mouseover: function () {
        this.$changeAttrVal( "$hovered", true );
      },
      mouseout:   function () {
        this.$changeAttrVal( "$hovered", false );
      }
    },
    $focused: {
      focus: function () {
        this.$changeAttrVal( "$focused", true );
      },
      blur: function () {
        this.$changeAttrVal( "$focused", false );
      }
    },
    $clicked: {
      mousedown: function () {
        this.$changeAttrVal( "$clicked", true );
      },
      touchdown: function () {
        this.$changeAttrVal( "$clicked", true );
      },
      mouseup: function () {
        this.$changeAttrVal( "$clicked", false );
      },
      mouseleave: function () {
        this.$changeAttrVal( "$clicked", false );
      },
      touchup: function () {
        this.$changeAttrVal( "$clicked", false );
      },
    },
    $scrolledX: {
      scroll: function () {
        this.$changeAttrVal( "$scrolledX", this.part.node.scrollTop );
      }
    },
    $cursorX: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorX", this.part.node.offsetX );
      }
    },
    $cursorY: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorY", this.part.node.offsetY );
      }
    },
    $input: {
      click: function () {
        this.$changeAttrVal( "$input", this.part.node.value );
      },
      change: function () {
        this.$changeAttrVal( "$input", this.part.node.value );
      },
      keydown: function () {
        this.$changeAttrVal( "$input", this.part.node.value );
      }
    },

    $inputChecked: {
      change: function () {
        this.$changeAttrVal( "$inputChecked", this.checked );
      }
    }
  };


  LAID.$eventReadonlyUtils = {
    checkIsEventReadonlyAttr: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ] !== undefined;
    },
    getEventType2fnHandler: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ];
    },

  };


})();

var GUID = 1;

LAID.$eventUtils = {
  add: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else {
      // assign each event handler a unique ID
      if (!handler.$$guid) handler.$$guid = event_helper.GUID++;
      // create a hash table of event types for the element
      if (!element.events) element.events = {};
      // create a hash table of event handlers for each element/event pair
      var handlers = element.events[type];
      if (!handlers) {
        handlers = element.events[type] = {};
        // store the existing event handler (if there is one)
        if (element["on" + type]) {
          handlers[0] = element["on" + type];
        }
      }
      // store the event handler in the hash table
      handlers[handler.$$guid] = handler;
      // assign a global event handler to do all the work
      element["on" + type] = handle;
    }
  },

  remove: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else {
      // delete the event handler from the hash table
      if (element.events && element.events[type]) {
        delete element.events[type][handler.$$guid];
      }
    }
  }
};

function handle(event) {
  var returnValue = true;
  // grab the event object (IE uses a global event object)
  event = event || fix(((this.ownerDocument || this.document || this).parentWindow || window).event);
  // get a reference to the hash table of event handlers
  var handlers = this.events[event.type];
  // execute each event handler
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
}

function fix(event) {
  // add W3C standard event methods
  event.preventDefault = fix_preventDefault;
  event.stopPropagation = fix_stopPropagation;
  return event;
}
function fix_preventDefault() {
  this.returnValue = false;
}
function fix_stopPropagation() {
  this.cancelBubble = true;
}

( function () {
  "use strict";



  var regexDetails = /^([a-zA-Z]+)(\d+)/;

  LAID.$findMultipleTypePropMatchDetails = function ( prop ) {
      return prop.match( regexDetails );
  };



})();

(function(){
  "use strict";
  /*var renderCall2regex = {
    filters: /^filters/,
    boxShadows: /^boxShadows/,
    textShadows: /^textShadows/,
    audioSources: /^audioSources/,
    videoSources: /^videoSources/,
    audioTracks: /^audioTracks/,
    videoTracks: /^videotracks/
  };*/


  LAID.$findRenderCall = function( prop ) {

    var
      renderCall,
      multipleTypePropMatchDetails;

    if ( !LAID.$checkIsPropAttr( prop ) ||
      ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf( prop ) !== -1 ||
      LAID.$shorthandPropsUtils.checkIsDecentralizedShorthandProp( prop ) ) {
        return undefined;
      } else {
        multipleTypePropMatchDetails = LAID.$findMultipleTypePropMatchDetails(
        prop );

        if ( multipleTypePropMatchDetails ) {
          return multipleTypePropMatchDetails[ 1 ];
        }

        renderCall = LAID.$shorthandPropsUtils.getShorthandPropCenteralized( prop );
        if ( renderCall !== undefined ) {
          return renderCall;
        }
        return prop;
      }
    };
})();

// LAID has taken the below source from 'tmaeda1981jp'
// source: https://github.com/tmaeda1981jp/string-format-js/blob/master/format.js

(function() {

  "use strict";

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var Formatter = (function() {
      var Constr = function(identifier) {
        var array = function(len){ return new Array(len); };

        switch(true) {
        case /^#\{(\w+)\}*$/.test(identifier):
          this.formatter = function(line, param) {
            return line.replace('#{' + RegExp.$1 + '}', param[RegExp.$1]);
          };
          break;
        case /^([ds])$/.test(identifier):
          this.formatter = function(line, param) {
            if (RegExp.$1 === 'd' && !isNumber(param)) {
              throw new TypeError();
            }
            return line.replace("%" + identifier, param);
          };
          break;

        // Octet
        case /^(o)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace(
              "%" + identifier,
              parseInt(param).toString(8));
          };
          break;

        // Binary
        case /^(b)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace(
              "%" + identifier,
              parseInt(param).toString(2));
          };
          break;

        // Hex
        case /^([xX])$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var hex = parseInt(param).toString(16);
            if (identifier === 'X') { hex = hex.toUpperCase(); }
            return line.replace("%" + identifier, hex);
          };
          break;

        case /^(c)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace("%" + identifier, String.fromCharCode(param));
          };
          break;

        case /^(u)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace("%" + identifier, parseInt(param, 10) >>> 0);
          };
          break;

        case /^(-?)(\d*).?(\d?)(e)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var lpad = RegExp.$1 === '-',
                width = RegExp.$2,
                decimal = RegExp.$3 !== '' ? RegExp.$3: undefined,
                val = param.toExponential(decimal),
                mantissa, exponent, padLength
            ;

            if (width !== '') {
              if (decimal !== undefined) {
                padLength = width - val.length;
                if (padLength >= 0){
                  val = lpad ?
                    val + array(padLength + 1).join(" "):
                    array(padLength + 1).join(" ") + val;
                }
                else {
                  // TODO throw ?
                }
              }
              else {
                mantissa = val.split('e')[0];
                exponent = 'e' + val.split('e')[1];
                padLength = width - (mantissa.length + exponent.length);
                val = padLength >= 0 ?
                  mantissa + (array(padLength + 1)).join("0") + exponent :
                  mantissa.slice(0, padLength) + exponent;
              }
            }
            return line.replace("%" + identifier, val);
          };
          break;

        case /^(-?)(\d*).?(\d?)(f)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var lpad = RegExp.$1 === '-',
                width   = RegExp.$2,
                decimal = RegExp.$3,
                DOT_LENGTH = '.'.length,
                integralPart = param > 0 ? Math.floor(param) : Math.ceil(param),
                val = parseFloat(param).toFixed(decimal !== '' ? decimal : 6),
                numberPartWidth, spaceWidth;

            if (width !== '') {
              if (decimal !== '') {
                numberPartWidth =
                  integralPart.toString().length + DOT_LENGTH + parseInt(decimal, 10);
                spaceWidth = width - numberPartWidth;
                val = lpad ?
                  parseFloat(param).toFixed(decimal) + (array(spaceWidth + 1).join(" ")) :
                  (array(spaceWidth + 1).join(" ")) + parseFloat(param).toFixed(decimal);
              }
              else {
                val = parseFloat(param).toFixed(
                  width - (integralPart.toString().length + DOT_LENGTH));
              }
            }
            return line.replace("%" + identifier, val);
          };
          break;

        // Decimal
        case /^([0\-]?)(\d+)d$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }

            var len = RegExp.$2 - param.toString().length,
                replaceString = '',
                result;
            if (len < 0) { len = 0; }
            switch(RegExp.$1) {
            case "": // rpad
              replaceString = (array(len + 1).join(" ") + param).slice(-RegExp.$2);
              break;
            case "-": // lpad
              replaceString = (param + array(len + 1).join(" ")).slice(-RegExp.$2);
              break;
            case "0": // 0pad
              replaceString = (array(len + 1).join("0") + param).slice(-RegExp.$2);
              break;
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;

        // String
        case /^(-?)(\d)s$/.test(identifier):
          this.formatter = function(line, param) {
            var len = RegExp.$2 - param.toString().length,
                replaceString = '',
                result;
            if (len < 0) { len = 0; }
            switch(RegExp.$1) {
            case "": // rpad
              replaceString = (array(len + 1).join(" ") + param).slice(-RegExp.$2);
              break;
            case "-": // lpad
              replaceString = (param + array(len + 1).join(" ")).slice(-RegExp.$2);
              break;
            default:
              // TODO throw ?
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;

        // String with max length
        case /^(-?\d?)\.(\d)s$/.test(identifier):
          this.formatter = function(line, param) {
            var replaceString = '',
                max, spacelen;

            // %.4s
            if (RegExp.$1 === '') {
              replaceString = param.slice(0, RegExp.$2);
            }
            // %5.4s %-5.4s
            else {
              param = param.slice(0, RegExp.$2);
              max = Math.abs(RegExp.$1);
              spacelen = max - param.toString().length;
              replaceString = RegExp.$1.indexOf('-') !== -1 ?
                (param + array(spacelen + 1).join(" ")).slice(-max): // lpad
                (array(spacelen + 1).join(" ") + param).slice(-max); // rpad
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;
        default:
          this.formatter = function(line, param) {
            return line;
          };
        }
      };

      Constr.prototype = {
        format: function(line, param) {
          return this.formatter.call(this, line, param);
        }
      };
      return Constr;
    }());

    LAID.$format = function() {

      var i,
          result,
          argSLength = arguments.length,
          argS = Array.prototype.slice.call(arguments);

        // result contians the formattable string
        result = argS[ 0 ];
        for ( i = 1; i < argSLength; i++ ) {
          if (result.match(/%([.#0-9\-]*[bcdefosuxX])/)) {
            result = new Formatter(RegExp.$1).format(result, argS[ i ] );
          }
        }

      return result;
    };

}());

( function () {
  "use strict";

  LAID.$generateColorMix = function ( startColor, endColor, fraction ) {

      var
        startColorRgbaDict = startColor.rgba(),
        endColorRgbaDict = endColor.rgba(),
        midColor;


      return new LAID.Color( "rgb", {
        r: Math.round( startColorRgbaDict.r +
          fraction * ( endColorRgbaDict.r - startColorRgbaDict.r )
        ),
        g: Math.round( startColorRgbaDict.g +
          fraction * ( endColorRgbaDict.g - startColorRgbaDict.g )
        ),
        b: Math.round( startColorRgbaDict.b +
          fraction * ( endColorRgbaDict.b - startColorRgbaDict.b )
        )
      }, ( startColorRgbaDict.a +
        fraction * ( endColorRgbaDict.a - startColorRgbaDict.a )
      ) );


  };

})();

( function () {
  "use strict";

  /* null values indicate that
  * a recalculation at runtime must
  * be done based on the level
  */

  var readonlyAttr2defaultVal = {
    $naturalWidth: null,
    $naturalHeight: null,
    //$absoluteLeft: null,
    //$absoluteTop null,
    $numberOfChildren: null,
    $dataTravelledDelta: 0,
    $dataTravelling: false,

    $hovered: false,
    $focused: false,
    $clicked: false,
    $scrolledX: 0,
    $scrolledY: 0,
    $cursorX: 0,
    $cursorY: 0,
    $input: "",
    $inputChecked: false,
  };

  LAID.$getReadonlyAttrDefaultVal = function ( attr ) {
    return readonlyAttr2defaultVal[ attr ];
  };

})();


(function () {
  "use strict";

  // Inheritance allows modifications to the
  // `intoLson` object, but disallows modifications
  // to `fromLson`



  /*
  * Inherit the root, state, or many LAID from `from` into `into`.
  */
  LAID.$inherit = function ( into, from, isState, isRootState ) {

    if ( !isState ) {
      for ( var key in from ) {

        if ( from[ key ] && ( key2fnInherit[ key ] ) ) {
          key2fnInherit[ key ]( into, from );
        }
      }
    } else {

      if ( !isRootState ) {
        into.onlyif = from.onlyif || into.onlyif;
        into.install = from.install || into.install;
        into.uninstall = from.uninstall || into.uninstall;
      }

      if ( from.props !== undefined ) {
        key2fnInherit.props( into, from );
      }
      if ( from.when !== undefined ) {
        key2fnInherit.when( into, from );
      }
      if ( from.transition !== undefined ) {
        key2fnInherit.transition( into, from );
      }
      if ( from.$$max !== undefined ) {
        key2fnInherit.$$max( into, from );
      }
    }
  };

  function inheritTransitionProp ( intoTransition, fromTransition,
    intoTransitionProp, fromTransitionProp ) {


      var fromTransitionDirective, intoTransitionDirective,
      fromTransitionArgKey2val,  intoTransitionArgKey2val,
      fromTransitionArgKey;

      fromTransitionDirective = fromTransition[ fromTransitionProp ];
      intoTransitionDirective = intoTransition[ intoTransitionProp ];

      if ( fromTransitionDirective !== undefined ) {

        if ( intoTransitionDirective === undefined ) {
          intoTransitionDirective =
            intoTransition[ intoTransitionProp ] = {};
        }

        intoTransitionDirective.type = fromTransitionDirective.type ||
          intoTransitionDirective.type;

        intoTransitionDirective.duration = fromTransitionDirective.duration ||
          intoTransitionDirective.duration;

        intoTransitionDirective.delay = fromTransitionDirective.delay ||
          intoTransitionDirective.delay;

        intoTransitionDirective.done = fromTransitionDirective.done ||
          intoTransitionDirective.done;

        fromTransitionArgKey2val = fromTransitionDirective.args;
        intoTransitionArgKey2val = intoTransitionDirective.args;


        if ( fromTransitionArgKey2val !== undefined ) {

          if ( intoTransitionArgKey2val === undefined ) {
            intoTransitionArgKey2val =
            intoTransitionDirective.args = {};
          }

          for ( fromTransitionArgKey in fromTransitionArgKey2val ) {

            intoTransitionArgKey2val[ fromTransitionArgKey ] =
              fromTransitionArgKey2val[ fromTransitionArgKey ];
          }
        }
      }
    }

    function checkIsMutable ( val ) {
      return ( ( typeof val === "object" ) || val instanceof Array );
    }

    function inheritSingleLevelObject( intoObject, fromObject, key, isDuplicateOn ) {

      var fromKey2value, intoKey2value, fromKey, fromKeyValue;
      fromKey2value = fromObject[ key ];
      intoKey2value = intoObject[ key ];


      if ( intoKey2value === undefined ) {

        intoKey2value = intoObject[ key ] = {};

      }

      for ( fromKey in fromKey2value ) {

        fromKeyValue = fromKey2value[ fromKey ];
        intoKey2value[ fromKey ] = ( isDuplicateOn && checkIsMutable( fromKeyValue ) ) ?
          LAID.$clone( fromKeyValue ) :
          fromKeyValue;


      }
    }



    // Precondition: `into<Scope>.key (eg: intoLAID.key)` is already defined
    var key2fnInherit = {

      type: function( intoLson, fromLson ) {

        intoLson.type = fromLson.type || intoLson.type;


      },

      data: function( intoLson, fromLson ) {

        inheritSingleLevelObject( intoLson, fromLson, "data" );

      },

      load: function ( intoLson, fromLson ) {

        intoLson.load = fromLson.load || intoLson.load;

      },


      props: function( intoLson, fromLson ) {

        inheritSingleLevelObject( intoLson, fromLson, "props" );

      },


      transition: function ( intoLson, fromLson ) {

        var
          fromTransition = fromLson.transition,
          intoTransition = intoLson.transition,
          fromTransitionProp,
          intoTransitionProp,
          i, len,
          tmpTransition = {};


        if ( ( intoTransition === undefined ) ) {
          intoTransition = intoLson.transition = {};
        }


        // "all" prop overwrite stage
        //
        // Eg: "rotateX" partially/completely overwritten
        // by "all" where "rotateX" is present
        // within "into"LSON and "all" is present
        // within "from"LSON

        if ( fromTransition.all ) {
          for ( intoTransitionProp in intoTransition ) {
            if ( intoTransition !== "all" ) {
              inheritTransitionProp( intoTransition, fromTransition,
                 intoTransitionProp, "all" );
            }
          }
        }

        // General inheritance of props of exact
        // names across from and into LSON
        for ( fromTransitionProp in fromTransition ) {
          inheritTransitionProp( intoTransition, fromTransition,
             fromTransitionProp, fromTransitionProp );
        }

        // flatten stage
        //
        // This is akin to a self-inheritance stafe whereby
        // prop transition directives are stacked
        // below the "all" transition direction
        //
        // Eg: a shorthand property such as "rotateX"
        // would inherit values from "all"
        //
        if ( intoTransition.all ) {
          for ( intoTransitionProp in intoTransition ) {

            if ( intoTransitionProp !== "all" ) {
              tmpTransition[ intoTransitionProp ] = {};
              inheritTransitionProp(
                tmpTransition, intoTransition,
                intoTransitionProp, "all" );
              inheritTransitionProp(
                tmpTransition, intoTransition,
                intoTransitionProp, intoTransitionProp );
              intoTransition[ intoTransitionProp ] =
                tmpTransition[ intoTransitionProp ];
            }
          }
        }
      },



      many: function( intoLson, fromLson ) {

        if ( intoLson.many === undefined ) {
          intoLson.many = {};
        }

        LAID.$inherit( intoLson.many, fromLson.many, false, false );

      },

      rows: function( intoLson, fromLson ) {

        var intoLsonRowS, fromLsonRowS;
        intoLsonRowS = intoLson.rows;
        fromLsonRowS = fromLson.rows;


        intoLson.rows = new Array( fromLsonRowS.length );
        intoLsonRowS = intoLson.rows;
        for ( var i = 0, len = fromLsonRowS.length, fromLsonRow; i < len; i++ )  {

          fromLsonRow = fromLsonRowS[ i ];
          intoLsonRowS[ i ] = checkIsMutable( fromLsonRow ) ? LAID.$clone( fromLsonRow ) : fromLsonRow;

        }

      },





      children: function( intoLson, fromLson ) {
        var fromChildName2lson, intoChildName2lson;
        fromChildName2lson = fromLson.children;
        intoChildName2lson = intoLson.children;

        if ( intoChildName2lson === undefined ) {
          intoChildName2lson = intoLson.children = {};
        }

        for ( var name in fromChildName2lson ) {

          if ( intoChildName2lson[ name ] === undefined ) { // inexistent child

            intoChildName2lson[ name ] = {};

          }
          LAID.$inherit( intoChildName2lson[ name ], fromChildName2lson[ name ], false, false );

        }
      },

      states: function( intoLson, fromLson ) {

        var
        fromStateName2state = fromLson.states,
        intoStateName2state = intoLson.states,
        inheritFromState, inheritIntoState;

        if ( intoStateName2state === undefined ) {
          intoStateName2state = intoLson.states = {};
        }

        for ( var name in fromStateName2state ) {

          if ( !intoStateName2state[ name ] ) { //inexistent state

            intoStateName2state[ name ] = {};

          }

          LAID.$inherit( intoStateName2state[ name ], fromStateName2state[ name ], true, false );

        }
      },

      when: function( intoLson, fromLson ) {


        var
        fromEventType2_fnEventHandlerS_ = fromLson.when,
        intoEventType2_fnEventHandlerS_ = intoLson.when,
        fnFromEventHandlerS, fnIntoEventHandlerS, fromEventType;


        if ( intoEventType2_fnEventHandlerS_ === undefined ) {
          intoEventType2_fnEventHandlerS_ = intoLson.when = {};
        }

        for ( fromEventType in fromEventType2_fnEventHandlerS_ ) {

          fnFromEventHandlerS = fromEventType2_fnEventHandlerS_[ fromEventType ];
          fnIntoEventHandlerS = intoEventType2_fnEventHandlerS_[ fromEventType ];

          if ( fnIntoEventHandlerS === undefined ) {

            intoEventType2_fnEventHandlerS_[ fromEventType ] = LAID.$arrayUtils.cloneSingleLevel( fnFromEventHandlerS );

          } else {

            intoEventType2_fnEventHandlerS_[ fromEventType ] = fnIntoEventHandlerS.concat( fnFromEventHandlerS );
          }

          LAID.$meta.set( intoLson, "num", "when." + fromEventType,
          ( intoEventType2_fnEventHandlerS_[ fromEventType ] ).length );

        }
      },

      /*$$keys: function ( intoLson, fromLson ) {

        LAID.$meta.inherit.$$keys( intoLson, fromLson );
      },*/

      $$max: function ( intoLson, fromLson ) {
        LAID.$meta.inherit.$$max( intoLson, fromLson );
      },

    };

  })();

(function() {
  "use strict";


  LAID.$meta = {


    set: function ( lson, metaDomain, attr, val  ) {

      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        lson[ fullMetaDomain ] = {};
      }
      lson[ fullMetaDomain ][ attr ] = val;

    },

    get: function ( lson, metaDomain, attr  ) {
    
      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        return undefined;
      } else {
        return lson[ fullMetaDomain ][ attr ];
      }
    },

    inherit: {
      /*
      $$keys: function ( intoLson, fromLson ) {

        var
        fromAttr2keyS = fromLson.$$keys,
        intoAttr2keyS = intoLson.$$keys,
        fromAttr,
        fromKeyS,
        intoKeyS,
        i, len;


        if ( intoAttr2keyS === undefined ) {
          intoAttr2keyS = intoLson.$$keys = {};
        }

        for ( fromAttr in fromAttr2keyS ) {
            fromKeyS = fromAttr2keyS[ fromAttr ];
            intoKeyS = intoAttr2keyS[ fromAttr ];
            if ( intoKeyS === undefined ) {
              intoAttr2keyS[ fromAttr ] = LAID.$arrayUtils.cloneSingleLevel( fromKeyS );
            } else {
              for ( i = 0, len = fromKeyS.length; i < len; i++ ) {
                LAID.$arrayUtils.pushUnique( intoKeys, fromKeyS[ i ] );
              }
          }
        }
      },
      */

      $$max: function ( intoLson, fromLson ) {

        var
          fromAttr2max = fromLson.$$max,
          intoAttr2max = intoLson.$$max,
          fromAttr;



        if ( intoAttr2max === undefined ) {
          intoAttr2max = intoLson.$$max = {};
        }

        for ( fromAttr in fromAttr2max ) {
            if ( intoAttr2max[ fromAttr ] === undefined ) {
              intoAttr2max[ fromAttr ] =
              fromAttr2max[ fromAttr ];
            } else {
              intoAttr2max[ fromAttr ] = Math.max(
                intoAttr2max[ fromAttr ],
                fromAttr2max[ fromAttr ]
              );
            }
        }
      },




    }
  };

})();

(function () {
  "use strict";

  var normalizedExternalLsonS = [];

  /*
  * Rules of a state name:
  * (1) Must only contain alphanumeric characters, the underscore ("_"), or the hyphen ("-")
  * (2) Must contain atleast one character
  * (3) Must not be any of the following: {"root", "transition", "data", "when", "state"}
  */
  function checkIsValidStateName( stateName ) {

    return ( ( /^[\w\-]+$/ ).test( stateName ) ) &&
    ( ( [ "root", "transition", "data", "when", "state",
     "inherits", "observe", "interface", "many" ] ).
    indexOf( stateName ) === -1 );
  }

  LAID.$normalize = function( lson, isExternal ) {

    if ( isExternal ) {

      // If we haven't previously normalized it, only then proceed
      if ( normalizedExternalLsonS.indexOf( lson ) === -1 ) {

        _normalize( lson, true );
        normalizedExternalLsonS.push( lson );

      }

    } else {
      _normalize( lson, false );

    }
  };

  function _normalize( lson, isRecursive ) {

    var rootProp2val, stateProp2val, stateName2state, stateName,
    multipleTypeProp, multipleTypePropNumName;


    //key2fnNormalize.type( lson );
    key2fnNormalize.inherits( lson );
    key2fnNormalize.many( lson );

    key2fnNormalize.props( lson );
    key2fnNormalize.transition( lson );
    key2fnNormalize.when( lson );
    key2fnNormalize.states( lson );

    rootProp2val = lson.props;

    rootProp2val.centerX = takeLeftToCenterX;
    rootProp2val.right = takeLeftToRight;
    rootProp2val.centerY = takeTopToCenterY;
    rootProp2val.bottom = takeTopToBottom;

    // Recurse to normalize children
    if ( isRecursive ) {

      key2fnNormalize.children( lson );

    }
  }




  function checkAndThrowErrorAttrAsTake ( name, val ) {
    if ( val instanceof LAID.Take ) {
      throw ( "LAID Error: takes for special/expander props such as '" + name  + "' are not permitted." );
    }
  }





  /*
  * Recursively flatten the prop if object or array typed
  */
  function flattenProp( props, obj, key, prefix ) {

    var val, type, flattenedProp;
    val = obj[ key ];
    type = LAID.type( val );
    if ( type === "array" ) {
      for ( var i = 0, len = val.length; i < len; i++ ) {
        flattenedProp = prefix + ( i + 1 );
        flattenProp( props, val, i, flattenedProp );
      }
      obj[ key ] = undefined;

    } else if ( type === "object" && !( val instanceof LAID.Color ) && !( val instanceof LAID.Take ) ) {

      for ( var subKey in val ) {

        flattenedProp = prefix + LAID.$capitalize( subKey );
        flattenProp( props, val, subKey, flattenedProp );

        obj[ key ] = undefined;
      }

    } else {

      if ( LAID.$checkIsExpanderAttr( prefix ) ) {
        checkAndThrowErrorAttrAsTake( prefix, val );
      }

      props[ prefix ] = val;

    }
  }







  var fnCenterToPos = function( center, dim ) {
    return center - ( dim / 2 );
  };

  var fnEdgeToPos = function( edge, dim ) {
    return edge - ( dim );
  };

  var fnPosToCenter = function( pos, dim ) {
    return pos + ( dim / 2 );
  };

  var fnPosToEdge = function( pos, dim ) {
    return pos + ( dim );
  };


  var takeLeft = new LAID.Take( "this", "left" );
  var takeWidth = new LAID.Take( "this", "width" );
  var takeTop = new LAID.Take( "this", "top" );
  var takeHeight = new LAID.Take( "this", "height" );


  var takeLeftToCenterX = new LAID.Take( fnPosToCenter ).fn( takeLeft, takeWidth );
  var takeLeftToRight = new LAID.Take( fnPosToEdge ).fn( takeLeft, takeWidth );
  var takeTopToCenterY = new LAID.Take( fnPosToCenter ).fn( takeTop, takeHeight );
  var takeTopToBottom = new LAID.Take( fnPosToEdge ).fn( takeTop, takeHeight );




  var key2fnNormalize = {
    /*type: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "type", lson.type );

      if ( lson.type === undefined ) {
        // check if text type
        var isTextType = false;
        if ( lson.props.text !== undefined ) {
          isTextType = true;
        }
        lson.type = isTextType ? "text" : "none";
      }
      var type = lson.type;
      if ( ( type === "text" ) && ( lson.children !== undefined ) ) {
        throw( "LAID Error: Text type Level with child Levels found" );
      }
      if ( type.startsWith( "input" ) ) {
        lson.type = "input";
        lson.inputType = type.slice( ( "input:" ).length );
      }

    },*/

    inherits: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "inherits", lson.inherits );
      if ( ( lson.inherits !== undefined ) &&
        LAID.type( lson.inherits ) !== "array" ) {
          lson.inherits = [ lson.inherits ];
        }

    },

    interface: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "interface", lson.interface );

    },

    /*
    * normalize the `lson`
    */
    props: function( lson ) {

      var prop2val = lson.props,
      prop, val,
      longhandPropS, longhandProp, shorthandVal,
      multipleTypePropMatchDetails,curMultipleMax,
      i, len;


      if ( lson.props === undefined ) {

        prop2val = lson.props = {};

      }

      checkAndThrowErrorAttrAsTake( "props", lson.props );


      if ( prop2val.centerX !== undefined ) {
        prop2val.left = ( new LAID.Take( fnCenterToPos ) ).fn( prop2val.centerX, takeWidth );
      }

      if ( prop2val.right !== undefined ) {
        prop2val.left = ( new LAID.Take( fnEdgeToPos ) ).fn( prop2val.right, takeWidth );
      }

      if ( prop2val.centerY !== undefined ) {
        prop2val.top = ( new LAID.Take( fnCenterToPos ) ).fn( prop2val.centerY, takeHeight );
      }

      if ( prop2val.bottom !== undefined ) {
        prop2val.top = ( new LAID.Take( fnEdgeToPos ) ).fn( prop2val.bottom, takeHeight );
      }

      for ( prop in prop2val ) {
        flattenProp( prop2val, prop2val, prop, prop );
      }


      for ( prop in prop2val ) {
        longhandPropS = LAID.$shorthandPropsUtils.getLonghandPropsDecenteralized( prop );
        if ( longhandPropS !== undefined ) {
          shorthandVal = prop2val[ prop ];
          for ( i = 0, len = longhandPropS.length; i < len; i++ ) {
            longhandProp = longhandPropS[ i ];
            prop2val[ longhandProp ] = prop2val[ longhandProp ] ||
            shorthandVal;

          }
        }
      }

      for ( prop in prop2val ) {
        multipleTypePropMatchDetails =
          LAID.$findMultipleTypePropMatchDetails( prop );
        if ( multipleTypePropMatchDetails !== null ) {
          curMultipleMax =
            LAID.$meta.get( lson, "max", multipleTypePropMatchDetails[ 1 ] );
          if ( ( curMultipleMax === undefined ) ||
            ( curMultipleMax < parseInt( multipleTypePropMatchDetails[ 2 ] ) ) ) {
            LAID.$meta.set( lson, "max", multipleTypePropMatchDetails[ 1 ],
              parseInt( multipleTypePropMatchDetails[ 2 ] ) );
          }
        }
      }
    },

  when: function ( lson ) {

    if ( lson.when === undefined ) {
      lson.when = {};
    } else {
      checkAndThrowErrorAttrAsTake( "when", lson.when );

      var eventType2_fnCallbackS_, eventType, fnCallbackS, i, len;


      for ( eventType in eventType2_fnCallbackS_ ) {
        fnCallbackS = eventType2_fnCallbackS_[ eventType ];
        checkAndThrowErrorAttrAsTake( "when." + eventType,
        fnCallbackS );
        //LAID.$meta.set( lson, "num", "when." + eventType, fnCallbackS.length );
      }
    }
  },
/*
data: function ( lson ) {
// normalize color here

var key2value = lson.data;

for ( var key in key2value ) {


if ()

}


},
*/

  transition: function( lson ) {


    if ( lson.transition === undefined ) {
      lson.transition = {};
    } else {
      var transitionProp, transitionDirective,
      transitionArgKey2val, transitionArgKey, transitionArgKeyS,
      transition = lson.transition,
      defaulterProp, defaultedPropS, defaultedProp, i, len;

      if ( transition !== undefined ) {
        checkAndThrowErrorAttrAsTake( "transition", lson.transition );

        if ( transition.centerX !== undefined ) {
          transition.left =
          transition.centerX;
        }
        if ( transition.right !== undefined ) {
          transition.left =
          transition.right;
        }
        if ( transition.centerY !== undefined ) {
          transition.top =
          transition.centerY;
        }
        if ( transition.bottom !== undefined ) {
          transition.top =
          transition.bottom;
        }

        for ( transitionProp in transition ) {
          if ( LAID.$checkIsExpanderAttr( transitionProp ) ) {
            throw ( "LAID Error: transitions for special/expander props such as '" + name  + "' are not permitted." );
          }
          transitionDirective = transition[ transitionProp ];
          checkAndThrowErrorAttrAsTake( "transition." + transitionProp,
          transitionDirective  );

          transitionArgKey2val = transitionDirective.args;
          if ( transitionArgKey2val !== undefined ) {

            checkAndThrowErrorAttrAsTake( "transition." + transitionProp + ".args",
            transitionArgKey2val  );

            /*transitionArgKeyS = [];
            for ( transitionArgKey in transitionArgKey2val ) {
              transitionArgKeyS.push( transitionArgKey );
            }*/
            //LAID.$meta.set( lson, "keys", "transition." + transitionProp, transitionArgKeyS );
          }

        }
      }
    }
  },

  many: function ( lson ) {

    if ( lson.many !== undefined ) {
      var many = lson.many;
      checkAndThrowErrorAttrAsTake( "many", many );

      key2fnNormalize.inherits( many );
      key2fnNormalize.props( many );
      key2fnNormalize.transition( many );
      key2fnNormalize.states( many );

    }
  },

  states: function( lson ) {

    if ( lson.states !== undefined ) {


      var stateName2state = lson.states, state;
      checkAndThrowErrorAttrAsTake( "states",  stateName2state );

      for ( var stateName in stateName2state ) {

        if ( !checkIsValidStateName( stateName ) ) {
          throw ( "LAID Error: Invalid state name: " + stateName );
        }

        state = stateName2state[ stateName ];

        checkAndThrowErrorAttrAsTake( "states." + stateName, state );

        key2fnNormalize.props( state );
        key2fnNormalize.when( state );
        key2fnNormalize.transition( state );

      }
    }
  },


  children: function( lson ) {

    if ( lson.children !== undefined ) {


      var childName2childLson = lson.children;

      for ( var childName in childName2childLson ) {

        _normalize( childName2childLson[ childName ], true );

      }
    }
  }
};

}());


(function(){
  "use strict";
  /* Modified source of: Paul Irish's https://gist.github.com/paulirish/5438650
  And https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
  */
  if ( window.performance === undefined ) {
    window.performance = {};
  }

  if ( window.performance.now === undefined ) {

    if ( Date.now === undefined ) {
      Date.now = function now() {
        return new Date().getTime();
      };
    }
    var nowOffset = Date.now();

    if ( performance.timing !== undefined && performance.timing.navigationStart !== undefined ) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }

})();

( function () {
  "use strict";
  // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  if ( Function.prototype.bind === undefined ) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof fNOP && oThis ?
          this
          : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
      };
    }


})();

(function () {
  "use strict";

  // Non console API compliant browsers will not throw an error
  
  if ( window.console === undefined ) {

    window.console = { error: function () {}, log: function () {}, info: function () {} };

  }

})();


// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this === null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

(function () {
  "use strict";

  if ( String.prototype.startWith === undefined ) {
    String.prototype.startsWith = function ( prefix ) {
      if (this.length < prefix.length)
        return false;
        for (var i = prefix.length - 1; (i >= 0) && (this[i] === prefix[i]); --i)
          continue;
          return i < 0;
        };
  }

})();

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
  "use strict";
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                   window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

( function () {
  "use strict";


  /*
  * Optional argument of `timeNow`
  * which represent the previous time frame
  */
  LAID.$render = function ( timeNow ) {
    if ( !LAID.$isRequestedForAnimationFrame && ( LAID.$renderDirtyLevelS.length !== 0 ) ) {
      LAID.$prevTimeFrame = timeNow || performance.now();
      window.requestAnimationFrame( render );
    }
  }

  function render() {

    var
      newPartS = LAID.$newPartS, newPart, newPartLevel,
      curTimeFrame = performance.now(),
      timeFrameDiff = curTimeFrame - LAID.$prevTimeFrame,
      x, y,
      i, len,
      renderDirtyLevelS = LAID.$renderDirtyLevelS,
      renderDirtyLevel,
      renderDirtyAttrValS,
      renderDirtyAttrVal,
      renderDirtyTransition,
      renderCallS, isAttrTransitionComplete;

    console.log( "render" );

    for ( i = 0, len = newPartS.length; i < len; i++ ) {
      newPart = newPartS[ i ];
      newPartLevel = newPart.level;
      if ( newPartLevel.path !== "/" ) {
        newPartLevel.parentLevel.part.node.appendChild( newPart.node );
      }
      if ( newPartLevel.$lson.load ) {
        newPartLevel.$lson.load.call( newPartLevel );
      }
    }

    LAID.$newPartS = [];

    for ( x = 0; x < renderDirtyLevelS.length; x++ ) {

      renderDirtyLevel = renderDirtyLevelS[ x ];
      renderDirtyAttrValS = renderDirtyLevel.$renderDirtyAttrValS;
      renderCallS = [];

      for ( y = 0; y < renderDirtyAttrValS.length; y++ ) {

        isAttrTransitionComplete = true;
        renderDirtyAttrVal = renderDirtyAttrValS[ y ];
        LAID.$arrayUtils.pushUnique( renderCallS, renderDirtyAttrVal.renderCall );
        renderDirtyTransition = renderDirtyAttrVal.transition;

        if ( renderDirtyTransition !== undefined ) { // if transitioning

          if ( renderDirtyTransition.delay && renderDirtyTransition.delay > 0 ) {
            renderDirtyTransition.delay -= timeFrameDiff;
            isAttrTransitionComplete = false;
          } else {
            if ( !renderDirtyTransition.checkIsComplete() ) {
              isAttrTransitionComplete = false;
              if ( renderDirtyAttrVal.calcVal instanceof LAID.Color ) {
                renderDirtyAttrVal.transitionCalcVal =
                  LAID.$generateColorMix( renderDirtyTransition.startCalcValue,
                    renderDirtyAttrVal.calcVal,
                    renderDirtyTransition.generateNext( timeFrameDiff ) );
              } else {
              renderDirtyAttrVal.transitionCalcVal =
                renderDirtyTransition.startCalcValue +
                ( renderDirtyTransition.generateNext( timeFrameDiff ) *
                  ( renderDirtyAttrVal.calcVal -
                     renderDirtyTransition.startCalcValue )
                );
              }

            } else {
              if ( renderDirtyTransition.done !== undefined ) {
                renderDirtyTransition.done.call( renderDirtyLevel );
              }
              renderDirtyAttrVal.transition = undefined;
            }
          }
        }

        if ( isAttrTransitionComplete ) {

          renderDirtyAttrVal.transitionCalcVal =
            renderDirtyAttrVal.calcVal;
          LAID.$arrayUtils.removeAtIndex( renderDirtyAttrValS, y );
          y--;

        }

      }

      // If "text" is to be rendered, it must be
      // rendered last to be able to bear knowledge
      // of the most recent (render) changes to text props
      // such as text padding, text size, and other text props
      // which can affect the dimensions of the part
      if ( LAID.$arrayUtils.remove( renderCallS, "text" ) ) {
        renderCallS.push( "text" );
      }

      // And scroll positions must be affected later
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollX" ) ) {
        renderCallS.push( "scrollX" );
      }
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollY" ) ) {
        renderCallS.push( "scrollY" );
      }

      for ( i = 0, len = renderCallS.length; i < len; i++ ) {
        //console.log("render call: ", renderCallS[ i ] );
        renderDirtyLevel.part[ "$renderFn_" + renderCallS[ i ] ]();
      }

      if ( renderDirtyAttrValS.length === 0 ) {
        LAID.$arrayUtils.removeAtIndex( renderDirtyLevelS, x );
        x--;
      }
    }

    LAID.$isRequestedForAnimationFrame = false;

    LAID.$render( curTimeFrame );


  }


})();

( function () {
  "use strict";

  var
  shorthandProp2_longhandPropS_,
  longhandPropS,
  centeralizedShorthandPropS;

  shorthandProp2_longhandPropS_ = {

    positional: [ "left",
    "top",
    "z",
    "shiftX", "shiftY",
    "scaleX", "scaleY", "scaleZ",
    "rotateX", "rotateY", "rotateZ",
    "skewX", "skewY"
    ],
    origin: [ "originX", "originY" ],
    backgroundPosition: [ "backgroundPositionX", "backgroundPositionY" ],
    backgroundSize: [ "backgroundSizeX", "backgroundSizeY" ],


    borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth" ],
    borderColor: [ "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor" ],
    borderStyle: [ "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle" ],
    textPadding: [ "textPaddingTop", "textPaddingRight", "textPaddingBottom", "textPaddingLeft" ],
    cornerRadius: [ "cornerRadiusTopLeft", "cornerRadiusTopRight", "cornerRadiusBottomRight", "cornerRadiusBottomLeft" ]

  };

  // Centralized shorthand props are those props which
  // have same render calls (almost akin to css properties)
  // for each shorthand property

  centeralizedShorthandPropS = [
    "positional", "origin", "backgroundPosition", "backgroundSize"
  ];

  longhandPropS = ( function () {
    var
    longhandPropS = [],
    shorthandProp,
    i, len;

    for ( shorthandProp in shorthandProp2_longhandPropS_ ) {
      longhandPropS = longhandPropS.concat( shorthandProp2_longhandPropS_[ shorthandProp ] );
    }
    return longhandPropS;
  })();

  LAID.$shorthandPropsUtils = {
    getLonghandProps: function ( shorthandProp ) {
      return shorthandProp2_longhandPropS_[ shorthandProp ];
    },
    getLonghandPropsDecenteralized: function ( shorthandProp ) {
      if ( centeralizedShorthandPropS.indexOf( shorthandProp ) === -1 ) {
        return shorthandProp2_longhandPropS_[ shorthandProp ];
      } else {
        return undefined;
      }
    },
    getShorthandProp: function ( longhandProp ) {
      var shorthandProp;
      if ( longhandPropS.indexOf( longhandProp ) !== -1 ) {
        for ( shorthandProp in shorthandProp2_longhandPropS_ ) {
          if ( shorthandProp2_longhandPropS_[ shorthandProp ].indexOf( longhandProp ) !== -1 ) {
            return shorthandProp;
          }
        }
      }
      return undefined;
    },
    getShorthandPropCenteralized:  function ( longhandProp ) {
      var shorthandProp = LAID.$shorthandPropsUtils.getShorthandProp( longhandProp );
      if ( shorthandProp !== undefined && centeralizedShorthandPropS.indexOf( shorthandProp ) !== -1 ) {
        return shorthandProp;
      } else {
        return undefined;
      }
    },

    checkIsDecentralizedShorthandProp: function ( shorthandProp ) {
      return shorthandProp2_longhandPropS_[ shorthandProp ] !== undefined &&
        centeralizedShorthandPropS.indexOf( shorthandProp ) === -1;
    }

  };


})();

( function () {
  "use strict";
  LAID.$solveForNew = function () {

    var i, len,
    isSolveProgressed,
    newLevelS = LAID.$newLevelS,
    solvedLevelS = [];

    LAID.$isSolvingNewLevels = true;

    do {
      isSolveProgressed = false;
      for ( i = 0; i < newLevelS.length; i++ ) {
        if ( newLevelS[ i ].$inheritAndReproduce() ) {
          isSolveProgressed = true;
          solvedLevelS.push( newLevelS[ i ] );
          LAID.$arrayUtils.removeAtIndex( newLevelS, i );
          i--;
        }
      }
      // The reason we will not use `len` to check the length below is
      // that more recalculate dirty levels could have been added during
      // the loop
    } while ( ( newLevelS.length !== 0 ) && isSolveProgressed );

    if ( newLevelS.length !== 0 ) {
      throw "LAID Error: Circular/Undefined Inherit Reference Encountered";
    }

    LAID.$isSolvingNewLevels = false;

    for ( i = 0, len = solvedLevelS.length; i < len; i++ ) {
      solvedLevelS[ i ].$initAllAttrs();
    }

    LAID.$solveForRecalculation();

  };

})();

( function () {
  "use strict";
  LAID.$solveForRecalculation = function () {


    var i, j, len, jLen,
    isSolveProgressed,
    ret,
    recalculateDirtyLevelS = LAID.$recalculateDirtyLevelS,
    newlyInstalledStateLevelS = LAID.$newlyInstalledStateLevelS,
    newlyInstalledStateLevel,
    newlyInstalledStateS,
    fnNewlyInstalledStateInstall,
    newlyUninstalledStateLevelS = LAID.$newlyUninstalledStateLevelS,
    newlyUninstalledStateLevel,
    newlyUninstalledStateS,
    fnNewlyUninstalledStateUninstall;

    console.log("recalculate");
    do {
      isSolveProgressed = false;
      for ( i = 0; i < recalculateDirtyLevelS.length; i++ ) {
        ret = recalculateDirtyLevelS[ i ].$solveForRecalculation();
        if ( ret !== 3 ) {
          isSolveProgressed = true;
          if ( ret === 1 ) {
            LAID.$arrayUtils.removeAtIndex( recalculateDirtyLevelS, i );
            i--;
          }
        }
      }
      // The reason we will not use `len` to check the length below is
      // that more recalculate dirty levels could have been added during
      // the loop
    } while ( ( recalculateDirtyLevelS.length !== 0 ) && isSolveProgressed );

    if ( recalculateDirtyLevelS.length !== 0 ) {
      throw "LAID Error: Circular/Undefined Reference Encountered";
    }

    for ( i = 0, len = newlyInstalledStateLevelS.length; i < len; i++ ) {
      newlyInstalledStateLevel = newlyInstalledStateLevelS[ i ];
      newlyInstalledStateS = newlyInstalledStateLevel.$newlyInstalledStateS;
      for ( j = 0, jLen = newlyInstalledStateS.length; j < jLen; j++ ) {
        fnNewlyInstalledStateInstall =
          newlyInstalledStateLevel.$attr2attrVal[ newlyInstalledStateS[ j ] + ".install" ];
        fnNewlyInstalledStateInstall &&
         ( LAID.type(fnNewlyInstalledStateInstall.transitionCalcVal) === "function") &&
          fnNewlyInstalledStateInstall.transitionCalcVal.call( this );
      }
      // empty the list
      newlyInstalledStateLevel.$newlyInstalledStateS = [];
    }
    LAID.$newlyInstalledStateLevelS = [];

    for ( i = 0, len = newlyUninstalledStateLevelS.length; i < len; i++ ) {
      newlyUninstalledStateLevel = newlyUninstalledStateLevelS[ i ];
      newlyUninstalledStateS = newlyUninstalledStateLevel.$newlyUninstalledStateS;
      for ( j = 0, jLen = newlyUninstalledStateS.length; j < jLen; j++ ) {
        fnNewlyUninstalledStateUninstall =
        newlyUninstalledStateLevel.$attr2attrVal[ newlyUninstalledStateS[ j ] + ".uninstall" ];
        fnNewlyUninstalledStateUninstall &&
        ( LAID.type( fnNewlyUninstalledStateUninstall.transitionCalcVal) === "function") &&
         fnNewlyUninstalledStateUninstall.transitionCalcVal.call( this );
      }
      // empty the list
      newlyUninstalledStateLevel.$newlyUninstalledStateS = [];
    }
    LAID.$newlyUninstalledStateLevelS = [];

    LAID.$render();

  };

})();

( function () {
  "use strict";



  LAID.$transitionType2args = {
    "linear": [],
    "cubic-bezier": [ "a", "b", "c", "d" ],

  };




})();
