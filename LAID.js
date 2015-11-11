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

    // version is a method in order
    // to maintain the consistency of
    // only method accesses from the user
    version: function(){ return 1; },

    
    $pathName2level: {},
    $cloggedLevelS: [],

    $newlyInstalledStateLevelS: [],
    $newlyUninstalledStateLevelS: [],
    $newLevelS: [],
    $recalculateDirtyLevelS: [],
    $renderDirtyPartS: [],
    $prevFrameTime: 0,
    $newManyS: [],

    $isClogged:false,
    $isSolving: false,
    $isRequestedForAnimationFrame: false,
    $isSolveRequiredOnRenderFinish: false,

    $isDataTravellingShock: false,
    $isDataTravelling: false,
    $dataTravelDelta: 0.0,
    $dataTravellingLevel: undefined,
    $dataTravellingAttrInitialVal: undefined,
    $dataTravellingAttrVal: undefined



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
    this.prevVal = undefined;
    this.isTaken = undefined;
    this.attr = attr;
    this.isRecalculateRequired = true;

    this.calcVal = undefined;
    this.transitionCalcVal = undefined;
    this.startCalcVal = undefined;
    this.transition = undefined;
    this.isTransitionable = false;

    this.isForceRecalculate = false;
    // if the attr is of "<state>.onlyif"
    // the below will store the state name <state>
    this.onlyIfStateName = getStateNameOfOnlyIf( attr );

    this.isStateProjectedAttr = checkIsStateProjectedAttr( attr );
    this.isEventReadonlyAttr =
      LAID.$eventReadonlyUtils.checkIsEventReadonlyAttr( attr );
    this.renderCall =
      level && ( level.isPart ) && ( LAID.$findRenderCall( attr ) );

    this.takerAttrValS = [];

    this.eventReadonlyEventType2boundFnHandler = {};

  }

  /*
  * For attrs which are of type state ( i.e state.<name> )
  * Return the name component.
  * Else return the empty string.
  */
  function getStateNameOfOnlyIf ( attr ) {
    var match = attr.match( /^([\w\-:]+).onlyif$/ );

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
    attr.slice( 5, attr.length - 2 ) : "";

  }

  function getTransitionPropOfAttrTransition( attr ) {

      return  attr.startsWith( "transition." ) ?
        attr.slice( 11, attr.indexOf(".", 11 ) ) : "";

  }


  function checkIsStateProjectedAttr( attr ) {
    var i = attr.indexOf( "." );
    if ( LAID.$checkIsValidUtils.propAttr( attr ) ) {
      return true;
    } else if ( 
      [ "formation", "filter", "sort", "ascending" ].indexOf ( attr ) !== -1 ) {
      return true;
    } else {
      var prefix = attr.slice( 0, i );
      return ( ( [ "when", "transition", "fargs", "sort", "$$num", "$$max" ] ).indexOf(
         prefix ) !== -1 );
    }
  }




  /* TODO: update this doc below along with its slash-asterisk
  formatting

  Returns true if the value is different,
  false otherwise */
  LAID.AttrVal.prototype.update = function ( val ) {
     
    this.val = val;
    if ( !LAID.$identical( val, this.prevVal ) ) {
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
    if ( this.level ) { // check for empty level
      this.level.addRecalculateDirtyAttrVal( this );
    }
  };

  /*
  * Force the level corresponding to the given AttrVal
  * to recalculate this AttrVal.
  */
  LAID.AttrVal.prototype.forceRecalculation = function () {

    this.isForceRecalculate = true;
    this.requestRecalculation();
  };


  LAID.AttrVal.prototype.checkIsTransitionable = function () {

    return this.renderCall &&
      ( this.startCalcVal !== this.calcVal ) &&
      (
        (
          ( typeof this.startCalcVal === "number" )
            &&
          ( typeof this.calcVal === "number" )
        )
          ||
        (
          ( this.startCalcVal instanceof LAID.Color  )
              &&
          ( this.calcVal instanceof LAID.Color )
        )
      ) &&
      this.attr !== "zIndex";


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
      recalcVal,
      level = this.level,
      part = level.part,
      many = level.many,
      attr = this.attr,
      i, len; 

    //console.log("update", level.pathName, attr, this.val );

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

      recalcVal = this.val.execute( this.level );
      if ( !LAID.$identical( recalcVal, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = recalcVal;
      }
    } else {
      if ( !LAID.$identical( this.val, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = this.val;
      }
    }

    if ( attr === "$all" || attr === "$filtered" ) {
      isDirty = true;
    }

    if ( this.isForceRecalculate ) {
      isDirty = true;
    }

    switch ( attr ) {
      case "scrollX":
         this.transitionCalcVal =
             this.level.part.node.scrollLeft;      
        if ( level.attr2attrVal.$scrolledX ) {
          level.$changeAttrVal( "$scrolledX",
           this.calcVal );
        }
        isDirty = true;
        break;
      case "scrollY":
         this.transitionCalcVal =
             this.level.part.node.scrollTop;
        if ( level.attr2attrVal.$scrolledY ) {
          level.$changeAttrVal( "$scrolledY",
           this.calcVal );
        }
        isDirty = true;
        break;
      case "input":
        if ( level.attr2attrVal.$input ) {
          level.$changeAttrVal( "$input",
           this.calcVal );
        }
        isDirty = true;
        break;
      case "rows":
        isDirty = true;
        break; 
    }


    if ( isDirty ) {
      var
        stateName = this.onlyIfStateName,
        whenEventType = getWhenEventTypeOfAttrWhen( attr ),
        transitionProp = getTransitionPropOfAttrTransition( attr );

      this.prevVal = this.val;

      for ( i = 0, len = this.takerAttrValS.length; i < len; i++ ) {
        this.takerAttrValS[ i ].requestRecalculation();
      }

      if ( level.derivedMany ) {
        level.derivedMany.level.attr2attrVal.$all.requestRecalculation();
        if ( level.attr2attrVal.$f.calcVal !== -1 ) {
          level.derivedMany.level.attr2attrVal.$filtered.requestRecalculation();
       }
      }

      if ( LAID.$isDataTravellingShock ) {

        part.addTravelRenderDirtyAttrVal( this );

      }

      if ( this.renderCall ) {
        this.startCalcVal = this.transitionCalcVal;
        this.isTransitionable = this.checkIsTransitionable();


        if ( !LAID.$isDataTravellingShock ) {
          part.addNormalRenderDirtyAttrVal( this );
        }

        switch ( attr ) {
          case "text":
            part.updateNaturalHeightFromText();
            part.updateNaturalWidthFromText();
            break;
          case "$input":
            part.updateNaturalWidthInput();
            part.updateNaturalHeightInput();
            break;
          case "inputRows":
            part.updateNaturalWidthInput();
            part.updateNaturalHeightInput();
            break;
          case "width":
            if ( part.isInputText ) {
              part.updateNaturalHeightInput();              
            } else if ( level.attr2attrVal.text ) {
              part.updateNaturalHeightFromText();
            }
            break;
          case "left":
            part.updateAbsoluteX();
            break;
          case "shiftX":
            part.updateAbsoluteX();
            break;
          case "top":
            part.updateAbsoluteY();
            break;
          case "shiftY":
            part.updateAbsoluteY();
            break;
        

          default:
            var checkIfAttrNotAffectTextDimesion  = function ( attr ) {
              return 
                ( ( [ "textDecoration",
                  "textColor", "textSmoothing" ] ).indexOf(
                 attr ) !== -1 )
                ||
                attr.startsWith("textShadow");

            }
            if ( attr.startsWith( "text" ) &&
              !checkIfAttrNotAffectTextDimesion( attr ) )  {

              var childLevelS = level.childLevelS;

              if ( childLevelS.length ) {
                // A CSS text styling inherit taking
                // place must have all the children
                // levels (parts) notified.
                for ( var i = 0, len = childLevelS.length,
                    childPart;
                    i < len; i++ ) {
                  childPart = childLevelS[ i ].part;
                  if ( childPart ) {
                    if ( childPart.isInputText ) {
                      childPart.updateNaturalWidthInput(); 
                      childPart.updateNaturalHeightInput(); 
                    } else {
                      childPart.updateNaturalWidthFromText();
                      childPart.updateNaturalHeightFromText();
                    }
                  }
                }
              } else {
                if ( part.isInputText ) {
                  part.updateNaturalWidthInput(); 
                  part.updateNaturalHeightInput(); 
                } else {
                  part.updateNaturalWidthFromText();
                  part.updateNaturalHeightFromText();
                }
              }     
            } else if ( ( attr === "borderTopWidth" ) ||
              ( attr === "borderBottomWidth" ) ) {

                part.updateNaturalHeightFromText();
            } else if ( ( attr === "borderLeftWidth" ) ||
              ( attr === "borderRightWidth" ) ) {
              part.updateNaturalWidthFromText();
              part.updateNaturalHeightFromText();
            }

        }

        // In case there exists a transition
        // for the given prop then update it
        part.updateTransitionProp( attr );

      } else if ( stateName !== "" ) {
        if ( this.calcVal ) { // state
          if ( LAID.$arrayUtils.pushUnique( level.stateS, stateName ) ) {
            level.$updateStates();
            // remove from the list of uninstalled states (which may/may not be present within)
            LAID.$arrayUtils.remove( level.newlyUninstalledStateS, stateName );
            // add state to the list of newly installed states
            LAID.$arrayUtils.pushUnique( level.newlyInstalledStateS, stateName );
            // add level to the list of levels which have newly installed states
            LAID.$arrayUtils.pushUnique( LAID.$newlyInstalledStateLevelS, level );
          }
        } else { // remove state
          if ( LAID.$arrayUtils.remove( level.stateS, stateName ) ) {

            level.$updateStates();
            // remove from the list of installed states (which may/may not be present within)
            LAID.$arrayUtils.remove( level.newlyInstalledStateS, stateName );
            // add state to the list of newly uninstalled states
            LAID.$arrayUtils.pushUnique( level.newlyUninstalledStateS, stateName );
            // add level to the list of levels which have newly uninstalled states
            LAID.$arrayUtils.pushUnique( LAID.$newlyUninstalledStateLevelS, level );
          }
        }
      } else if ( whenEventType !== "" ) {
        part.updateWhenEventType( whenEventType );
      } else if ( transitionProp !== "" ) {
        part.updateTransitionProp( transitionProp );
      } else if ( many ) {
        if ( this.attr === "rows" ) {
          many.updateRows();
        } else if ( attr === "filter" ) {
          many.updateFilter();
        } else if ( attr.startsWith( "sort.") ) {
          many.updateRows();
        } else if ( attr.startsWith("args.") ||
           attr === "formation" ) {
          many.updateFilteredPositioning();
        }
          
      } else {  
        switch( attr ) {
          case "right":
            if ( level.parentLevel !== undefined ) {
             level.parentLevel.part.
              updateNaturalWidthFromChild( level );
            }
            break;
          case "bottom":
            if ( level.parentLevel !== undefined ) {
              level.parentLevel.part.
                updateNaturalHeightFromChild( level );

            }
            break;
          case "$naturalWidth":
            if ( this.level.attr2attrVal.scrollX ) {
              var self = this;
              setTimeout(function(){
                self.level.attr2attrVal.scrollX.
                  requestRecalculation();
                LAID.$solve();
              });
            }
            break;
          case "$naturalHeight":

            if ( this.level.attr2attrVal.scrollY ) {
              var self = this;
              setTimeout(function(){
                self.level.attr2attrVal.scrollY.
                  requestRecalculation();
                LAID.$solve();
              });
            }
            break;
        }
      }
    }
    this.isForceRecalculate = false;
    this.isRecalculateRequired = false;
    return true;
  };

  LAID.AttrVal.prototype.give = function ( attrVal ) {
    if ( LAID.$arrayUtils.pushUnique( this.takerAttrValS, attrVal ) &&
     this.takerAttrValS.length === 1 ) {
      if ( this.isEventReadonlyAttr ) {
        /*if ( !this.level.part.isInputText &&
            ( this.attr === "$naturalWidth" ||
              this.attr === "$naturalHeight" ) ) {
          return;
        }*/
        // Given that a reference exists, add event listeners
        var
          eventType2fnHandler = LAID.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
          eventType,
          fnBoundHandler;
        for ( eventType in eventType2fnHandler ) {
          fnBoundHandler =
           eventType2fnHandler[ eventType ].bind( this.level );
          LAID.$eventUtils.add( this.level.part.node, eventType, fnBoundHandler );

          this.eventReadonlyEventType2boundFnHandler[ eventType ] =
           fnBoundHandler;
        }
      }
    }
  };

  LAID.AttrVal.prototype.giveNot = function ( attrVal ) {
    if ( LAID.$arrayUtils.remove( this.takerAttrValS, attrVal ) && this.takerAttrValS.length === 0 ) {
      if ( this.isEventReadonlyAttr ) {
        /*if ( !this.level.part.isInputText &&
            ( this.attr === "$naturalWidth" ||
              this.attr === "$naturalHeight" ) ) {
          return;
        }*/
        // Given that no reference exists, remove event listeners
        var
         eventType2fnHandler =
         LAID.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
         eventType,
         fnBoundHandler;
        for ( eventType in eventType2fnHandler ) {
          fnBoundHandler = this.eventReadonlyEventType2boundFnHandler[ eventType ];
          LAID.$eventUtils.remove( this.level.part.node, eventType, fnBoundHandler );
          this.eventReadonlyEventType2boundFnHandler[ eventType ] =
           undefined;
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

        if ( ( level.attr2attrVal[ attr ] === undefined ) )  {
          level.$createLazyAttr( attr );
          return false;
        }

        if ( level.attr2attrVal[ attr ].isRecalculateRequired ) {
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

      var _relPath00attr_S, i, len, takingLevel, takingAttrVal;

      if ( !( this.val instanceof LAID.Take ) ) {
        return false;
      } else {
        _relPath00attr_S = this.val._relPath00attr_S;
        for ( i = 0, len = _relPath00attr_S.length; i < len; i++ ) {
          takingLevel = ( _relPath00attr_S[ i ][ 0 ] ).resolve( this.level );
          // possbility of level having being removed
          if ( !takingLevel ) { return false; }
          takingAttrVal = takingLevel.$getAttrVal( _relPath00attr_S[ i ][ 1 ] );
          if ( takingLevel &&
              takingAttrVal &&
             ( takingAttrVal.checkIsDependentOnAttrVal( attrVal ) ) ) {
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
      rgb = this.getRgb();
      return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";

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

( function () {
  "use strict";



  LAID.Level = function ( path, lson, parent, derivedMany, row, id ) {

    this.pathName = path;
    this.lson = lson;

    this.parentLevel = parent; // parent Level
    this.attr2attrVal = {};

    // True if the Level is a Part Level,
    // false if the Level is a Many Level.
    this.isPart = undefined;

    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.part = undefined;
    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.many = undefined;


    // If the Level is derived from a Many
    // then this.derivedMany will hold
    // a reference to the Many
    this.derivedMany = derivedMany;

    // If the Level is derived from a Many Level
    // this will be the id by which it is referenced
    this.id = id;

    // If the Level is derived from a Many Level
    // this will contain the row information will
    // be contained within below
    this.row = row;

    this.isNormalized = false;
    this.isInherited = false;

    this.recalculateDirtyAttrValS = [];

    this.childLevelS = [];

    this.stateS = [ "root" ];
    this.stringHashedStates2_cachedAttr2val_ =  {};
    this.newlyInstalledStateS = [];
    this.newlyUninstalledStateS = [];

  };

  LAID.Level.prototype.$init = function () {

    LAID.$pathName2level[ this.pathName ] = this;

    // Check is this is many derived level,
    // if it is not then add it to the queue
    // of levels for the "$inherit" key to be
    // executed.
    // If so then we can proceed doing nothing as
    // the level already has its LSON inherited
    // through its derived many level.
    
    if ( !LAID.$isClogged ) {
      LAID.$newLevelS.push( this );
    } else {
      LAID.$cloggedLevelS.push( this );
    }
   
  };


  LAID.Level.prototype.level = function ( relativePath ) {

    return ( new LAID.RelPath( relativePath ) ).resolve( this );
  };

  LAID.Level.prototype.parent = function () {
    return this.parentLevel;
  };

  LAID.Level.prototype.path = function () {
    return this.pathName;
  };


  LAID.Level.prototype.node = function () {

    return this.isPart && this.part.node;
  };

  LAID.Level.prototype.attr = function ( attr ) {

    if ( this.attr2attrVal[ attr ] ) {
       
      return this.attr2attrVal[ attr ].calcVal;

    } else if ( this.$createLazyAttr( attr ) ) {

        LAID.$solve();
        return this.attr2attrVal[ attr ].calcVal;

    } 
  };

  LAID.Level.prototype.data = function ( dataKey, value ) {
    this.$changeAttrVal( "data." + dataKey, value );
  };

  LAID.Level.prototype.row = function ( rowKey, value ) {
    if ( this.derivedMany ) {
      this.$changeAttrVal( "row." + rowKey, value );
      this.derivedMany.id2row[ this.id ][ rowKey ] = value;
      this.derivedMany.level.attr2attrVal.rows.requestRecalculation();
    }
  };

  LAID.Level.prototype.changeNativeInput = function ( value ) {
    var self = this;
    // Set timeout to make sure "evenReadonlyUtils.js"
    // updates strictly before the change of input
    setTimeout(function(){
      self.$changeAttrVal( "$input", value );      
    })
  };

  LAID.Level.prototype.changeNativeScrollX = function ( value ) {
    this.$changeAttrVal( "$scrollX", value );
  };

  LAID.Level.prototype.changeNativeScrollY = function ( value ) {
    this.$changeAttrVal( "$scrollY", value );
  };

  LAID.Level.prototype.manyLevel = function () {

    return this.derivedMany && this.derivedMany.level;
  };

  LAID.Level.prototype.rowsCommit = function ( newRowS ) {

    if ( !this.isPart ) {
      this.many.rowsCommit( newRowS );
    }
  };

  LAID.Level.prototype.rowsMore = function ( newRowS ) {

    if ( !this.isPart ) {
      this.many.rowsMore( newRowS );
    }
  };

  LAID.Level.prototype.rowDelete = function ( id ) {

    if ( !this.isPart ) {
      this.many.rowsDelete( id );
    }
  };

  LAID.Level.prototype.dataTravelBegin = function ( dataKey, finalVal ) {
    var attrVal;
    if ( LAID.$isDataTravelling ) {
      console.error("LAID Warning: Existence of another unfinished data travel");
    } else {
      attrVal = this.attr2attrVal[ "data." + dataKey ];
      if ( attrVal === undefined ) {
        console.error ("LAID Warning: Inexistence of data key for data travel");
      }
      LAID.$isDataTravelling = true;
      LAID.level("/").attr2attrVal.$dataTravelling.update( true );
      LAID.$dataTravellingLevel = this;
      LAID.level("/").attr2attrVal.$dataTravelLevel.update( this );
      LAID.$dataTravellingAttrInitialVal = attrVal.val;
      LAID.$dataTravellingAttrVal = attrVal;

      LAID.$isDataTravellingShock = true;
      attrVal.update( finalVal );
      LAID.$solve();
      LAID.$isDataTravellingShock = false;

    }
  };

  LAID.Level.prototype.dataTravelContinue = function ( delta ) {
    if ( !LAID.$isDataTravelling ) {
      console.error( "LAID Warning: Inexistence of a data travel" );
    } else if ( this !== LAID.$dataTravellingLevel ){
      console.error( "LAID Warning: Inexistence of a data travel for this Level" );
    } else {
      if ( LAID.$dataTravelDelta !== delta ) {
        LAID.$dataTravelDelta = delta;
        LAID.level("/").attr2attrVal.$dataTravelDelta.update( delta );
        LAID.$render();
      }
    }
  };

  LAID.Level.prototype.dataTravelArrive = function ( isArrived ) {
    if ( !LAID.$isDataTravelling ) {
      console.error( "LAID Warning: Inexistence of a data travel" );
    } else {

      LAID.$isDataTravelling = false;
      LAID.level("/").attr2attrVal.$dataTravelling.update( false );
      LAID.$dataTravellingLevel = undefined;
      LAID.level("/").attr2attrVal.$dataTravelLevel.update( null );
      LAID.$dataTravelDelta = 0.0;
      LAID.level("/").attr2attrVal.$dataTravelDelta.update( 0.0 );


      // clear out attrvalues which are data travelling
      LAID.$clearDataTravellingAttrVals();
      if ( !isArrived ) {
        LAID.$dataTravellingAttrVal.update(
          LAID.$dataTravellingAttrInitialVal );
        LAID.$solve();

      } else {

      }

      LAID.$render();
    }
  };



  LAID.Level.prototype.queryAll = function () {
    if ( !this.isPart ) {
      return this.many.queryAll();
    }
  };

  LAID.Level.prototype.queryFiltered = function () {
    if ( !this.isPart ) {
      return this.many.queryFiltered();
    }
  };

  LAID.Level.prototype.addChildren = function ( name2lson ) {

    var childPath, childLevel, name;
    if ( name2lson !== undefined ) {
      for ( name in name2lson ) {

        if ( !LAID.$checkIsValidUtils.levelName( name ) ) {
          throw ( "LAID Error: Invalid Level Name: " + name );
        }

        childPath = this.pathName + ( this.pathName === "/" ? "" : "/" ) + name;
        if ( LAID.$pathName2level[ childPath ] !== undefined ) {
          throw ( "LAID Error: Level already exists with path: " + childPath );
        }
        childLevel = new LAID.Level( childPath, name2lson[ name ], this );
        childLevel.$init();
        this.childLevelS.push( childLevel );

      }
      LAID.$solve();
    }
  };

  LAID.Level.prototype.remove = function () {
      
    if ( this.pathName === "/" ) {
      console.error("LAID Error: Attempt to remove root level prohibited");
    } else {
      this.$remove();
      LAID.$solve();
    }
    
  };

  LAID.Level.prototype.$remove = function () {

    var
     parentLevel = this.parentLevel,
     parentPart = parentLevel.part;


    LAID.$pathName2level[ this.pathName ] = undefined;
    LAID.$arrayUtils.remove( parentLevel.childLevelS, this );
    
    if ( this.isPart ) {
      this.part.remove();
      if ( this.derivedMany ) {
        this.derivedMany.removeLevel( this.level );
      }
    } else {
      this.many.remove();
    }
    

  
  };

  /*
  * Return false if the level could not be inherited (due
  * to another level not being present or started as yet)
  */
  LAID.Level.prototype.$normalizeAndInherit = function () {

    var lson, refS, i, len, ref, level, inheritedAndNormalizedLson;
    if ( !this.isNormalized ) {
      this.isNormalized = true;
      LAID.$normalize( this.lson, false );
    }
    // check if it contains anything to inherit from
    if ( this.lson.$inherit !== undefined ) { 
      lson = { type: "none" };
      refS = this.lson.$inherit;
      for ( i = 0, len = refS.length; i < len; i++ ) {
        
        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference
          if ( ref === this.pathName ) {
            return false;
          }
          level = ( new LAID.RelPath( ref ) ).resolve( this );
          if ( ( level === undefined ) || !level.isInherited ) {
            return false;
          }
        }
      }
      for ( i = 0; i < len; i++ ) {

        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference
          
          level = ( new LAID.RelPath( ref ) ).resolve( this );
          inheritedAndNormalizedLson = level.lson;

        } else { // object reference
           LAID.$normalize( ref, true );
           inheritedAndNormalizedLson = ref;
        }

        LAID.$inherit( lson, inheritedAndNormalizedLson,
         false, false, false );
      }

      LAID.$inherit( lson, this.lson, false, false );
      
      this.lson = lson;
    }

    this.isInherited = true;
    return true;


  };

  LAID.Level.prototype.$identifyAndReproduce = function ( ) {
    this.isPart = this.lson.many === undefined;
//    console.log(this.pathName, this.lson);

    if ( this.isPart ) {
      if ( !this.derivedMany ) {
        LAID.$defaultizePartLson( this.lson );
      }
      this.part = new LAID.Part( this );
      this.part.init();
      
      if ( this.lson.children !== undefined ) {
        this.addChildren( this.lson.children );
      }
    } else {
      var partLson = this.lson;
      this.lson = this.lson.many;
      // deference the "many" key from part lson
      // so as to not to associate with the lson
      // with a many creator
      partLson.many = undefined;
      LAID.$defaultizeManyLson( this.lson );
      this.many = new LAID.Many( this, partLson );
      this.many.init();
      /*if ( this.lson.rows ) {
        this.lson.rows = {level: this, rows: this.lson.rows};
      }*/
    }
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
      attr2val[ attrPrefix + "." + ( i + 1 ) ] = elementS[ i ];
    }
  }

  /* Flatten the slson to attr2val dict */
  function convertSLSONtoAttr2Val( slson, attr2val, isPart ) {

    var
      prop,
      transitionProp, transitionDirective,
      transitionPropPrefix,
      eventType, fnCallbackS,
      prop2val = slson.props,
      when = slson.when,
      transition = slson.transition,
      fargs = slson.fargs,
      i, len;
          
    if ( isPart ){ 
      initAttrsObj( "", slson.props, attr2val );

      for ( transitionProp in transition ) {
        transitionDirective = transition[ transitionProp ];
        transitionPropPrefix =  "transition." + transitionProp + ".";
        if ( transitionDirective.type !== undefined ) {
          attr2val[ transitionPropPrefix + "type" ] =
            transitionDirective.type;
        }
        if ( transitionDirective.duration !== undefined ) {
          attr2val[ transitionPropPrefix + "duration" ] =
            transitionDirective.duration;
        }
        if ( transitionDirective.delay !== undefined ) {
          attr2val[ transitionPropPrefix + "delay" ] =
            transitionDirective.delay;
        }
        if ( transitionDirective.done !== undefined ) {
          attr2val[ transitionPropPrefix + "done" ] =
            transitionDirective.done;
        }
        if ( transitionDirective.args !== undefined ) {
          initAttrsObj( transitionPropPrefix + "args.",
            transitionDirective.args, attr2val );
        }
      }

      for ( eventType in when ) {
        fnCallbackS = when[ eventType ];
        initAttrsArray( "when." + eventType, fnCallbackS, attr2val );
      }

      if ( slson.$$num !== undefined ) {
        initAttrsObj( "$$num.", slson.$$num, attr2val );
      }

      if ( slson.$$max !== undefined ) {
        initAttrsObj(  "$$max.", slson.$$max, attr2val );
      }
    } else {
      if ( fargs ) {
        for ( var formationFarg in fargs ) {
          initAttrsObj( "fargs." + formationFarg + ".",
            fargs[ formationFarg ], attr2val );        
        }
      }

      attr2val.formation = slson.formation;
      attr2val.filter = slson.filter;
      attr2val[ "$$num.sort" ] = slson.sort.length;

      for ( i = 0, len = slson.sort.length; i < len; i++ ) {
        initAttrsObj( "sort." + ( i + 1 ) + ".", slson.sort[ i ],
         attr2val );
      }
      
    }
  }

  LAID.Level.prototype.$initAllAttrs = function () {

    var
      observableReadonlyS = this.lson.$observe ?
       this.lson.$observe : [],
      observableReadonly, i, len;
    
   
    if ( this.pathName === "/" ) {
      var dataTravelReadonlyS = [ "$dataTravelling",
        "$dataTravelLevel", "$dataTravelDelta" ];
      if ( observableReadonlyS ) {
        observableReadonlyS = observableReadonlyS.concat(
          dataTravelReadonlyS );
      } else {
        observableReadonlyS = dataTravelReadonlyS;
      }
    }

    if ( this.isPart ) {
      if ( this.lson.states.root.props.scrollX ) {
        observableReadonlyS.push( "$naturalWidth" );
      }
      if ( this.lson.states.root.props.scrollY ) {
        observableReadonlyS.push( "$naturalHeight" );
      }
      
      if ( this.part.isInputText ) {
        // since there is a high probability
        // that the user will reference $input
        // whilst using an input:line, input:textarea
        // the "$input" property will observed
        // by default
        observableReadonlyS.push( "$input" );
      }
    }

    if ( observableReadonlyS.length ) {
      for ( i = 0, len = observableReadonlyS.length; i < len; i++ ) {
        observableReadonly = observableReadonlyS[ i ];
        this.$createLazyAttr( observableReadonly );
        this.attr2attrVal[ observableReadonly ].give(
          LAID.$emptyAttrVal );
      }
    }

    this.$initNonStateProjectedAttrs();
    this.$updateStates();

  };

  LAID.Level.prototype.$initNonStateProjectedAttrs = function () {

    var 
      key, val, stateName, state,
      states = this.lson.states,
      lson = this.lson,
      attr2val = {};

    initAttrsObj( "data.", lson.data, attr2val );

    if ( this.derivedMany ) {
      initAttrsObj( "row.", this.row, attr2val );
      attr2val[ "formation.top" ] = 0;
      attr2val[ "formation.left" ] = 0;
      this.row = undefined;
    }

    for ( stateName in states ) {
        state = states[ stateName ];
        if ( stateName !== "root" ) {
          attr2val[ stateName + "." + "onlyif" ] = state.onlyif;
          if ( state.install ) {
            attr2val[ stateName + "." + "install" ] = state.install;
          }
          if ( state.uninstall ) {
            attr2val[ stateName + "." + "uninstall" ] = state.uninstall;
          }
        }
    }

    if ( !this.isPart ) { // Many
      attr2val.$all = [];
      attr2val.$filtered = [];
      attr2val.rows = lson.rows || [];
      attr2val.$id = lson.$id;
    }

    this.$commitAttr2Val( attr2val );

  };

  LAID.Level.prototype.$commitAttr2Val = function ( attr2val ) {

    var attr, val, attrVal;
    for ( attr in attr2val ) {
      val = attr2val[ attr ];
      attrVal = this.attr2attrVal[ attr ];
      if ( ( attrVal === undefined ) ) {
        attrVal = this.attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );
      }
      attrVal.update( val );

    }
  };

  LAID.Level.prototype.$createAttrVal = function ( attr, val ) {

    ( this.attr2attrVal[ attr ] = new LAID.AttrVal( attr, this ) ).update( val );

  };

  /*
  * Return true if attr was created as it exists (in lazy form),
  * false otherwise (it is not present at all to be created)
  */
  LAID.Level.prototype.$createLazyAttr = function ( attr ) {
    var
     readonlyDefaultVal = LAID.$getReadonlyAttrDefaultVal( attr ),
     splitAttrLsonComponentS, attrLsonComponentObj, i, len,
     firstAttrLsonComponent;

    if ( [ "$type", "$interface", "$inherit", "$observe" ].indexOf(
      attr ) !== -1 ) {
      this.attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );
      this.attr2attrVal[ attr ].update( this.lson[ attr ] );

    } else if ( readonlyDefaultVal !== undefined ) {
      this.attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );
      if ( readonlyDefaultVal === null ) {
        switch ( attr ) {
          case "$naturalWidth":
            if ( this.part.isInputText ) {
              this.part.updateNaturalWidthInput();
            } else {
              this.part.updateNaturalWidth();
            }
            break;
          case "$naturalHeight":
            if ( this.part.isInputText ) {
              this.part.updateNaturalHeightInput();
            } else {
              this.part.updateNaturalHeight();
            }
            break;
          case "$absoluteX":
            this.part.updateAbsoluteX();
            break;
          case "$absoluteY":
            this.part.updateAbsoluteY();
            break;
        }
      } else if ( ["$centerX",
                   "$centerY",
                    "$right",
                     "$bottom" ].indexOf( attr )
                      !== -1 ) {
        this.attr2attrVal[ attr ].update( LAID[ attr ] );
      } else {
        this.attr2attrVal[ attr ].update( readonlyDefaultVal );
      }
    } else {
      if ( attr.indexOf( "." ) === -1 ) {
        return false;
      } else {
        if ( attr.startsWith( "data." ) ) {
          return false;
        } else {
          splitAttrLsonComponentS = attr.split( "." );
          if ( this.lson.states === undefined ) {
            return false;
          } else {
            firstAttrLsonComponent = splitAttrLsonComponentS[ 0 ];

            // Get down to state level
            if ( LAID.$checkIsValidUtils.stateName(
             firstAttrLsonComponent ) ) {
              attrLsonComponentObj = this.lson.states[ firstAttrLsonComponent ];
            } else {
              return false;
            }
            splitAttrLsonComponentS.shift();

            // rempve the state part of the attr components
            if ( splitAttrLsonComponentS[ 0 ]  === "when" ) {
              splitAttrLsonComponentS[ splitAttrLsonComponentS.length - 1 ] =
                parseInt( splitAttrLsonComponentS[
                  splitAttrLsonComponentS.length -1 ] ) - 1;
            } else if ( splitAttrLsonComponentS[ 0 ]  !== "transition" ) {
              // props
              if ( attrLsonComponentObj.props !== undefined ) {
                attrLsonComponentObj = attrLsonComponentObj.props; 
              } else {
                return false;
              }
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
              this.attr2attrVal[ attr ] = new LAID.AttrVal( attr, this );
              this.attr2attrVal[ attr ].update( attrLsonComponentObj );
            }
          }
        }
      }
    }
    return true;
  };


  /*
  * Prioritize the recalculation of AttrVals of such
  * that onlyif AttrVals (i.e. <state>.onlyif)
  * appear first in order
  */
  LAID.Level.prototype.$prioritizeRecalculateOrder = function () {
    var
      recalculateDirtyAttrValS = this.recalculateDirtyAttrValS,
      recalculateDirtyAttrVal;

    for ( var i = 0, len = recalculateDirtyAttrValS.length;
        i < len; i++ ) {
      recalculateDirtyAttrVal = recalculateDirtyAttrValS[ i ];
      if ( recalculateDirtyAttrVal.onlyIfStateName ) {
        LAID.$arrayUtils.swap(recalculateDirtyAttrValS, i, 0);
      }
    }
    /*
    if ( fIndexAttrVal ) {
      fIndexAttrValIndex = recalculateDirtyAttrValS.indexOf( fIndexAttrVal );
      if ( fIndexAttrValIndex !== -1 ) {
        LAID.$arrayUtils.removeAtIndex(
          recalculateDirtyAttrValS,
         fIndexAttrValIndex );
        recalculateDirtyAttrValS.push( fIndexAttrVal );
      }
    }*/

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
      recalculateDirtyAttrValS = this.recalculateDirtyAttrValS;

    do {
      isSolveProgressed = false;
      this.$prioritizeRecalculateOrder();
      for ( i = 0; i < recalculateDirtyAttrValS.length; i++ ) {
        isSolveProgressed = recalculateDirtyAttrValS[ i ].recalculate();
   //     console.log( "\trecalculate", this.pathName, isSolveProgressed,
  //        recalculateDirtyAttrValS[ i ].attr );
        if ( isSolveProgressed ) {
          isSolveProgressedOnce = true;
          LAID.$arrayUtils.removeAtIndex( recalculateDirtyAttrValS, i );
          i--;
        }
      }

    } while ( ( recalculateDirtyAttrValS.length !== 0 ) && isSolveProgressed );

    return recalculateDirtyAttrValS.length === 0 ? 0 :
     ( isSolveProgressedOnce ? 1 : 2 );

  };

  /*
  Undefine all current attributes which are influencable
  by states: props, transition, when, $$num, $$max
  */
  LAID.Level.prototype.$undefineStateProjectedAttrs = function() {

    var attr;
    for ( attr in this.attr2attrVal ) {
      if ( this.attr2attrVal[ attr ].isStateProjectedAttr ) {
        this.attr2attrVal[ attr ].update( undefined );
      }
    }
  };


  /* Return the attr2value generated
  by the current states */
  LAID.Level.prototype.$getStateAttr2val = function () {

    var
      attr2val = {},
      stringHashedStates2_cachedAttr2val_;
  // Refer to the central cache for Many levels
   stringHashedStates2_cachedAttr2val_ = this.derivedMany ?
      this.derivedMany.levelStringHashedStates2_cachedAttr2val_ :
      this.stringHashedStates2_cachedAttr2val_;
    
    this.$sortStates();
    var stringHashedStates = this.stateS.join( "&" );
    if ( stringHashedStates2_cachedAttr2val_[
     stringHashedStates ] === undefined ) {
      convertSLSONtoAttr2Val( this.$generateSLSON(), attr2val, this.isPart);
      stringHashedStates2_cachedAttr2val_[ stringHashedStates ] =
        attr2val;
    }

    return stringHashedStates2_cachedAttr2val_[ stringHashedStates ];
  

  };

  /*
  * TODO: fill in details of priority
  */
  LAID.Level.prototype.$sortStates = function ( stateS ) {

    var
      sortedStateS = this.stateS.sort(),
      i, len, sortedState;

    // Push the "formation" state to second after the "root"
    // state for 2nd lowest priority
    if ( sortedStateS.indexOf( "formation" ) !== -1 ) {
      LAID.$arrayUtils.remove( sortedStateS, "formation" );
      sortedStateS.unshift( "formation" );
    }

    // Push the "root" state to the start for least priority
    LAID.$arrayUtils.remove( sortedStateS, "root" );
    sortedStateS.unshift("root");

    // Push the "formationDisplayNone" state to the end of the
    // list of states for maximum priority.
    if ( sortedStateS.indexOf( "formationDisplayNone" ) !== -1 ) {
      LAID.$arrayUtils.remove( sortedStateS, "formationDisplayNone" );
      sortedStateS.push( "formation" );
    }

  };

  /*
  *  From the current states generate the
  *  correspinding SLSON (state projected lson)
  *  Requirement: the order of states must be sorted
  */
  LAID.Level.prototype.$generateSLSON =  function () {

    this.$sortStates();

    var slson = {}, attr2val;
    for ( var i = 0, len = this.stateS.length; i < len; i++ ) {
      LAID.$inherit( slson, this.lson.states[ this.stateS[ i ] ],
        !this.isPart, true, true );
    }

    return slson;

  };




  LAID.Level.prototype.$updateStates = function () {

    this.$undefineStateProjectedAttrs();
    this.$commitAttr2Val( this.$getStateAttr2val() );

    if ( this.derivedMany &&
       !this.derivedMany.level.
        attr2attrVal.filter.isRecalculateRequired &&
        this.attr2attrVal.$f && this.attr2attrVal.$f.calcVal !== 1 ) {
      this.$setFormationXY( this.part.formationX,
          this.part.formationY );
    }

    if ( this.pathName === "/" ) {
      if ( this.attr2attrVal.width.val !==
        this.lson.states.root.props.width ) {
        throw "LAID Error: Width of root level unchangeable";
      }
      if ( this.attr2attrVal.height.val !==
        this.lson.states.root.props.height ) {
        throw "LAID Error: Height of root level unchangeable";
      }
    }

  
    //console.log("LAID INFO: new state", this.pathName, this.stateS );

  };


  

  LAID.Level.prototype.$getAttrVal = function ( attr ) {
    if ( !this.attr2attrVal[ attr ] ) {
      this.$createLazyAttr( attr );
      LAID.$solve();
    }
    return this.attr2attrVal[ attr ];

  };

  /* Manually change attr value */
  LAID.Level.prototype.$changeAttrVal = function ( attr, val ) {
    if ( this.attr2attrVal[ attr ] ) {
      this.attr2attrVal[ attr ].update( val );
      LAID.$solve();
    }
  };

  LAID.Level.prototype.$setFormationXY = function ( x, y ) {
    if ( x === undefined ) {
      this.$changeAttrVal( "formation.left",
        LAID.$formationState.props.left );
      this.$changeAttrVal( "left",
        LAID.$formationState.props.left );
    } else {
      this.$changeAttrVal( "formation.left", x );
      this.$changeAttrVal( "left", x );
    }
    if ( y === undefined ) {
      this.$changeAttrVal( "formation.top",
        LAID.$formationState.props.top );
      this.$changeAttrVal( "top",
        LAID.$formationState.props.top );
    } else {
      this.$changeAttrVal( "formation.top", y );
      this.$changeAttrVal( "top", y );
    }

    this.attr2attrVal.top.requestRecalculation();
    this.attr2attrVal.left.requestRecalculation();

    this.part.formationX = x;
    this.part.formationY = y;
 
  };

  LAID.Level.prototype.addRecalculateDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.pushUnique( this.recalculateDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$recalculateDirtyLevelS, this );

  };



  

  







})();

(function() {
  "use strict";

  LAID.Many = function ( level, partLson ) {

    this.level = level;
    this.partLson = partLson;

    // "stringHashedStates2_cachedAttr2val_"
    // for levels derived from the many
    // Keeping this cache ensures thats
    // each derived level (which could potentially
    // large arbitrary number n) calculates
    // only once.
	  this.levelStringHashedStates2_cachedAttr2val_ = {};

    this.id = level.lson.id || "id";
    this.id2level = {};
    this.id2row = {};
    this.allLevelS = [];
    this.isLoaded = false;

  };

  LAID.Many.prototype.init = function () {

    var
      states = this.partLson.states || ( this.partLson.states = {} );

    states.formationDisplayNone =
      LAID.$displayNoneFormationState;
    states.formation = LAID.$formationState;

    LAID.$defaultizePartLson( this.partLson );

    LAID.$newManyS.push( this );

    this.level.$createAttrVal( "$all", [] );
    this.level.$createAttrVal( "$filtered", [] );

  };

  LAID.Many.prototype.queryAll = function () {
    return new LAID.Query( 
       LAID.$arrayUtils.cloneSingleLevel(
        this.allLevelS ) );
  };

  LAID.Many.prototype.queryFiltered = function () {

    return new LAID.Query(
      LAID.$arrayUtils.cloneSingleLevel(
        this.level.attr2attrVal.$filtered.calcVal ) );
  };

  LAID.Many.prototype.rowsCommit = function ( newRowS ) {

    this.level.attr2attrVal.rows.update( newRowS );
    LAID.$solve();

  };

  LAID.Many.prototype.rowsMore = function ( newRowS ) {
    var
      curRowS = this.level.attr2attrVal.rows.calcVal;

    for ( var i = 0; i < newRowS.length; i++ ) {
      curRowS.push( newRowS[ i ] );
    }

    this.level.attr2attrVal.rows.requestRecalculation();
    
    LAID.$solve();

  };


  function checkIfRowsIsNotObjectified ( rowS ) {
    return rowS.length &&
     ( typeof rowS[ 0 ] !== "object" );
  }

  function objectifyRows ( rowS ) {
    var objectifiedRowS = [];
    for ( var i = 0, len = rowS.length; i < len; i++ ) {
      objectifiedRowS.push( { id:i+1, content: rowS[ i ] }); 
    }
    return objectifiedRowS;
  }

  /*
  *	Update the rows by:
  * (1) Creating new levels in accordance to new rows
  * (2) Updating existing levels in accordance to changes in changed rows
  */
  LAID.Many.prototype.updateRows = function () {
  	var 
  		rowS = this.level.attr2attrVal.rows.calcVal,
  		row,
  		id,
  		level,
  		parentLevel = this.level.parentLevel,
      updatedLevelS = [],
      newLevelS = [],
      id2level = this.id2level,
      id2row = this.id2row,
      rowKey, rowVal,
      i, len;

    if ( checkIfRowsIsNotObjectified ( rowS ) ) {
      rowS = objectifyRows( rowS );
    }
    this.sort( rowS );

  	for ( i = 0, len = rowS.length; i < len; i++ ) {
  		row = rowS[ i ];
  		id = row[ this.id ];
      id2row[ id ] = row;
  		level = this.id2level[ id ];
      
      if ( !level ) {
        // create new level with row
  			level = new LAID.Level( this.level.pathName + ":" + id,
  			 this.partLson, parentLevel, this, row, id );
        level.$init();
        // the level has already been normalized
        // while LAID was parsing the "many" level
        level.isNormalized = true;

  			parentLevel.childLevelS.push( level );
  			id2level[ id ] = level;
        id2row[ id ] = row;

        level.$createAttrVal( "$i", i + 1 );
        level.$createAttrVal( "$f", -1 );

        newLevelS.push( level );

		  } else {
        // update level with new row changes
        level.attr2attrVal.$i.update( i + 1 );
        level.attr2attrVal.$f.update( -1 );

        for ( rowKey in row ) {
          rowVal = row[ rowKey ];
          if ( !level.attr2attrVal[ "row." + rowKey ] ) {
            level.$createAttrVal( "row." + rowKey, rowVal );
          } else {
            level.$changeAttrVal( "row." + rowKey, rowVal );           
          }
        }
  		}

      updatedLevelS.push( level );

  	}

    // solve as new levels might have been intoduced
    // after "Level.$identifyAndReproduce()"
    LAID.$solve();


    for ( id in id2level ) {
      level = id2level[ id ];
      if ( updatedLevelS.indexOf( level ) === -1 ) {
        level.$remove();
      }
    }


    LAID.$solve();


    this.level.attr2attrVal.$all.update( updatedLevelS );
    this.level.attr2attrVal.$all.requestRecalculation();

    LAID.$solve();


  };

  LAID.Many.prototype.updateFilter = function ( ) {

    var  
      allLevelS = this.allLevelS,
      filteredLevelS = this.level.attr2attrVal.filter.calcVal || [];

    for ( 
      var i = 0, len = allLevelS.length;
      i < len;
      i++
     ) {
      allLevelS[ i ].attr2attrVal.$f.update( -1 );
    }
    for ( 
      var f = 0, len = filteredLevelS.length;
      f < len;
      f++
     ) {
      filteredLevelS[ f ].attr2attrVal.$f.update( f + 1 );
    }

    this.level.attr2attrVal.$filtered.update( filteredLevelS );

    LAID.$solve();

    this.updateFilteredPositioning();

  };

  LAID.Many.prototype.updateFilteredPositioning = function () {

    if ( this.isLoaded ) {
      var
        filteredLevelS = this.level.attr2attrVal.filter.calcVal || [],
        formationFn = LAID.$formationName2fn[
          this.level.attr2attrVal.formation.calcVal ];

      for ( 
        var f = 1, len = filteredLevelS.length, filteredLevel;
        f < len;
        f++
       ) {
        filteredLevel = filteredLevelS[ f ];
        // if the level is not initialized then
        // discontinue the filtered positioning
        if ( !filteredLevel.part ) {
          return;
        }
        formationFn( f + 1, filteredLevelS[ f ], filteredLevelS );
      }

      LAID.$solve();
    }

  };

  LAID.Many.prototype.removeLevel = function ( level ) {

    this.id2level[ level.id ] = undefined;
    this.id2row[ level.id ] = undefined;

    LAID.$arrayUtils.remove( this.allLevelS, level );

  };

  LAID.Many.prototype.sort = function ( rowS ) {
    var sortAttrPrefix,
      attr2attrVal = this.level.attr2attrVal,
      numSorts = attr2attrVal["$$num.sort"] ?
        attr2attrVal["$$num.sort"].calcVal : 0,
      sortDictS = [];

    for ( var i=0; i<numSorts; i++ ) {
      sortAttrPrefix = "sort." + ( i + 1 ) + ".";
    
      sortDictS.push(
        { key:attr2attrVal[ sortAttrPrefix + "key" ].calcVal,
        ascending:
        attr2attrVal[ sortAttrPrefix + "ascending" ].calcVal  });
    }

    rowS.sort( dynamicSortMultiple( sortDictS ) );

  };

  


 


  // below code is taken from one of the responses
  // to the stackoverflow question:
  // http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
  // source: http://stackoverflow.com/a/4760279

  function dynamicSort( sortDict ) {
    var key = sortDict.key,
      sortOrder = sortDict.ascending ? 1 : -1;

    return function (a,b) {
        var result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  function dynamicSortMultiple( sortDictS ) {
    
    return function (obj1, obj2) {
        var i = 0, result = 0,
        numberOfProperties = sortDictS.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(sortDictS[i])(obj1, obj2);
            i++;
        }
        return result;
    }
  }

})();

( function () {
  "use strict";



  var isGpuAccelerated, cssPrefix, allStyles,
  defaultCss, inputType2tag;


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
    "-webkit-overflow-scrolling:touch;" + 
    "font-family:inherit;line-height:1em;" +
    "outline:none;border:none";

  inputType2tag = {
    button: "button",
    multiline: "textarea",
    optgroup: "optgroup",
    option: "option"
  };


  function stringifyPlusPx ( val ) {
    return val + "px";
  }
  

  LAID.Part = function ( level ) {

    this.level = level;
    this.node = undefined;
    this.isInitiallyRendered = false;
    this.isInputText = false;
    this.textSizeMeasureNode = undefined;
    this.isInterface = false;

    this.naturalWidthLevel = undefined;
    this.naturalHeightLevel = undefined;

    this.normalRenderDirtyAttrValS = [];
    this.travelRenderDirtyAttrValS = [];

    this.whenEventType2fnMainHandler = {};

    this.absoluteY = undefined;
    this.absoluteX = undefined;

    this.formationX = undefined;
    this.formationY = undefined;

  };

  function getInputType ( type ) {
    return type.startsWith( "input:" ) &&
      type.slice( "input:".length );

  }

  LAID.Part.prototype.init = function () {

    var
      levelType = this.level.lson.$type,
      inputType = getInputType( levelType ),
      inputTag, parentNode;

    if ( this.level.pathName === "/" ) {
      this.node = document.body;
    } else if ( inputType ) {
      inputTag = inputType2tag[ inputType ];
      if ( inputTag ) {
        if ( inputTag === "textarea" ) {
          this.isInputText = true;
        }
        this.node = document.createElement( inputTag );
      } else {
        if ( inputType === "line" ) {
          inputType = "text";
          this.isInputText = true;          
        }
        this.node = document.createElement( "input" );
        this.node.type = inputType;
      }

    } else {
      this.node = document.createElement(
       ( ( levelType === "none" ) ||
       ( levelType === "text" ) ) ? "div" :
        ( levelType === "image" ?
         "img" : levelType ) );
    }
    this.node.style.cssText = defaultCss;

    if ( this.level.lson.$interface ) {
      this.isInterface = true;
      this.node.style.display = "none";
    }

    if ( this.isInputText || levelType === "text" ) {
      this.textSizeMeasureNode = document.createElement("div");
      this.textSizeMeasureNode.style.cssText = defaultCss;
      this.textSizeMeasureNode.style.visibility = "hidden";
      this.textSizeMeasureNode.style.zIndex = "-9999";      
      this.textSizeMeasureNode.style.height = "auto";
      this.textSizeMeasureNode.style.overflow = "visible";
      this.textSizeMeasureNode.style.borderStyle = "solid";
      this.textSizeMeasureNode.style.borderColor = "transparent";


    }

    if ( this.level.pathName !== "/" ) {
      parentNode = this.level.parentLevel.part.node;
      parentNode.appendChild( this.node );
      if ( this.textSizeMeasureNode ) {
        parentNode.appendChild( this.textSizeMeasureNode );
      }
    }
  };

  LAID.Part.prototype.remove = function () {
    if ( parentPart.naturalWidthLevel === this ) {
      parentPart.updateNaturalWidth();
    }
    if ( parentPart.naturalHeightLevel === this ) {
      parentPart.updateNaturalHeight();
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
  LAID.Part.prototype.findChildWithMaxOfAttr =
   function ( attr, attrChildIndepedentOf,
      attrValIndependentOf ) {
    var
       curMaxVal, curMaxLevel,
       childLevel, childLevelAttrVal,
       attrValChildIndepedentOf;

    for ( var i = 0,
         childLevelS = this.level.childLevelS,
        len = childLevelS.length;
         i < len; i++ ) {
      childLevel = childLevelS[ i ];
      if ( childLevel.isPart && !childLevel.part.isInterface ) {
        if ( checkIfLevelIsDisplayed( childLevel ) ) {
          childLevelAttrVal = childLevel.attr2attrVal[ attr ];
          attrValChildIndepedentOf =
            childLevel.attr2attrVal[ attrChildIndepedentOf ];

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
     }
    }
    return curMaxLevel;
  };

  LAID.Part.prototype.updateAbsoluteX = function () {

    var 
      attr2attrVal = this.level.attr2attrVal,
      relativeLeft = attr2attrVal.left.calcVal,
      shiftX = attr2attrVal.shiftX ? attr2attrVal.shiftX.calcVal : 0,
      parentAbsoluteX = this.level.pathName !== "/" ? 
        this.level.parentLevel.part.absoluteX : 0,
      absoluteX = relativeLeft + shiftX + parentAbsoluteX;

    if ( typeof absoluteX === "number" ) {
      this.absoluteX = absoluteX;
      if ( attr2attrVal.$absoluteX ) {
        attr2attrVal.$absoluteX.update( this.absoluteX );
      }
      for ( var i = 0, childLevelS = this.level.childLevelS,
         len = childLevelS.length; i < len; i++ ) {
        childLevelS[ i ].isPart && childLevelS[ i ].part.updateAbsoluteX();
      }
    }
  };

  LAID.Part.prototype.updateAbsoluteY = function () {

    var 
      attr2attrVal = this.level.attr2attrVal,
      relativeTop = attr2attrVal.top.calcVal,
      shiftY = attr2attrVal.shiftY ? attr2attrVal.shiftY.calcVal : 0,
      parentAbsoluteY = this.level.pathName !== "/" ?
        this.level.parentLevel.part.absoluteY : 0,
      absoluteY = relativeTop + shiftY + parentAbsoluteY;

    if ( typeof absoluteY === "number" ) {
      this.absoluteY = absoluteY;
      if ( attr2attrVal.$absoluteY ) {
        attr2attrVal.$absoluteY.update( this.absoluteY );
      }
      for ( var i = 0, childLevelS = this.level.childLevelS,
         len = childLevelS.length; i < len; i++ ) {
        childLevelS[ i ].isPart && childLevelS[ i ].part.updateAbsoluteY();
      }
    }
  };


  LAID.Part.prototype.updateNaturalWidth = function () {
    var attr2attrVal = this.level.attr2attrVal
    if ( attr2attrVal.$naturalWidth ) {
      if ( this.level.pathName === "/" ) {
        attr2attrVal.$naturalWidth.update( window.innerWidth );

      } else if ( this.level.attr2attrVal.text ) {
       
        this.updateNaturalWidthFromText();
      } else {
        this.naturalWidthLevel =
          this.findChildWithMaxOfAttr( "right", "width",
          attr2attrVal.$naturalWidth );
        attr2attrVal.$naturalWidth.update(
            this.naturalWidthLevel ?
           ( this.naturalWidthLevel.attr2attrVal.right.calcVal || 0 ) :
           0
        );
      }
    }
  };



  LAID.Part.prototype.updateNaturalHeight = function () {
    var attr2attrVal = this.level.attr2attrVal
    if (attr2attrVal.$naturalHeight ) {
      if ( this.level.pathName === "/" ) {
        attr2attrVal.$naturalHeight.update( window.innerHeight );
      } else if ( this.level.attr2attrVal.text ) {
        this.updateNaturalHeightFromText();
      } else {
        this.naturalHeightLevel =
          this.findChildWithMaxOfAttr( "bottom", "height",
        attr2attrVal.$naturalHeight);

        attr2attrVal.$naturalHeight.update(
            this.naturalHeightLevel ?
           ( this.naturalHeightLevel.attr2attrVal.bottom.calcVal || 0 ) :
           0
        );
      }
    }
  };


  LAID.Part.prototype.updateNaturalWidthFromChild = function ( childLevel ) {

    var attr2attrVal = this.level.attr2attrVal;

    if ( attr2attrVal.$naturalWidth &&
      ( this.level.pathName !== "/" ) &&
      ! (LAID.$checkIsValidUtils.nan( childLevel.attr2attrVal.right.calcVal )) &&
      ! (childLevel.attr2attrVal.width.checkIsDependentOnAttrVal(
        attr2attrVal.$naturalWidth)) &&
        (checkIfLevelIsDisplayed(childLevel) )
        ) {


      if ( this.naturalWidthLevel === undefined ) {
        this.naturalWidthLevel = childLevel;
      } else if ( this.naturalWidthLevel === childLevel ) {

        // Check If the current child level responsible for the stretch
        // of the naturalWidth boundary, has receeded
        // If this would be the case, then there is
        // a possibility that it has receded behind another
        // child element which has a higher right position
        // than the current child level responsible for the natural width
        if ( attr2attrVal.$naturalWidth.calcVal >
           childLevel.attr2attrVal.right.calcVal  ) {
          // Find the child with the next largest right
          // This could be the same child level
          this.naturalWidthLevel =
            this.findChildWithMaxOfAttr( "right", "width",
            attr2attrVal.$naturalWidth );
        }
      } else {
        if ( childLevel.attr2attrVal.right.calcVal >
          this.naturalWidthLevel.attr2attrVal.right.calcVal ) {
            this.naturalWidthLevel = childLevel;
        }
      }
      attr2attrVal.$naturalWidth.update(
        this.naturalWidthLevel ?
        ( this.naturalWidthLevel.attr2attrVal.right.calcVal || 0 ) :
        0
      );

    }
  };


  LAID.Part.prototype.updateNaturalHeightFromChild = function ( childLevel ) {

    var attr2attrVal = this.level.attr2attrVal;

    if ( attr2attrVal.$naturalHeight &&
        ( this.level.pathName !== "/" ) &&
       !(LAID.$checkIsValidUtils.nan( childLevel.attr2attrVal.bottom.calcVal )) &&
       !( childLevel.attr2attrVal.height.checkIsDependentOnAttrVal(
         attr2attrVal.$naturalHeight) ) &&
         (checkIfLevelIsDisplayed(childLevel) ) ) {

      if ( this.naturalHeightLevel === undefined ) {
        this.naturalHeightLevel = childLevel;
      } else if ( this.naturalHeightLevel === childLevel ) {
        // Check If the current child level responsible for the stretch
          // of the naturalHeight boundary, has receeded
          // If this would be the case, then there is
          // a possibility that it has receded behind another
          // child element which has a higher bottom position
          // than the current child level responsible for the natural height
         if ( attr2attrVal.$naturalHeight.calcVal >
           childLevel.attr2attrVal.bottom.calcVal  ) {
          // Find the child with the next largest bottom
          // This could be the same child level
          this.naturalHeightLevel =
            this.findChildWithMaxOfAttr( "bottom", "height",
           attr2attrVal.$naturalHeight );
        }
      } else {
        if ( childLevel.attr2attrVal.bottom.calcVal >
          this.naturalHeightLevel.attr2attrVal.bottom.calcVal ) {
            this.naturalHeightLevel = childLevel;
          }
        }

      attr2attrVal.$naturalHeight.update(
          this.naturalHeightLevel ?
          ( this.naturalHeightLevel.attr2attrVal.bottom.calcVal || 0 ) :
          0
      );
    }
  };

  


  LAID.Part.prototype.calculateTextNaturalDimesion = function ( isWidth ) {
    var dimensionAlteringAttr2fnStyle = {
      textSize: stringifyPxOrString,
      textFamily: null,
      textWeight: null,
      textAlign: null,
      textLetterSpacing: stringifyEmOrString,
      textWordSpacing: stringifyPxOrString,
      textLineHeight: stringifyPxOrString,
      textOverflow: null,
      textIndent: stringifyPlusPx,
      textWhitespace: null,
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
      textLetterSpacing: "letter-spacing",
      textWordSpacing: "word-spacing",
      textLineHeight: "line-height",
      textOverflow: "text-overflow",
      textIndent: "text-indent",
      textWhitespace: "white-space",
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
      node = this.textSizeMeasureNode,
      attr2attrVal = this.level.attr2attrVal,
      dimensionAlteringAttr, fnStyle,
      textRelatedAttrVal,
      text = this.isInputText ? 
        attr2attrVal.$input.calcVal :
        attr2attrVal.text.calcVal;
    
    for ( dimensionAlteringAttr in
       dimensionAlteringAttr2fnStyle ) {
      textRelatedAttrVal = attr2attrVal[ 
        dimensionAlteringAttr ];
      if ( textRelatedAttrVal ) {

        fnStyle = dimensionAlteringAttr2fnStyle[ 
            dimensionAlteringAttr ];
      
        node.style[ 
          dimensionAlteringAttr2cssProp[
            dimensionAlteringAttr ] ] =
            fnStyle === null ? textRelatedAttrVal.calcVal :
              fnStyle( textRelatedAttrVal.calcVal );
      }
    }

    if ( attr2attrVal.$naturalWidth ) {
      var initialWhitespace = node.style.whiteSpace;
      node.style.whiteSpace = "nowrap";
    }

    if ( isWidth ) {
      node.style.display = "inline";
      node.style.width = "auto";
      node.innerHTML = text;

      this.level.$changeAttrVal( "$naturalWidth",
       node.offsetWidth );
    } else {
      node.style.display = "block";
      node.style.width = attr2attrVal.width.calcVal + "px";
      
      // If empty we will subsitute with a space character
      // as we wouldn't want the height to resolve to 0
      node.innerHTML = text || " ";
      this.level.$changeAttrVal( "$naturalHeight",
        node.offsetHeight );
    }
    // restore whitespace
    if ( attr2attrVal.$naturalWidth ) {
      node.style.whiteSpace = initialWhitespace;

    }
  };

  LAID.Part.prototype.updateNaturalWidthFromText = function () {

    var attr2attrVal = this.level.attr2attrVal;

    if ( attr2attrVal.$naturalWidth &&
      this.level.attr2attrVal.text ) {
      if ( attr2attrVal.$naturalWidth ) {
        this.calculateTextNaturalDimesion( true );
      }
    }
  };

  LAID.Part.prototype.updateNaturalHeightFromText = function ( arg ) {

    var attr2attrVal = this.level.attr2attrVal;

    if ( attr2attrVal.$naturalHeight &&
      this.level.attr2attrVal.text ) {
      if ( attr2attrVal.$naturalHeight ) {
       this.calculateTextNaturalDimesion( false );
      }
    }
  };

  LAID.Part.prototype.updateNaturalWidthInput = function () {

    var attr2attrVal = this.level.attr2attrVal;

    if ( attr2attrVal.$naturalWidth ) {
      this.calculateTextNaturalDimesion( true );
    }
  };

  LAID.Part.prototype.updateNaturalHeightInput = function () {

    var attr2attrVal = this.level.attr2attrVal;

    if ( attr2attrVal.$naturalHeight ) {
      if ( attr2attrVal.$naturalHeight ) {
        this.calculateTextNaturalDimesion( false );
      }
    }
  };
  

  LAID.Part.prototype.addNormalRenderDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.remove( this.travelRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( this.normalRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$renderDirtyPartS, this );

  };

  LAID.Part.prototype.addTravelRenderDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.remove( this.normalRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( this.travelRenderDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$renderDirtyPartS, this );

  };

  LAID.Part.prototype.updateWhenEventType = function ( eventType ) {

    var
      numFnHandlersForEventType =
        this.level.attr2attrVal[ "$$num.when." + eventType ].val,
      fnMainHandler,
      thisLevel = this.level;

    if ( this.whenEventType2fnMainHandler[ eventType ] !== undefined ) {
      LAID.$eventUtils.remove( 
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
      LAID.$eventUtils.add( this.node, eventType, fnMainHandler );
      this.whenEventType2fnMainHandler[ eventType ] = fnMainHandler;

    } else {
      this.whenEventType2fnMainHandler[ eventType ] = undefined;

    }
  };

  LAID.Part.prototype.checkIsPropInTransition = function ( prop ) {
    return ( this.level.attr2attrVal[ "transition." + prop  + ".type" ] !==
      undefined )  ||
      ( this.level.attr2attrVal[ "transition." + prop  + ".delay" ] !==
        undefined );
  };

  LAID.Part.prototype.updateTransitionProp = function ( transitionProp ) {

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

  LAID.Part.prototype.updateTransitionAttrVal = function ( attrVal,
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

  function computeEmOrString( attrVal, defaultVal ) {
    return stringifyEmOrString(
      attrVal && attrVal.transitionCalcVal,
      defaultVal );
  }

  function computeColorOrString( attrVal, defaultVal ) {
    var transitionCalcVal =
      attrVal && attrVal.transitionCalcVal;
    return ( transitionCalcVal === undefined ) ?
        defaultVal : ( transitionCalcVal instanceof LAID.Color ?
        transitionCalcVal.stringify() : transitionCalcVal );
  }
  

  // Below we will customize prototypical functions
  // using conditionals. As per the results from
  // http://jsperf.com/foreign-function-within-prototype-chain
  // http://jsperf.com/dynamic-modification-of-prototype-chain
  // this will make no difference

  // The renderable prop can be
  // accessed via `part.renderFn_<prop>`


  if ( isGpuAccelerated ) {


    // TODO: optimize to enter matrix3d directly
    LAID.Part.prototype.renderFn_positional =   
    function () {
      var attr2attrVal = this.level.attr2attrVal;
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

    LAID.Part.prototype.renderFn_width = function () {
      this.node.style.width = this.level.attr2attrVal.width.transitionCalcVal + "px";
      //this.renderFn_positional(); //apply change to transform
    };

    LAID.Part.prototype.renderFn_height = function () {
      this.node.style.height = this.level.attr2attrVal.height.transitionCalcVal + "px";
      //this.renderFn_positional(); //apply change to transform
    };



  } else {
    // legacy browser usage or forced non-gpu mode

    LAID.Part.prototype.renderFn_width = function () {
      this.node.style.width = this.level.attr2attrVal.width.transitionCalcVal + "px";
    };

    LAID.Part.prototype.renderFn_height = function () {
      this.node.style.height = this.level.attr2attrVal.height.transitionCalcVal + "px";
    };

    LAID.Part.prototype.renderFn_positional = function () {
      var attr2attrVal = this.level.attr2attrVal;
      this.node.style.left = ( attr2attrVal.left.transitionCalcVal + ( attr2attrVal.shiftX !== undefined ? attr2attrVal.shiftX.transitionCalcVal : 0 ) ) + "px";
      this.node.style.top = ( attr2attrVal.top.transitionCalcVal + ( attr2attrVal.shiftY !== undefined ? attr2attrVal.shiftY.transitionCalcVal : 0 ) ) + "px";

    };

  }




  LAID.Part.prototype.renderFn_origin = function () {
    var attr2attrVal = this.level.attr2attrVal;

    this.node.style[ cssPrefix + "transform-origin" ] =
    ( ( attr2attrVal.originX !== undefined ? attr2attrVal.originX.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrVal.originY !== undefined ? attr2attrVal.originY.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( attr2attrVal.originZ !== undefined ? attr2attrVal.originZ.transitionCalcVal : 0  ) + "px";
    //this.renderFn_positional(); //apply change to transform
  };


  LAID.Part.prototype.renderFn_perspective = function () {
    this.node.style[ cssPrefix + "perspective" ] =
     this.level.attr2attrVal.perspective.transitionCalcVal + "px";
  };

  LAID.Part.prototype.renderFn_perspectiveOrigin = function () {
    var attr2attrVal = this.level.attr2attrVal;
    this.node.style[ cssPrefix + "perspective-origin" ] =
    ( attr2attrVal.perspectiveOriginX ?
     ( attr2attrVal.perspectiveOriginX.transitionCalcVal * 100 )
      : 0 ) + "% " +
    ( attr2attrVal.perspectiveOriginY ?
     ( attr2attrVal.perspectiveOriginY.transitionCalcVal * 100 )
      : 0 ) + "%";
  };

  LAID.Part.prototype.renderFn_backfaceVisibility = function () {
    this.node.style[ cssPrefix + "backface-visibility" ] =
      this.level.attr2attrVal.backfaceVisibility.transitionCalcVal;
  };


  LAID.Part.prototype.renderFn_opacity = function () {
    this.node.style.opacity = this.level.attr2attrVal.opacity.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_userSelect = function () {
    this.node.style[ cssPrefix + "user-select" ] = 
      this.level.attr2attrVal.userSelect.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_display = function () {
    var parentLevel = this.level.parentLevel;
    if ( parentLevel ) {
      if ( parentLevel.part ) {
        parentLevel.part.updateNaturalWidth();
        parentLevel.part.updateNaturalHeight();

      }
    }
    recurseVisibilityNode( this.node,
        this.level.attr2attrVal.display.transitionCalcVal ?
        "visible" : "hidden"  );

  };

  function recurseVisibilityNode( node, visibility ) {
    if ( node && node.style ) {
      var childNodeS = node.childNodes;
      node.style.visibility = visibility;

      for ( var i = 0, len = childNodeS.length; i < len; i++ ) {
        recurseVisibilityNode( childNodeS[ i ], visibility );
      }
    }
  }

  LAID.Part.prototype.renderFn_zIndex = function () {

    this.node.style.zIndex =
      this.level.attr2attrVal.zIndex.transitionCalcVal || "auto";
  };


  LAID.Part.prototype.renderFn_scrollX = function () {
    this.node.scrollLeft = this.level.attr2attrVal.scrollX.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_scrollY = function () {
    this.node.scrollTop = this.level.attr2attrVal.scrollY.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_overflowX = function () {
    this.node.style.overflowX =
      this.level.attr2attrVal.overflowX.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_overflowY = function () {
    this.node.style.overflowY =
      this.level.attr2attrVal.overflowY.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_cursor = function () {
    this.node.style.cursor =
      this.level.attr2attrVal.
      cursor.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_backgroundColor = function () {
    this.node.style.backgroundColor =
      this.level.attr2attrVal.
      backgroundColor.transitionCalcVal.stringify();
  };

  LAID.Part.prototype.renderFn_backgroundImage = function () {
    this.node.style.backgroundImage =
      this.level.attr2attrVal.
      backgroundImage.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_backgroundAttachment = function () {
    this.node.style.backgroundAttachment = this.level.attr2attrVal.backgroundAttachment.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_backgroundRepeat = function () {
    this.node.style.backgroundRepeat = this.level.attr2attrVal.backgroundColor.transitionCalcVal;
  };


  LAID.Part.prototype.renderFn_backgroundSize = function () {
    
    this.node.style.backgroundSize =
      computePxOrString( 
        this.level.attr2attrVal.backgroundSizeX, "auto" ) +
      " " +
      computePxOrString(
        this.level.attr2attrVal.backgroundSizeY, "auto" );

  };

  LAID.Part.prototype.renderFn_backgroundPosition = function () {
    this.node.style.backgroundPosition =
      computePxOrString(
        this.level.attr2attrVal.backgroundPositionX, "0px" ) +
         " " +
      computePxOrString(
        this.level.attr2attrVal.backgroundPositionX, "0px" );
    
  };

  LAID.Part.prototype.renderFn_boxShadows = function () {
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
  };



  LAID.Part.prototype.renderFn_filters = function () {
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
          s += filterType + "(" + ( attr2attrVal[ "filters" + i + LAID.$capitalize( filterType ) ] * 100 ) + "%) ";

      }
    }
    this.node.style[ cssPrefix + "filter" ] = s;

  };

  LAID.Part.prototype.renderFn_cornerRadiusTopLeft = function () {
    this.node.style.borderTopLeftRadius =
     this.level.attr2attrVal.cornerRadiusTopLeft.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_cornerRadiusTopRight = function () {
    this.node.style.borderTopRightRadius =
      this.level.attr2attrVal.cornerRadiusTopRight.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_cornerRadiusBottomRight = function () {
    this.node.style.borderBottomRightRadius =
      this.level.attr2attrVal.cornerRadiusBottomRight.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_cornerRadiusBottomLeft = function () {
    this.node.style.borderBottomLeftRadius =
      this.level.attr2attrVal.cornerRadiusBottomLeft.transitionCalcVal + "px";
  };



  LAID.Part.prototype.renderFn_borderTopStyle = function () {
    this.node.style.borderTopStyle =
      this.level.attr2attrVal.borderTopStyle.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_borderRightStyle = function () {
    this.node.style.borderRightStyle =
      this.level.attr2attrVal.borderRightStyle.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_borderBottomStyle = function () {
    this.node.style.borderBottomStyle =
      this.level.attr2attrVal.borderBottomStyle.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_borderLeftStyle = function () {
    this.node.style.borderLeftStyle =
      this.level.attr2attrVal.borderLeftStyle.transitionCalcVal;
  };


  LAID.Part.prototype.renderFn_borderTopColor = function () {
    this.node.style.borderTopColor =
      this.level.attr2attrVal.borderTopColor.transitionCalcVal.stringify();
  };
  LAID.Part.prototype.renderFn_borderRightColor = function () {
    this.node.style.borderRightColor =
      this.level.attr2attrVal.borderRightColor.transitionCalcVal.stringify();
  };
  LAID.Part.prototype.renderFn_borderBottomColor = function () {
    this.node.style.borderBottomColor =
      this.level.attr2attrVal.borderBottomColor.transitionCalcVal.stringify();
  };
  LAID.Part.prototype.renderFn_borderLeftColor = function () {
    this.node.style.borderLeftColor =
      this.level.attr2attrVal.borderLeftColor.transitionCalcVal.stringify();
  };

  LAID.Part.prototype.renderFn_borderTopWidth = function () {
    this.node.style.borderTopWidth =
      this.level.attr2attrVal.borderTopWidth.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_borderRightWidth = function () {
    this.node.style.borderRightWidth =
      this.level.attr2attrVal.borderRightWidth.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_borderBottomWidth = function () {
    this.node.style.borderBottomWidth =
      this.level.attr2attrVal.borderBottomWidth.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_borderLeftWidth = function () {
    this.node.style.borderLeftWidth =
      this.level.attr2attrVal.borderLeftWidth.transitionCalcVal + "px";
  };



  /* Text Related */

  LAID.Part.prototype.renderFn_text = function () {
    
    this.node.innerHTML =
     this.level.attr2attrVal.text.transitionCalcVal;

  };


  LAID.Part.prototype.renderFn_input = function () {

    this.node.value = inputVal;

  };

  LAID.Part.prototype.renderFn_textSize = function () {
   
    this.node.style.fontSize =
      computePxOrString( this.level.attr2attrVal.textSize );
  };
  LAID.Part.prototype.renderFn_textFamily = function () {
    this.node.style.fontFamily =
      this.level.attr2attrVal.textFamily.transitionCalcVal;
  };

  LAID.Part.prototype.renderFn_textWeight = function () {

    this.node.style.fontWeight =
      this.level.attr2attrVal.textWeight.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textColor = function () {
    this.node.style.color = 
      computeColorOrString( 
        this.level.attr2attrVal.textColor );
  };

  LAID.Part.prototype.renderFn_textVariant = function () {
    this.node.style.fontVariant =
      this.level.attr2attrVal.textVariant.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textStyle = function () {
    this.node.style.fontStyle =
      this.level.attr2attrVal.textStyle.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textDecoration = function () {
    this.node.style.textDecoration =
      this.level.attr2attrVal.textDecoration.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textAlign = function () {
    this.node.style.textAlign =
      this.level.attr2attrVal.textAlign.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textLetterSpacing = function () {
    this.node.style.letterSpacing = computePxOrString( 
        this.level.attr2attrVal.textLetterSpacing ) ;
  };
  LAID.Part.prototype.renderFn_textWordSpacing = function () {
    this.node.style.wordSpacing = computePxOrString( 
        this.level.attr2attrVal.textWordSpacing );
  };
  LAID.Part.prototype.renderFn_textLineHeight = function () {
    this.node.style.lineHeight = computeEmOrString( 
        this.level.attr2attrVal.textLineHeight );
  };

  LAID.Part.prototype.renderFn_textOverflow = function () {
    this.node.style.textOverflow =
      this.level.attr2attrVal.textOverflow.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textIndent = function () {
    this.node.style.textIndent =
      this.level.attr2attrVal.textIndent.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_textWhitespace = function () {
    this.node.style.whiteSpace =
      this.level.attr2attrVal.textWhitespace.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textSmoothing = function () {
    this.node.style[ cssPrefix + "font-smoothing" ] =
     this.level.attr2attrVal.textSmoothing.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textRendering = function () {
    this.node.style.textRendering =
      this.level.attr2attrVal.textRendering.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_textPaddingTop = function () {
    this.node.style.paddingTop =
      this.level.attr2attrVal.textPaddingTop.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_textPaddingRight = function () {
    this.node.style.paddingRight =
      this.level.attr2attrVal.textPaddingRight.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_textPaddingBottom = function () {
    this.node.style.paddingBottom =
      this.level.attr2attrVal.textPaddingBottom.transitionCalcVal + "px";
  };
  LAID.Part.prototype.renderFn_textPaddingLeft = function () {
    this.node.style.paddingLeft =
      this.level.attr2attrVal.textPaddingLeft.transitionCalcVal + "px";
  };

  LAID.Part.prototype.renderFn_textShadows = function () {
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

  /* Input (<input/> and <textarea>) Related */

  LAID.Part.prototype.renderFn_inputLabel = function () {
    this.node.label = this.level.attr2attrVal.inputLabel.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_inputRows = function () {
    this.node.rows = this.level.attr2attrVal.inputRows.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_input = function () {
    this.node.value = this.level.attr2attrVal.input.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_inputPlaceholder = function () {
    this.node.placeholder = this.level.attr2attrVal.inputPlaceholder.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_inputAutocomplete = function () {
    this.node.autocomplete = this.level.attr2attrVal.inputAutocomplete.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_inputAutocorrect = function () {
    this.node.autocorrect = this.level.attr2attrVal.inputAutocorrect.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_inputDisabled = function () {
    this.node.disabled = this.level.attr2attrVal.inputDisabled.transitionCalcVal;
  };


  /* Link (<a>) Related */

  LAID.Part.prototype.renderFn_linkHref = function () {
    this.node.href = this.level.attr2attrVal.linkHref.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_linkRel = function () {
    this.node.rel = this.level.attr2attrVal.linkRel.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_linkDownload = function () {
    this.node.download = this.level.attr2attrVal.linkDownload.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_linkTarget = function () {
    this.node.target = this.level.attr2attrVal.linkTarget.transitionCalcVal;
  };

  /* Image (<img>) related */
  LAID.Part.prototype.renderFn_imageUrl = function () {
    this.node.src = this.level.attr2attrVal.imageUrl.transitionCalcVal;
  };

  /* Audio (<audio>) related */
  LAID.Part.prototype.renderFn_audioSources = function () {
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

  LAID.Part.prototype.renderFn_audioTracks = function () {
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

  LAID.Part.prototype.renderFn_audioVolume = function () {
    this.node.volume = this.level.attr2attrVal.audioVolume.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_audioControls = function () {
    this.node.controls = this.level.attr2attrVal.audioControls.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_audioLoop = function () {
    this.node.loop = this.level.attr2attrVal.audioLoop.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_audioMuted = function () {
    this.node.muted = this.level.attr2attrVal.audioMuted.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_audioPreload = function () {
    this.node.preload = this.level.attr2attrVal.audioPreload.transitionCalcVal;
  };

  /* Video (<video>) related */
  LAID.Part.prototype.renderFn_videoSources = function () {
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

  LAID.Part.prototype.renderFn_videoTracks = function () {
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

  LAID.Part.prototype.renderFn_videoAutoplay = function () {
    this.node.autoplay = this.level.attr2attrVal.videoAutoplay.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_videoControls = function () {
    this.node.controls = this.level.attr2attrVal.videoControls.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_videoCrossorigin = function () {
    this.node.crossorigin = this.level.attr2attrVal.videoCrossorigin.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_videoLoop = function () {
    this.node.loop = this.level.attr2attrVal.videoLoop.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_videoMuted = function () {
    this.node.muted = this.level.attr2attrVal.videoMuted.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_videoPreload = function () {
    this.node.preload = this.level.attr2attrVal.videoPreload.transitionCalcVal;
  };
  LAID.Part.prototype.renderFn_videoPoster = function () {
    this.node.poster = this.level.attr2attrVal.videoPoster.transitionCalcVal;
  };



})();

( function () {
  "use strict";
  LAID.Query = function ( partLevelS ) {
    this.partLevelS = partLevelS;
  };
  
  LAID.Query.prototype.filterEq = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.eq(
        this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterNeq = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.neq(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterGt = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.gt(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterGte = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.gte(
      this.partLevelS, attr, val ) );
  };
  
  LAID.Query.prototype.filterLt = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.lt(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterLte = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.lte(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterRegex = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.regex(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterContains = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.contains(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterWithin = function ( attr, val ) {
    return new LAID.Query( 
      LAID.$filterUtils.within( this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterFn = function ( fnFilter ) {
  	return new LAID.Query( LAID.$filterUtils.fn(
      this.partLevelS, fnFilter ) );
  };

  LAID.Query.prototype.foldMin = function ( attr, val ) {
    return LAID.$foldUtils.min( this.partLevelS, attr, val );
  };

  LAID.Query.prototype.foldMax = function ( attr, val ) {
    return LAID.$foldUtils.max( this.partLevelS, attr, val );
  };

  LAID.Query.prototype.foldSum = function ( attr, val ) {
    return LAID.$foldUtils.sum( this.partLevelS, attr, val );
  };

  LAID.Query.prototype.foldFn = function ( fnFold, acc ) {
    return LAID.$foldUtils.fn( this.partLevelS, fnFold, acc );
  };


  LAID.Query.prototype.fetch = function ( index, attr ) {
  	return LAID.$queryUtils.fetch(
  		this.partLevelS, index, attr );
  };
  LAID.Query.prototype.length = function () {
    return this.partLevelS.length;
  };
  LAID.Query.prototype.end = function () {
  	return this.partLevelS;
  };


 
})();

(function () {
  "use strict";

  LAID.RelPath = function ( relativePath ) {


    this.me = false;
    this.many = false;

    if  ( relativePath === "" ) {
      this.me = true;

    } else if ( 
      ( relativePath === "*" ) ||
      ( relativePath === "many" ) ) { 
      this.many = true;

    } else {
      if ( relativePath[ 0 ] === "/" ) {
        this.absolute = true;
        this.absolutePath = relativePath;
      } else {
        this.absolute = false;
        this.numberOfParentTraversals =
         ( relativePath.match( /^(..\/)*/ )[ 0 ].length ) / 3;
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
    } else if ( this.many ) { 
      return referenceLevel.derivedMany.level;
    } else {
      if ( this.absolute ) {
          return LAID.$pathName2level[ this.absolutePath ];
      } else {
        for ( var i = 0; i < this.numberOfParentTraversals;
         ++i && (referenceLevel = referenceLevel.parentLevel ) ) {
        }

          return ( this.childPath === "" ) ? referenceLevel :
              LAID.$pathName2level[ referenceLevel.pathName +
              ( ( referenceLevel.pathName === "/" ) ? "" : "/" )+
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
        if ( attr === "$all" || attr === "$filtered" ) {
          return LAID.$arrayUtils.cloneSingleLevel( 
            path.resolve( this ).$getAttrVal( attr ).calcVal );
        } else {
          return path.resolve( this ).$getAttrVal( attr ).calcVal;          
        }
      };
    } else { // direct value provided
      _relPath00attr_S = [];
      // note that 'relativePath' is misleading name
      // here in this second overloaded case
      var directValue = relativePath;

      if ( directValue instanceof LAID.Take ) {
          this.$mergePathAndAttrs( directValue );
      }
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

  LAID.Take.prototype.$mergePathAndAttrs = function ( take ) {

    var _relPath00attr_S = take._relPath00attr_S;
    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {
      this._relPath00attr_S.push( _relPath00attr_S[ i ] );

    }
  };

  LAID.Take.prototype.add = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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

  LAID.Take.prototype.identical = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return LAID.identical( oldExecutable.call( this ),
          val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return LAID.identical( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LAID.Take.prototype.eq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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



  LAID.Take.prototype.neq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) !== val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) !== val;
      };
    }
    return this;
  };

  LAID.Take.prototype.gt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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


  LAID.Take.prototype.negative = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return -oldExecutable.call( this );
    };

    return this;
  };



  LAID.Take.prototype.key = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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

  LAID.Take.prototype.length = function ( val ) {
    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ).length;
    };

    return this;
  };


  LAID.Take.prototype.min = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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

  LAID.Take.prototype.abs = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.abs( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.pow = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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

  LAID.Take.prototype.log = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.log( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.match = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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

  LAID.Take.prototype.test = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).test( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).test( val );
      };
    }
    return this;

  };

  LAID.Take.prototype.concat = LAID.Take.prototype.add;


  LAID.Take.prototype.format = function () {

    var argS = Array.prototype.slice.call( arguments ),
      takeFormat = new LAID.Take( LAID.$format );

    argS.unshift( this );

    return takeFormat.fn.apply( takeFormat, argS );

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






  LAID.Take.prototype.colorEquals = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).equals( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).equals( val );
      };
    }
    return this;

  };


  LAID.Take.prototype.colorLighten = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

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


  LAID.Take.prototype.colorAlpha = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

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
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val );
      };
    }
    return this;
  };


  LAID.Take.prototype.colorGreen = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorBlue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorHue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorSaturation = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorLightness = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.queryLength = LAID.Take.prototype.length;

  LAID.Take.prototype.queryFetch = function ( index, attr ) {

    var oldExecutable = this.executable;

    if ( index instanceof LAID.Take ) {
      this.$mergePathAndAttrs( index );

      if ( attr instanceof LAID.Take ) {
        this.$mergePathAndAttrs( attr );
        this.executable = function () {
          return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index.execute( this ),
            attr.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index.execute( this ),
            attr
          );
        }
      }
    } else if ( attr instanceof LAID.Take ) {
      this.$mergePathAndAttrs( attr );
      this.executable = function () {
        return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index,
            attr.execute( this )
          );
      }

    } else {
      this.executable = function () {
        return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index,
            attr
          );
      }
    }

    return this;

  };

  LAID.Take.prototype.filterEq = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAID.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAID.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAID.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }

    } else {

      this.executable = function () {
        return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }

    return this;

  };

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

        this.$mergePathAndAttrs( arg );
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

        this.$mergePathAndAttrs( arg1 );

        if ( arg2 instanceof LAID.Take ) {

          this.$mergePathAndAttrs( arg2 );

          this.executable = function () {
            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2.execute( this ) );
          };

        } else {
          this.executable = function () {

            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2 );
          };
        }

      } else if ( arg2 instanceof LAID.Take ) {

        this.$mergePathAndAttrs( arg2 );
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

          this.$mergePathAndAttrs( curArg );

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

    this.$mergePathAndAttrs( fn );
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

this.$mergePathAndAttrs( fn );

if ( arg instanceof LAID.Take ) {

this.$mergePathAndAttrs( arg );

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

this.$mergePathAndAttrs( arg );

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

this.$mergePathAndAttrs( curArg );

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

  LAID.Transition = function ( type, delay, duration, args, done ) {
    this.done = done;
    this.delay = delay;
    this.transition = ( transitionType2fn[ type ] )( duration, args );

  };

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
    "spring": function ( duration, args ) {
      return new LAID.$springTransition( duration, args );
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

  function takeColor ( color ) {

    return LAID.color( color );

  }

  LAID.color = function ( colorName ) {

    if ( colorName instanceof LAID.Take ) {
        return new LAID.Take( takeColor ).fn( colorName );
    } else {
        colorName = colorName.toLowerCase();
        var colorValue = colorName2colorValue[ colorName ];
        if ( colorValue === undefined ) {
          throw ("LAID Error: Color name: " + colorName +  " not found." );
        }
        else {
          return new LAID.Color( 'rgb', colorValue, 1 );

        }
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

( function () {
	"use strict";
	LAID.filter = function ( rowsWrapper ) {
		return new LAID.Filter( rowsWrapper );
	}

})();

( function () {
	"use strict";

	LAID.formation = function ( name, fn ) {
		LAID.$formationName2fn[ name ] = fn;

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

( function () {
  "use strict";
  
  // source: chai.js (https://github.com/chaijs/deep-eql)
  /*!
	* deep-eql
	* Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
	* MIT Licensed
	*/

  /**
	 * Assert super-strict (egal) equality between
	 * two objects of any type.
	 *
	 * @param {Mixed} a
	 * @param {Mixed} b
	 * @param {Array} memoised (optional)
	 * @return {Boolean} equal match
	 */

  LAID.$identical = function ( a, b ) {
  	return deepEqual( a, b, undefined );
  };

  	/*!
	* Module dependencies
	*/

	function type (x) {
		return LAID.type(x);
	}

  function deepEqual(a,b,m) {
  	var
  		typeA = type( a ),
  		typeB = type( b );

  	if ( sameValue( a, b ) ) {
			return true;
		} else if ( 'color' === typeA ) {
			return colorEqual(a, b);
		} else if ( 'level' === typeA ) {
			return levelEqual(a, b);
		} else if ('date' === typeA ) {
			return dateEqual(a, b);
		} else if ('regexp' === typeA) {
			return regexpEqual(a, b);
		} else if (Buffer.isBuffer(a)) {
			return bufferEqual(a, b);
		} else if ('arguments' === typeA) {
			return argumentsEqual(a, b, m);
		} else if (('object' !== typeA && 'object' !== typeB)
		&& ('array' !== typeA && 'array' !== typeB)) {
			return sameValue(a, b);
		} else {
			return objectEqual(a, b, m);
		}
  }

	/*!
	* Buffer.isBuffer browser shim
	*/

	var Buffer;
	try { Buffer = require('buffer').Buffer; }
	catch(ex) {
	Buffer = {};
	Buffer.isBuffer = function() { return false; }
	}

	/*!
	* Primary Export
	*/



	/*!
	* Strict (egal) equality test. Ensures that NaN always
	* equals NaN and `-0` does not equal `+0`.
	*
	* @param {Mixed} a
	* @param {Mixed} b
	* @return {Boolean} equal match
	*/

	function sameValue(a, b) {
		if (a === b) return a !== 0 || 1 / a === 1 / b;
		return a !== a && b !== b;
	}


	/*!
	* Compare two Date objects by asserting that
	* the time values are equal using `saveValue`.
	*
	* @param {Date} a
	* @param {Date} b
	* @return {Boolean} result
	*/

	function dateEqual(a, b) {
		if ('date' !== type(b)) return false;
		return sameValue(a.getTime(), b.getTime());
	}


	function colorEqual (a, b) {
		return type(b) === "color" && a.equals(b);		
	}

	function levelEqual (a, b) {
		return type(b) === "level" && ( a.pathName === b.pathName );		
	}

	/*!
	* Compare two regular expressions by converting them
	* to string and checking for `sameValue`.
	*
	* @param {RegExp} a
	* @param {RegExp} b
	* @return {Boolean} result
	*/

	function regexpEqual(a, b) {
		if ('regexp' !== type(b)) return false;
		return sameValue(a.toString(), b.toString());
	}

	/*!
	* Assert deep equality of two `arguments` objects.
	* Unfortunately, these must be sliced to arrays
	* prior to test to ensure no bad behavior.
	*
	* @param {Arguments} a
	* @param {Arguments} b
	* @param {Array} memoize (optional)
	* @return {Boolean} result
	*/

	function argumentsEqual(a, b, m) {
		if ('arguments' !== type(b)) return false;
		a = [].slice.call(a);
		b = [].slice.call(b);
		return deepEqual(a, b, m);
	}

	/*!
	* Get enumerable properties of a given object.
	*
	* @param {Object} a
	* @return {Array} property names
	*/

	function enumerable(a) {
		var res = [];
		for (var key in a) res.push(key);
		return res;
	}

	/*!
	* Simple equality for flat iterable objects
	* such as Arrays or Node.js buffers.
	*
	* @param {Iterable} a
	* @param {Iterable} b
	* @return {Boolean} result
	*/

	function iterableEqual(a, b) {
		if (a.length !==  b.length) return false;

		var i = 0;
		var match = true;

		for (; i < a.length; i++) {
		if (a[i] !== b[i]) {
		  match = false;
		  break;
		}
		}

		return match;
	}

	/*!
	* Extension to `iterableEqual` specifically
	* for Node.js Buffers.
	*
	* @param {Buffer} a
	* @param {Mixed} b
	* @return {Boolean} result
	*/

	function bufferEqual(a, b) {
		if (!Buffer.isBuffer(b)) return false;
		return iterableEqual(a, b);
	}

	/*!
	* Block for `objectEqual` ensuring non-existing
	* values don't get in.
	*
	* @param {Mixed} object
	* @return {Boolean} result
	*/

	function isValue(a) {
		return a !== null && a !== undefined;
	}

	/*!
	* Recursively check the equality of two objects.
	* Once basic sameness has been established it will
	* defer to `deepEqual` for each enumerable key
	* in the object.
	*
	* @param {Mixed} a
	* @param {Mixed} b
	* @return {Boolean} result
	*/

	function objectEqual(a, b, m) {
		if (!isValue(a) || !isValue(b)) {
			return false;
		}

		if (a.prototype !== b.prototype) {
			return false;
		}

		var i;
		if (m) {
			for (i = 0; i < m.length; i++) {
		 	 if ((m[i][0] === a && m[i][1] === b)
		 	 ||  (m[i][0] === b && m[i][1] === a)) {
		 	   return true;
		 	 }
			}
		} else {
			m = [];
		}

		try {
			var ka = enumerable(a);
			var kb = enumerable(b);
		} catch (ex) {
			return false;
		}

		ka.sort();
		kb.sort();

		if (!iterableEqual(ka, kb)) {
			return false;
		}

		m.push([ a, b ]);

		var key;
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!deepEqual(a[key], b[key], m)) {
			  return false;
			}
		}

		return true;
	}




})();
(function() {
  "use strict";

  LAID.level = function ( path ) {

    return LAID.$pathName2level[ path ];

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


  function takeRGBA ( r, g, b, a ) {

    return new LAID.Color( "rgb", { r: r, g: g, b: b }, a );

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

    setRuntimeGlobals();

    ( new LAID.Level( "/", rootLson, undefined ) ).$init();

    LAID.$solve();

    window.onresize = updateSize;

  };

  function setRuntimeGlobals () {
  
    
    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

    LAID.$centerX = LAID.take("", "width").divide(2);
    LAID.$centerY = LAID.take("", "height").divide(2);
    LAID.$right = LAID.take("", "width");
    LAID.$bottom = LAID.take("", "height");

    /*
    LAID.$takeNaturalHeightInput =
      new LAID.Take( "", "$naturalHeightInput");
    LAID.$takeNaturalWidthInput =
      new LAID.Take( "", "$naturalWidthInput");
    */

    LAID.$displayNoneFormationState = {
      onlyif: LAID.take("","$f").eq(-1),
      props: {
        display:false
      }
    };
    LAID.$formationState = {
      onlyif: LAID.take("", "$f").gt(1),
      props: {
        top: LAID.take("", "root.top"),
        left: LAID.take("", "root.left")
      }
    };
  }

  function updateSize () {

    var rootLevel = LAID.$pathName2level[ "/" ];

    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );

  }




})();

(function() {
  "use strict";


  LAID.take = function ( relativePath, prop ) {

    if ( ( prop !== undefined ) &&
    	( LAID.$checkIsValidUtils.checkIsAttrExpandable( prop ) ) ) {
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
  '[object RegExp]':    'regexp',
  '[object Object]':    'object',
  '[object Error]':     'error'
};


  LAID.type = function( obj ) {
    if ( obj === null ) {
      return obj + "";
    } else if ( obj instanceof LAID.Color ) {
      return "color";
    } else if ( obj instanceof LAID.Take ) {
      return "take";
    } else if ( obj instanceof LAID.Level ) {
      return "level"
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

    var 
    	i, len,
    	cloggedLevelS = LAID.cloggedLevelS;
    for ( i = 0, len = cloggedLevelS.length; i < len; i++ ) {
      LAID.$newLevelS.push( cloggedLevelS[ i ] );
    }
    LAID.$solve();
    
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

    /* Prepend element, if preset already then remove and prepend */
    prependUnique: function ( elementS, element ) {
      LAID.$arrayUtils.remove( elementS, element );
      elementS.unshift( element );
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
      
    },

    /*Swap element at index a with index b */
    swap: function ( elementS, a, b ) {
      var tmp = elementS[ a ];
      elementS[ a ] = elementS[ b ];
      elementS[ b ] = tmp;
    }

  };





})();

(function(){
  "use strict";
  LAID.$capitalize = function( string ) {

    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );

  };
})();

(function(){	
  "use strict";


  var reservedNameS = [ 
    "root", "transition", "data", "when", "load",
    "",
    "many", "formation", "formationDisplayNone",
     "sort", "fargs",
    "rows", "row", "filter", "args", "all"
  ];

  function stripStateAttrPrefix( attr ) {
    var nonStateAttrPrefixS = [ "data", "when", "transition" ];
    var i = attr.indexOf(".");
    if ( i === -1 ) {
      return attr;
    } else {
      var prefix = attr.slice( 0, i );
      if ( nonStateAttrPrefixS.indexOf( prefix ) !== -1 ) {
        return attr;
      } else {
        return attr.slice( i + 1 );
      }
    }
  }

  LAID.$checkIsValidUtils = {
  	levelName: function ( levelName ) {
  		return ( /^[\w\-]+$/ ).test( levelName ) &&
        ( reservedNameS.indexOf( levelName ) === -1 );
  	},
  	/*
  	* Rules of a state name:
  	* (1) Must only contain alphanumeric characters, the underscore ("_"), or the hyphen ("-")
  	* (2) Must contain atleast one character
  	* (3) Must not be a reserved name with the exception of "root"
  	*/
  	stateName: function ( stateName ) {
  		 return (
       ( ( ( /^[\w\-]+$/ ).test( stateName ) ) &&
		    ( 
          ( reservedNameS.indexOf( stateName ) === -1 ) ||
          stateName === "root"
        )
      )
       || 
       ( stateName === "formation") || 
       ( stateName === "formationDisplayNone")
       );
  	},

    checkIsAttrExpandable: function ( attr ) {
      return this.checkIsNonPropAttrExpandable( attr ) ||
        this.checkIsPropAttrExpandable( attr );
    },

  	checkIsNonPropAttrExpandable: function ( attr ) {
  		var expanderAttrS = [
			    "data", "when", "transition", "states", "fargs", "sort"
			];
			 var regexExpanderAttrs = /(^sort\.\d+$)|(^fargs\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+\.args$)|(^when\.[a-zA-Z]+$)/;

  		var strippedStateAttr = stripStateAttrPrefix( attr );
    	return ( ( expanderAttrS.indexOf( strippedStateAttr ) !== -1 ) ||
      	( regexExpanderAttrs.test( strippedStateAttr ) )
    	);
  	},

    checkIsPropAttrExpandable: function ( attr ) {
      var expanderPropS = [
        "border", "background", "boxShadows", "textShadows",
         "videoSources", "audioSources", "videoTracks", "audioTracks",
          "filters","borderTop", "borderRight", "borderBottom", "borderLeft",
      ];
       var regexExpanderProps = /(^boxShadows\d+$)|(^textShadows\d+$)|(^videoSources\d+$)|(^audioSources\d+$)|(^videoTracks\d+$)|(^audioTracks\d+$)|(^filters\d+$)|(^filters\d+DropShadow$)/;

      var strippedStateAttr = stripStateAttrPrefix( attr );
      return ( ( expanderPropS.indexOf( strippedStateAttr ) !== -1 ) ||
        ( regexExpanderProps.test( strippedStateAttr ) )
      );
    },

  	propAttr: function ( attr ) {
  		return ( ( attr.indexOf( "." ) === -1 ) &&
     		( attr[ 0 ] !== "$") &&
        ( reservedNameS.indexOf( attr ) === -1 )
       );
  	},

  	// source: underscore.js
  	nan: function ( num ) {
  		return ( typeof val === "number" ) &&
	     ( val !== +val );
  	}

  };

})();
( function () {
  "use strict";

  LAID.$clearDataTravellingAttrVals = function () {

    var

      x, y,
      yLen,
      renderDirtyPartS = LAID.$renderDirtyPartS,
      renderDirtyPart,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal;

      for ( x = 0; x < renderDirtyPartS.length; x++ ) {

        renderDirtyPart = renderDirtyPartS[ x ];
        travelRenderDirtyAttrValS = renderDirtyPart.travelRenderDirtyAttrValS;


        for ( y = 0, yLen = travelRenderDirtyAttrValS.length; y < yLen; y++ ) {

          travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ 0 ];
          if ( travelRenderDirtyAttrVal.renderCall ) {

            travelRenderDirtyAttrVal.startCalcVal =
              travelRenderDirtyAttrVal.transitionCalcVal;

            // Adding to the "normal" render list automatically
            // removes the attrval from the "travel" render list
            renderDirtyPart.addNormalRenderDirtyAttrVal(
              travelRenderDirtyAttrVal
            );
          } else {
            LAID.$arrayUtils.remove( travelRenderDirtyAttrValS,
              travelRenderDirtyAttrVal
            );
          }



        }

      }


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

  var essentialProp2defaultValue;

  LAID.$defaultizeManyLson = function ( lson ) {
    
    var
      essentialProp,
      rootState = lson.states.root;
        
    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootState[ essentialProp ] === undefined ) {
        rootState[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }
  };

  essentialProp2defaultValue = {
    filter:  new LAID.Take( "", "$all" ),
    sort: [],
    formation: "onebelow",
    rows: [],
    fargs: {
      onebelow: {
        gap: 0
      },
      totheright: {
        gap: 0
      }
    }
    
  };


})();

( function () {
  "use strict";

  var
    essentialProp2defaultValue,
    lazyProp2defaultValue,
    fnPosToCenter,
    fnPosToEdge,
    takeLeft,
    takeWidth,
    takeTop,
    takeHeight,
    takeLeftToCenterX,
    takeLeftToRight,
    takeTopToCenterY,
    takeTopToBottom;


  LAID.$defaultizePartLson = function ( lson ) {
    var
      essentialProp,
      rootState = lson.states.root,
      rootStateProps = rootState.props,
      rootStateWhen = rootState.when,
      rootStateTransition = rootState.transition,
      props,
      states = lson.states,
      stateName, state,
      prop,
      when, transition, metaMax, maxProp,
      eventType, transitionProp;

    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootStateProps[ essentialProp ] === undefined ) {
        rootStateProps[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }

    if ( states ) {
      for ( stateName in states ) {
        state = states[ stateName ];
        props = state.props;
        when = state.when;
        transition = state.transition;
        metaMax = state.$$max;

        if ( props.left || props.left === 0 ) {
          takeLeft = new LAID.Take( "",  stateName + ".left" );

          props.centerX = new LAID.Take( fnPosToCenter ).fn(
            takeLeft, takeWidth );
          props.right = new LAID.Take( fnPosToEdge ).fn(
            takeLeft, takeWidth );
        }

        if ( props.top || props.top === 0 ) {
          takeTop = new LAID.Take( "",  stateName + ".top" );

          props.centerY = new LAID.Take( fnPosToCenter ).fn(
            takeTop, takeHeight );
          props.bottom = new LAID.Take( fnPosToEdge ).fn(
            takeTop, takeHeight );  
       }

        for ( prop in props ) {

          if ( ( rootStateProps[ prop ] === undefined ) &&
              ( lazyProp2defaultValue[ prop ] !== undefined )
            ) {
              rootStateProps[ prop ] = lazyProp2defaultValue[ prop ];
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
        if ( !rootStateWhen[ eventType ] ) {
          rootStateWhen[ eventType ] = [];
        }
      }

      for ( transitionProp in rootStateTransition ) {
        if ( !rootStateTransition[ transitionProp ] )  {
          rootStateTransition[ transitionProp ] = {};
        }
      }
    }

    if ( rootStateProps.text !== undefined &&
        ( lson.$type === undefined || lson.$type === "none" ) ) {
      lson.$type = "text";
    } else if ( lson.$type === undefined ) {
      lson.$type = "none";
    } else if ( lson.$type.startsWith( "input:" ) ) {
      lson.$inputType = lson.$type.slice( ( "input:" ).length );
      /*
      if ( rootStateProps.width ===
       essentialProp2defaultValue.width ) {
        rootStateProps.width = takeNaturalWidthInput;
      }
      if ( rootStateProps.height ===
       essentialProp2defaultValue.height ) {
        rootStateProps.height = takeNaturalHeightInput;
      }*/

    }

  };
/*
  takeActualBottomWithRotateZ = new LAID.Take(function( top, height, width,
     rotateZ, originX, originY ){

    var
      rotateZradians = ( Math.PI / 180) * rotateZ,
      leftSegmentLength = width * ( 1 - originX ),
      rightSegmentLength = width * ( originX );

    return top + ( ( 1 - originY ) * height ) +
    Math.abs( Math.cos( rotateZradians ) * ( height / 2 ) ) +
      Math.max(
        Math.sin( rotateZradians ) * leftSegmentLength,
        Math.sin( -rotateZradians ) * rightSegmentLength
      );

    }).fn( LAID.take("", "top"),
        LAID.take("", "height"),
        LAID.take("", "width"),
        LAID.take("", "rotateZ"),
        LAID.take("", "originX"),
        LAID.take("", "originY")
        );

*/


  

  essentialProp2defaultValue = {
    width:  new LAID.Take( "", "$naturalWidth" ),
    height:  new LAID.Take( "", "$naturalHeight" ),
    top: 0,
    left: 0
  };

  fnPosToCenter = function( pos, dim ) {
    return pos + ( dim / 2 );
  };

  fnPosToEdge = function( pos, dim ) {
    return pos + ( dim );
  };



  takeWidth = new LAID.Take( "", "width" );
  takeHeight = new LAID.Take( "", "height" );

  /*
  takeLeft = new LAID.Take( "", "left" );
  takeTop = new LAID.Take( "", "top" );
  
  takeLeftToCenterX = new LAID.Take( fnPosToCenter ).fn( takeLeft, takeWidth );
  takeLeftToRight = new LAID.Take( fnPosToEdge ).fn( takeLeft, takeWidth );
  takeTopToCenterY = new LAID.Take( fnPosToCenter ).fn( takeTop, takeHeight );
  takeTopToBottom = new LAID.Take( fnPosToEdge ).fn( takeTop, takeHeight );
  */

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
    userSelect: "all",
    zIndex: "auto",
    overflowX: "hidden",
    overflowY: "hidden",
    scrollX: 0,
    scrollY: 0,
    scrollElastic: true,
    cursor: "auto",
    backgroundColor: LAID.transparent(),
    backgroundImage: "none",
    backgroundAttachment: "scroll",
    backgroundRepeat: true,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: "auto",
    backgroundSizeY: "auto",

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
    textSize: "medium",
    textFamily: "inherit",
    textWeight: "normal",
    textColor: "inherit",
    textVariant: "normal",
    textStyle: "normal",
    textDecoration: "none",
    textAlign: "start",
    textLetterSpacing: "normal",
    textWordSpacing: "normal",
    textLineHeight: 1,
    textOverflow: "clip",
    textIndent: 0,
    textWhitespace: "normal",
    textSmoothing: "subpixel-antialiased",
    textRendering: "auto",

    textPaddingTop: 0,
    textPaddingRight: 0,
    textPaddingBottom: 0,
    textPaddingLeft: 0,

    input: "",
    inputLabel: "",
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

  var $inputEvent2fn = {
    click: function () {
      this.$changeAttrVal( "$input", this.part.node.value );
    },
    change: function () {
      this.$changeAttrVal( "$input", this.part.node.value );
    },
    keyup: function () {
      this.$changeAttrVal( "$input", this.part.node.value );
    }
  };

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
        this.$changeAttrVal( "$scrolledX",
          this.part.node.scrollTop );
      }
    },
    $scrolledY: {
      scroll: function () {
        this.$changeAttrVal( "$scrolledY",
         this.part.node.scrollLeft );
      }
    },
    $cursorX: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorX",
          this.part.node.offsetX );
      }
    },
    $cursorY: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorY",
          this.part.node.offsetY );
      }
    },

    $input: $inputEvent2fn,
    /*$naturalWidth: $inputEvent2fn,
    $naturalHeight: $inputEvent2fn,*/

    $inputChecked: {
      change: function () {
        this.$changeAttrVal( "$inputChecked", this.checked );
      }
    }

  };


  LAID.$eventReadonlyUtils = {
    checkIsEventReadonlyAttr: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ] !==
        undefined;
    },
    getEventType2fnHandler: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ];
    },

  };


})();

( function () {
  "use strict";

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
})();



( function () {
	"use strict";

	LAID.$filterUtils = {
		eq: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) === val;
				}, partLevelS );
		},
		
		neq: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) !== val;
				}, partLevelS );
		},

		gt: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) > val;
				}, partLevelS );
			
		},
		
		gte: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr )>= val;
				}, partLevelS );
			
		},
		lt: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) < val;
				}, partLevelS );
			
		},
		lte: function ( partLevelS, attr, val ) {
			return  filter( function ( partLevel ) {
					return partLevel.attr( attr ) <= val;
				}, partLevelS );
			
		},
		regex: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return val.test( partLevel.attr( attr ) );
				}, partLevelS );
			
		},
		contains: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ).indexOf( val ) !== -1;
				}, partLevelS );
			
		},
		within: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return val.indexOf( partLevel.attr( attr ) ) !== -1;
				}, partLevelS );
			
		},

		fn: function ( partLevelS, fnFilter ) {
			return filter( fnFilter , partLevelS );
		}
		

	};

	function filter ( fnFilter, partLevelS ) {
		var filteredPartLevelS = [];
		for ( var i = 0, len = partLevelS.length, partLevel; i < len; i++ ) {
			partLevel = partLevelS[ i ];
			if ( fnFilter( partLevel ) ) {
				filteredPartLevelS.push( partLevel );
			} 
		}
		return filteredPartLevelS;
	}

})();

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

    /*
    if ( prop === "$input" ) {
      return prop;
    }*/

    if ( !LAID.$checkIsValidUtils.propAttr( prop ) ||
      ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf( prop ) !== -1 ||
      LAID.$shorthandPropsUtils.checkIsDecentralizedShorthandProp( prop ) ) {
        return undefined;
      } else {
        multipleTypePropMatchDetails = LAID.$findMultipleTypePropMatchDetails(
        prop );

        if ( multipleTypePropMatchDetails ) {
          return multipleTypePropMatchDetails[ 1 ];
        }

        renderCall = 
          LAID.$shorthandPropsUtils.getShorthandPropCenteralized(
            prop );
        if ( renderCall !== undefined ) {
          return renderCall;
        }
        return prop;
      }
    };
})();

( function () {
  "use strict";

  LAID.$foldlUtils = {
    min: function ( partLevelS, attr, val ) {
      return fold( function ( part, acc ) {
        var val = part.attr( attr );
          if ( ( acc === undefined ) || ( val < acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, partLevelS ); 
    },
    max: function ( partLevelS, attr, val ) {
      return fold( function ( part, acc ) {
        var val = part.attr( attr );
          if ( ( acc === undefined ) || ( val > acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, partLevelS ); 
    },
    sum: function ( partLevelS, attr, val ) {
      return fold( function ( part, acc ) {
        return acc + part.attr( attr );
        }, 0, partLevelS ); 
    },

    
    fn: function ( partLevelS, fnFold, acc ) {
      return fold( fnFold, acc, partLevelS );      
    },
  

  };

  function fold ( fnFold, acc, partLevelS ) {
    for ( var i = 0, len = partLevelS.length; i < len; i++ ) {
      acc = fnFold( partLevelS[ i ], acc );
    }
    return acc;
  }

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
          argS = Array.prototype.slice.call(arguments),
          arg;

        try {
          // result contians the formattable string
          result = argS[ 0 ];
          for ( i = 1; i < argSLength; i++ ) {
            arg = argS[ i ];
            if (result.match(/%([.#0-9\-]*[bcdefosuxX])/)) {
              arg = arg instanceof LAID.Color ? arg.stringify() : arg; 
              result = new Formatter(RegExp.$1).format(result, arg );
            }
          }
          return result;
        } catch (err) {
          return "";
        }

    };

}());

( function () {
	"use strict";

	LAID.$formationName2fn = {
		onebelow: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.$setFormationXY( undefined,
				LAID.take(filteredLevelS[ f - 2 ].pathName, "bottom").add(
					LAID.take("*", "fargs.onebelow.gap")) );
		},
		totheright: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.$setFormationXY(
				LAID.take(filteredLevelS[ f - 2 ].pathName, "right").add(
					LAID.take("*", "fargs.totheright.gap")),
					undefined );
		}
	};
})();
( function () {
  "use strict";

  LAID.$generateColorMix = function ( startColor, endColor, fraction ) {

      var
        startColorRgbaDict = startColor.getRgba(),
        endColorRgbaDict = endColor.getRgba(),
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
    $naturalWidthInput: null,
    $naturalHeightInput: null,
    $absoluteX: null,
    $absoluteY: null,
    $centerX: 0,
    $centerY: 0,
    $right: 0,
    $bottom: 0,

    //$numberOfChildren: null,
    $dataTravelling: false,
    $dataTravelDelta: 0.0,
    $dataTravelLevel: null,

    $hovered: false,
    $focused: false,
    $clicked: false,
    $scrolledX: 0,
    $scrolledY: 0,
    $cursorX: 0,
    $cursorY: 0,
    $input: "",
    $inputChecked: false
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
  * Inherit the root, state, or many LSON from `from` into `into`.
  */
  LAID.$inherit = function ( into, from, isMany, isState, isRootState ) {

    if ( !isState ) {
      for ( var key in from ) {
        if ( from[ key ] ) {
          if ( key2fnInherit[ key ] ) {
            key2fnInherit[ key ]( into, from, isMany );
          } else {
            if ( key !== "$interface" ) {
              into[ key ] = from[ key ];
            }
          }
        }
      }
    } else {

      if ( !isRootState ) {
        into.onlyif = from.onlyif || into.onlyif;
        into.install = from.install || into.install;
        into.uninstall = from.uninstall || into.uninstall;
      }

      if ( isMany ) {
        into.formation = from.formation || into.formation;
        into.filter = from.filter || into.filter;
        key2fnInherit.fargs( into, from );
        into.sort = from.sort || into.sort;

      } else {
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
    }
  };

  function inheritTransitionProp ( intoTransition, fromTransition,
    intoTransitionProp, fromTransitionProp ) {


      var
        fromTransitionDirective = fromTransition[ fromTransitionProp ],
        intoTransitionDirective = intoTransition[ intoTransitionProp ],
        fromTransitionArgKey2val,  intoTransitionArgKey2val,
        fromTransitionArgKey;


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


      data: function( intoLson, fromLson ) {

        inheritSingleLevelObject( intoLson, fromLson, "data" );

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

        LAID.$inherit( intoLson.many, fromLson.many, false, false, false );

      },

      rows: function( intoLson, fromLson ) {

        var
          intoLsonRowS = intoLson.rows,
          fromLsonRowS = fromLson.rows,
          fromLsonRow;

        if ( intoLsonRowS ) {
          intoLson.rows = new Array( fromLsonRowS.length );
          intoLsonRowS = intoLson.rows;
          for ( var i = 0, len = fromLsonRowS.length; i < len; i++ ) {

            fromLsonRow = fromLsonRowS[ i ];
            intoLsonRowS[ i ] = checkIsMutable( fromLsonRow ) ?
              LAID.$clone( fromLsonRow ) : fromLsonRow;

          }
        }

      },

      fargs: function ( intoLson, fromLson ) {

        var
          formationFarg,
          intoFargs = intoLson.fargs,
          fromFargs = fromLson.fargs;

        if ( fromFargs ) {
          if ( !intoFargs ) {
            intoFargs = intoLson.fargs = {};
          }
          for ( formationFarg in fromFargs ) {
            if ( !intoFargs[ formationFarg  ] ) {
              intoFargs[ formationFarg ] = {};
            } 
            inheritSingleLevelObject( 
              intoFargs, fromFargs, formationFarg );
            
          }
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
          LAID.$inherit( intoChildName2lson[ name ], fromChildName2lson[ name ],
             false, false, false );

        }
      },

      states: function( intoLson, fromLson, isMany ) {

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

          LAID.$inherit( intoStateName2state[ name ],
           fromStateName2state[ name ], isMany, true, false );

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

  var
    normalizedExternalLsonS = [],
    fnCenterToPos,
    fnEdgeToPos,
    takeWidth,
    takeHeight,
    takeFilterAll,
    key2fnNormalize;

  

  LAID.$normalize = function( lson, isExternal ) {

    if ( isExternal ) {
      // If we haven't previously normalized it, only then proceed
      if ( normalizedExternalLsonS.indexOf( lson ) === -1 ) {

        normalize( lson, true );
        normalizedExternalLsonS.push( lson );

      }

    } else {      
      normalize( lson, false );
    }
  };

  function normalize( lson, isRecursive ) {

    var
      lsonKey,
      rootLson = lson;

    if ( !lson.$$normalized ) {

      if ( !lson.states ) {
        lson.states = {};
      }


      if ( lson.states.root ) {
        throw "LAID Error: State name 'root' is reserved.";
      }

      lson.states.root = {
        props: lson.props,
        when: lson.when,
        transition: lson.transition
      };

      for ( lsonKey in lson ) {
        if ( lsonKey !== "children" || isRecursive ) {
          if ( !key2fnNormalize[ lsonKey ] ) {
            throw "LAID Error: LSON key: '" + lsonKey  + "' not found";
          }
          key2fnNormalize[ lsonKey ]( lson );
        }
      }

      lson.props = undefined;
      lson.when = undefined;
      lson.transition = undefined;

      lson.$$normalized = true;

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

    } else if ( type === "object" ) {

      for ( var subKey in val ) {

        flattenedProp = prefix + LAID.$capitalize( subKey );
        flattenProp( props, val, subKey, flattenedProp );

        obj[ key ] = undefined;
      }

    } else {

      if ( LAID.$checkIsValidUtils.checkIsPropAttrExpandable( prefix ) ) {
        checkAndThrowErrorAttrAsTake( prefix, val );
      }

      props[ prefix ] = val;

    }
  }







  fnCenterToPos = function( center, dim ) {
    return center - ( dim / 2 );
  };

  fnEdgeToPos = function( edge, dim ) {
    return edge - ( dim );
  };


  takeWidth = new LAID.Take( "", "width" );
  takeHeight = new LAID.Take( "", "height" );
  takeFilterAll = new LAID.Take("", "$all");



  key2fnNormalize = {
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
    $type: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$type", lson.$type );
    },

    $inherit: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "$inherit", lson.$inherit );
      if ( ( lson.$inherit !== undefined ) &&
        LAID.type( lson.$inherit ) !== "array" ) {
          lson.$inherit = [ lson.$inherit ];
        }

    },

    $interface: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$interface", lson.$interface );
    },

    $observe: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$observe", lson.$observe );
    },

    load: function ( lson ) {
      // do nothing
    },

    data: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "data", lson.data );

    },
    /*
    * normalize the `lson`
    */
    props: function( lson ) {

      var
        prop2val = lson.props,
        prop, val,
        longhandPropS, longhandProp, shorthandVal,
        multipleTypePropMatchDetails,curMultipleMax,
        i, len;


      if ( lson.props === undefined ) {

        prop2val = lson.props = {};

      }

      checkAndThrowErrorAttrAsTake( "props", lson.props );


      if ( prop2val.centerX !== undefined ) {
        prop2val.left = ( new LAID.Take( fnCenterToPos ) ).fn(
           prop2val.centerX, takeWidth );
      }

      if ( prop2val.right !== undefined ) {
        prop2val.left = ( new LAID.Take( fnEdgeToPos ) ).fn(
           prop2val.right, takeWidth );
      }

      if ( prop2val.centerY !== undefined ) {
        prop2val.top = ( new LAID.Take( fnCenterToPos ) ).fn(
           prop2val.centerY, takeHeight );
      }

      if ( prop2val.bottom !== undefined ) {
        prop2val.top = ( new LAID.Take( fnEdgeToPos ) ).fn(
           prop2val.bottom, takeHeight );
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
          if ( LAID.$checkIsValidUtils.checkIsPropAttrExpandable( transitionProp ) ) {
            throw ( "LAID Error: transitions for special/expander props such as '" + name  + "' are not permitted." );
          }
          transitionDirective = transition[ transitionProp ];
          checkAndThrowErrorAttrAsTake( "transition." + transitionProp,
          transitionDirective  );

          transitionArgKey2val = transitionDirective.args;
          if ( transitionArgKey2val !== undefined ) {

            checkAndThrowErrorAttrAsTake( "transition." + transitionProp + ".args",
            transitionArgKey2val  );

          }
        }
      }
    }
  },

  states: function( lson, isMany ) {

    if ( lson.states !== undefined ) {

      var stateName2state = lson.states, state;
      checkAndThrowErrorAttrAsTake( "states",  stateName2state );

      for ( var stateName in stateName2state ) {

        if ( !LAID.$checkIsValidUtils.stateName( stateName ) ) {
          throw ( "LAID Error: Invalid state name: " + stateName );
        }

        state = stateName2state[ stateName ];

        checkAndThrowErrorAttrAsTake( "states." + stateName, state );

        if ( !isMany ) {
          key2fnNormalize.props( state );
          key2fnNormalize.when( state );
          key2fnNormalize.transition( state );
        } else {
          key2fnNormalize.fargs( state );
          key2fnNormalize.sort( state ); 
        }

      }
    }
  },


  children: function( lson ) {

    if ( lson.children !== undefined ) {

      var childName2childLson = lson.children;
      checkAndThrowErrorAttrAsTake( "children",  childName2childLson );

      for ( var childName in childName2childLson ) {

        normalize( childName2childLson[ childName ], true );

      }
    }
  },

  many: function ( lson )  {

    if ( lson.many !== undefined ) {

      var many = lson.many;

      checkAndThrowErrorAttrAsTake( "many", many );

      if ( !many.states ) {
        many.states = {};
      }

      many.states.root = {
      
        formation: many.formation,
        sort: many.sort,
        filter: many.filter || takeFilterAll,
        fargs: many.fargs

      };

      many.formation = undefined;
      many.sort = undefined;
      many.filter = undefined;
      many.fargs = undefined;

      key2fnNormalize.states( many, true );

    }
  },

  // formation args (Many)
  fargs: function ( lson ) {
    if ( lson.fargs ) {
      var
        fargs = lson.fargs,
        formationArg;

      checkAndThrowErrorAttrAsTake( "fargs", fargs );

      for ( formationArg in fargs ) {
        checkAndThrowErrorAttrAsTake( "fargs." + formationArg,
          fargs[ formationArg ] );
      }


    }
  },

  sort: function ( lson ) {
    if ( lson.sort ) {
      var
        sortS = lson.sort,
        i, len;

      checkAndThrowErrorAttrAsTake( "sort", sortS );

      for ( i = 0, len = sortS.length; i < len; i++ ) {
        checkAndThrowErrorAttrAsTake( "sort." + i,
          sortS[ i ] );
        if ( sortS[ i ].ascending === undefined ) {
          sortS[ i ].ascending = true;
        }

      }
    } 
  }

};

}());

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
      throw new TypeError('"" is null or not defined');
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

( function () {
  "use strict";

  LAID.$queryUtils = {
    
    fetch: function ( partLevelS, index, attr ) {
  
      if ( index < 1 ) {
        console.error(
          "LAID Warning: Filter indexing begins from 1" );
          console.log(index);
        return undefined;

      } else {
        if ( !partLevelS[ index - 1 ] ) {
          return null;
        } else {
          return partLevelS[ index - 1 ].$getAttrVal( attr ).calcVal;
        }
      }

    },

   /* fetchAll: function ( partLevelS ) {
      return partLevelS;
    } */

  };

  

})();

( function () {
  "use strict";


  /*
  * Optional argument of `timeNow`
  * which represent the previous time frame
  */
  LAID.$render = function ( timeNow ) {
    if ( !LAID.$isRequestedForAnimationFrame &&
       ( ( LAID.$renderDirtyPartS.length !== 0 ) ||
       LAID.isDataTravelling
       ) ) {

      LAID.$prevTimeFrame = timeNow || performance.now();
      window.requestAnimationFrame( render );
    }
  }



  function render() {
    var
      curTimeFrame = performance.now(),
      timeFrameDiff = curTimeFrame - LAID.$prevTimeFrame,
      parentNode,
      x, y,
      i, len,
      isDataTravelling = LAID.$isDataTravelling,
      dataTravellingDelta = LAID.$dataTravelDelta,
      renderDirtyPartS = LAID.$renderDirtyPartS,
      renderDirtyPart,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal,
      normalRenderDirtyAttrValS,
      normalRenderDirtyAttrVal,
      renderDirtyTransition,
      renderCallS, isNormalAttrValTransitionComplete,
      renderNewLevelS = [],
      renderNewLevel,
      fnLoad,
      isAllNormalTransitionComplete = true;

    /*
    for ( i = 0, len = insertedPartS.length; i < len; i++ ) {
      insertedPart = insertedPartS[ i ];
      parentNode = insertedPart.level.parentLevel.part.node;
      parentNode.appendChild( insertedPart.node );
      if ( insertedPart.textSizeMeasureNode ) {
        parentNode.appendChild( insertedPart.textSizeMeasureNode );
      }  
    }
    
    LAID.$insertedPartS = [];

    for ( i = 0, len = removedPartS.length; i < len; i++ ) {
      removedPart = removedPartS[ i ];
      parentNode = removedPart.level.parentLevel.part.node;
      parentNode.removeChild( removedPart.node );
      if ( removedPart.textSizeMeasureNode ) {
        parentNode.removechild( removedPart.textSizeMeasureNode );
      }
    }

    LAID.$removedPartS = [];
    */

    for ( x = 0; x < renderDirtyPartS.length; x++ ) {

      renderDirtyPart = renderDirtyPartS[ x ];

      travelRenderDirtyAttrValS = renderDirtyPart.travelRenderDirtyAttrValS;
      normalRenderDirtyAttrValS = renderDirtyPart.normalRenderDirtyAttrValS;

      renderCallS = [];

      for ( y = 0; y < travelRenderDirtyAttrValS.length; y++ ) {

        travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ y ];

        if ( travelRenderDirtyAttrVal.isTransitionable ) {

          transitionAttrVal( travelRenderDirtyAttrVal, dataTravellingDelta );
            LAID.$arrayUtils.pushUnique(
               renderCallS, travelRenderDirtyAttrVal.renderCall );

        }
      }

      for ( y = 0; y < normalRenderDirtyAttrValS.length; y++ ) {

        normalRenderDirtyAttrVal = normalRenderDirtyAttrValS[ y ];
        isNormalAttrValTransitionComplete = true;
        LAID.$arrayUtils.pushUnique( renderCallS,
          normalRenderDirtyAttrVal.renderCall );
        renderDirtyTransition = normalRenderDirtyAttrVal.transition;

        if ( renderDirtyTransition !== undefined ) { // if transitioning

          if ( renderDirtyTransition.delay &&
            renderDirtyTransition.delay > 0 ) {
            renderDirtyTransition.delay -= timeFrameDiff;
            isNormalAttrValTransitionComplete = false;
          } else {
            if ( !renderDirtyTransition.checkIsComplete() ) {
              isAllNormalTransitionComplete = false;
              isNormalAttrValTransitionComplete = false;
              transitionAttrVal( normalRenderDirtyAttrVal,
                 renderDirtyTransition.generateNext( timeFrameDiff ) );

            } else {
              if ( renderDirtyTransition.done !== undefined ) {
                renderDirtyTransition.done.call( renderDirtyPart.level );
              }
              normalRenderDirtyAttrVal.transition = undefined;
            }
          }
        }

        if ( isNormalAttrValTransitionComplete ) {

          normalRenderDirtyAttrVal.transitionCalcVal =
            normalRenderDirtyAttrVal.calcVal;
          LAID.$arrayUtils.removeAtIndex( normalRenderDirtyAttrValS, y );
          y--;

        }

      }

      /*
      // If "text" or "$input" is to be rendered, it must be
      // rendered last to be able to bear knowledge
      // of the most recent (render) changes to text props
      // such as text padding, text size, and other text props
      // which can affect the dimensions of the part
      if ( LAID.$arrayUtils.remove( renderCallS, "text" ) ) {
        renderCallS.push( "text" );
      }
      if ( LAID.$arrayUtils.remove( renderCallS, "$input" ) ) {
        renderCallS.push( "$input" );
      }
      */

      // And scroll positions must be affected later
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollX" ) ) {
        renderCallS.push( "scrollX" );
      }
      if ( LAID.$arrayUtils.remove( renderCallS, "scrollY" ) ) {
        renderCallS.push( "scrollY" );
      }

      for ( i = 0, len = renderCallS.length; i < len; i++ ) {
        var fnRender =
          renderDirtyPart[ "renderFn_" + renderCallS[ i ] ];
        if ( !fnRender ) {
          throw "LAID Error: Inexistent prop: '" +
           renderCallS[ i ] + "'"; 
        }
        renderDirtyPart[ "renderFn_" + renderCallS[ i ] ]();
      }

      if (
         ( normalRenderDirtyAttrValS.length === 0 ) &&
         ( travelRenderDirtyAttrValS.length === 0 ) ) {
        LAID.$arrayUtils.removeAtIndex( LAID.$renderDirtyPartS, x );
        x--;
      }

      if ( !renderDirtyPart.isInitiallyRendered &&
         LAID.$renderDirtyPartS.indexOf( renderDirtyPart ) === -1 ) {
        LAID.$arrayUtils.pushUnique( renderNewLevelS,
         renderDirtyPart.level );
      }

    }

    for ( i = 0, len = renderNewLevelS.length; i < len; i++ ) {
      renderNewLevel = renderNewLevelS[ i ];
      renderNewLevel.part.isInitiallyRendered = true;
      fnLoad = renderNewLevel.lson.$load;
      
      if ( renderNewLevel.parentLevel ) {
        if ( renderNewLevel.parentLevel.node().style.visibility === "hidden") {
          renderNewLevel.node().style.visibility = "hidden";
        }
      }     
      if ( fnLoad ) {
        fnLoad.call( renderNewLevel );
      }
    }

    

    LAID.$isRequestedForAnimationFrame = false;

    if ( LAID.$isSolveRequiredOnRenderFinish ) {
      LAID.$isSolveRequiredOnRenderFinish = false;
      LAID.$solve();
    } else if ( !isAllNormalTransitionComplete ) {
      LAID.$render( curTimeFrame );
    }

  }

  function transitionAttrVal ( normalRenderDirtyAttrVal, delta ) {
    if ( normalRenderDirtyAttrVal.calcVal instanceof LAID.Color ) {
      normalRenderDirtyAttrVal.transitionCalcVal =
        LAID.$generateColorMix( normalRenderDirtyAttrVal.startCalcVal,
          normalRenderDirtyAttrVal.calcVal,
          delta );
    } else {
      normalRenderDirtyAttrVal.transitionCalcVal =
        normalRenderDirtyAttrVal.startCalcVal +
        ( delta *
          ( normalRenderDirtyAttrVal.calcVal -
            normalRenderDirtyAttrVal.startCalcVal )
          );
    }
  }

})();

( function () {
  "use strict";

  var
  shorthandProp2_longhandPropS_,
  longhandPropS,
  centeralizedShorthandPropS;

  shorthandProp2_longhandPropS_ = {

    positional:[
      "left",
      "top",
      "z",
      "shiftX", "shiftY",
      "scaleX", "scaleY", "scaleZ",
      "rotateX", "rotateY", "rotateZ",
      "skewX", "skewY"
    ],
    overflow: [
      "overflowX", "overflowY" ],
    backgroundPosition: [
      "backgroundPositionX", "backgroundPositionY" ],
    backgroundSize: [
      "backgroundSizeX", "backgroundSizeY" ],

    borderWidth: [
      "borderTopWidth", "borderRightWidth",
       "borderBottomWidth", "borderLeftWidth" ],
    borderColor: [
      "borderTopColor", "borderRightColor",
       "borderBottomColor", "borderLeftColor" ],
    borderStyle: [
      "borderTopStyle", "borderRightStyle",
       "borderBottomStyle", "borderLeftStyle" ],
    textPadding: [
      "textPaddingTop", "textPaddingRight",
       "textPaddingBottom", "textPaddingLeft" ],
    cornerRadius: [
      "cornerRadiusTopLeft", "cornerRadiusTopRight",
       "cornerRadiusBottomRight", "cornerRadiusBottomLeft" ]

  };

  // Centralized shorthand props are those props which
  // have same render calls (almost akin to css properties)
  // for each shorthand property

  centeralizedShorthandPropS = [
    "positional", "origin",
    "backgroundPosition", "backgroundSize"
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
  LAID.$solve = function () {

    if ( LAID.$isRendering ) {
      LAID.$isSolveRequiredOnRenderFinish = true;
    } else if ( !LAID.$isSolving ) {
      var 
        ret,
        isSolveNewComplete,
        isSolveRecalculationComplete,
        isSolveProgressed,
        isSolveHaltedForOneLoop = false;

      LAID.$isSolving = true;

      do {

        isSolveProgressed = false;
        isSolveNewComplete = false;
        isSolveRecalculationComplete = false;

        ret = LAID.$solveForNew();

        if ( ret < 2 ) {
          isSolveProgressed = true;
        }
          
        ret = LAID.$solveForRecalculation();
        if ( ret < 2 ) {
          isSolveProgressed = true;
        }

        executeStateInstallation();
        executeManyLoads();


        // The reason we cannot use `ret` to confirm
        // completion and not `ret` is because during solving
        // for recalculation new levels could have been
        // added ((from many.rows), and during execution
        //  of state installation new recalculations or
        // levels could have been created 

        isSolveRecalculationComplete =
          LAID.$recalculateDirtyLevelS.length === 0;
        isSolveNewComplete =
          LAID.$newLevelS.length === 0;

        if ( !isSolveProgressed ) {
          if ( isSolveHaltedForOneLoop ) {
            break;
          } else {

            isSolveHaltedForOneLoop = true;
          }
        } else {
          isSolveHaltedForOneLoop = false;
        }

      } while ( !( isSolveNewComplete && isSolveRecalculationComplete ) );

      if ( !( isSolveNewComplete && isSolveRecalculationComplete ) ) {
        var msg = "LAID Error: Circular/Undefined Reference Encountered [";
        if ( !isSolveNewComplete ) {
          msg += "Uninheritable Level: " + LAID.$newLevelS[ 0 ].pathName;
        } else {
          var uninstantiableLevel = LAID.$recalculateDirtyLevelS[ 0 ];
          msg += "Uninstantiable Attr: " +
             uninstantiableLevel.recalculateDirtyAttrValS[ 0 ].attr +
            " (Level: " + uninstantiableLevel.pathName  + ")";
        } 
        msg += "]";
        throw msg;

      }

      LAID.$isSolving = false;
      LAID.$render();

    }

  };

  function executeManyLoads () {
    var newManyS = LAID.$newManyS, newMany, fnLoad;

    for ( var i = 0, len = newManyS.length; i < len; i++ ) {
      newMany = newManyS[ i ];
      newMany.isLoaded = true;
      newMany.updateFilteredPositioning();
      fnLoad = newMany.level.attr2attrVal.load;
      if ( fnLoad ) {
        fnLoad.call( newMany.level );
      }
    }
    LAID.$newManyS = [];
 
  }

  function executeStateInstallation () {

    var
      i, j, len, jLen,
      newlyInstalledStateLevelS = LAID.$newlyInstalledStateLevelS,
      newlyInstalledStateLevel,
      newlyInstalledStateS,
      attrValNewlyInstalledStateInstall,
      newlyUninstalledStateLevelS = LAID.$newlyUninstalledStateLevelS,
      newlyUninstalledStateLevel,
      newlyUninstalledStateS,
      attrValNewlyUninstalledStateUninstall;

    for ( i = 0, len = newlyInstalledStateLevelS.length; i < len; i++ ) {
      newlyInstalledStateLevel = newlyInstalledStateLevelS[ i ];
      newlyInstalledStateS = newlyInstalledStateLevel.newlyInstalledStateS;
      for ( j = 0, jLen = newlyInstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyInstalledStateInstall =
          newlyInstalledStateLevel.attr2attrVal[ newlyInstalledStateS[ j ] +
          ".install" ];
        attrValNewlyInstalledStateInstall &&
          ( LAID.type(attrValNewlyInstalledStateInstall.calcVal ) ===
          "function") &&
          attrValNewlyInstalledStateInstall.calcVal.call(
          newlyInstalledStateLevel );
      }
      // empty the list
      newlyInstalledStateLevel.newlyInstalledStateS = [];
    }
    LAID.$newlyInstalledStateLevelS = [];

    for ( i = 0, len = newlyUninstalledStateLevelS.length; i < len; i++ ) {
      newlyUninstalledStateLevel = newlyUninstalledStateLevelS[ i ];
      newlyUninstalledStateS = newlyUninstalledStateLevel.newlyUninstalledStateS;
      for ( j = 0, jLen = newlyUninstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyUninstalledStateUninstall =
          newlyUninstalledStateLevel.attr2attrVal[ newlyUninstalledStateS[ j ] +
          ".uninstall" ];
        attrValNewlyUninstalledStateUninstall &&
          ( LAID.type( attrValNewlyUninstalledStateUninstall.calcVal) ===
          "function") &&
          attrValNewlyUninstalledStateUninstall.calcVal.call( 
          newlyUninstalledStateLevel );
      }
      // empty the list
      newlyUninstalledStateLevel.newlyUninstalledStateS = [];
    }
    LAID.$newlyUninstalledStateLevelS = [];
  }


})();

( function () {
  "use strict";
  LAID.$solveForNew = function () {

    var
      i, len,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      newLevelS = LAID.$newLevelS,
      newLevel,
      solvedLevelS = [],
      manyWithNewLevelS = [],
      manyWithNewLevel;

    if ( !newLevelS.length ) {
      return 3;
    }
    
    do {
      isSolveProgressed = false;
      for ( i = 0; i < newLevelS.length; i++ ) {
        newLevel = newLevelS[ i ];
        if ( newLevel.$normalizeAndInherit() ) {
          newLevel.$identifyAndReproduce();
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          solvedLevelS.push( newLevel );
          LAID.$arrayUtils.removeAtIndex( newLevelS, i );
          i--;
          if ( newLevel.derivedMany ) {
            LAID.$arrayUtils.pushUnique(
             manyWithNewLevelS, newLevel.derivedMany );
          }
        }
      }
   
    } while ( ( newLevelS.length !== 0 ) && isSolveProgressed );

    for ( i = 0, len = solvedLevelS.length; i < len; i++ ) {
      solvedLevelS[ i ].$initAllAttrs();
    }

    for ( i = 0, len = manyWithNewLevelS.length;
     i < len; i++ ) {
      manyWithNewLevel = manyWithNewLevelS[ i ];
      manyWithNewLevel.level.attr2attrVal.filter.forceRecalculation();
    }

    return newLevelS.length === 0 ? 0 :
      isSolveProgressedOnce ? 1 : 2;
   
  }

})();

( function () {
  "use strict";
  LAID.$solveForRecalculation = function () {


    var 
      i,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      ret,
      recalculateDirtyLevelS = LAID.$recalculateDirtyLevelS;
      
    if ( !recalculateDirtyLevelS.length ) {
      return 3;
    }

    do {
      isSolveProgressed = false;
      for ( i = 0; i < recalculateDirtyLevelS.length; i++ ) {
        ret = recalculateDirtyLevelS[ i ].$solveForRecalculation();
        if ( ret !== 2 ) {
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          if ( ret === 0 ) {
            LAID.$arrayUtils.removeAtIndex( recalculateDirtyLevelS, i );
            i--;
          }
        }
      }
    
    } while ( ( recalculateDirtyLevelS.length !== 0 ) && isSolveProgressed );


    return recalculateDirtyLevelS.length === 0 ?  0 :
      isSolveProgressedOnce ? 1 : 2;

  };

})();


// source of spring code below:
// facebook pop framework & framer.js
// ---
// generated by coffee-script 1.9.0

( function() {
  "use strict";


  LAID.$springTransition = function( duration, args ) {
    this.curTime = 0;
    this.value = 0;
    this.friction = parseFloat( args.friction );
    this.tension = parseFloat( args.tension );
    this.velocity = parseFloat( args.velocity || 0 );

    this.threshold = parseFloat( args.threshold || ( 1 / 1000 ) );
    this.isComplete = false;
  };

  LAID.$springTransition.prototype.generateNext = function ( delta ) {
    var
      finalVelocity, net1DVelocity, netFloat,
       netValueIsLow, netVelocityIsLow, stateAfter, stateBefore;


    delta = delta / 1000;

    this.curTime += delta;
    stateBefore = {};
    stateAfter = {};
    stateBefore.x = this.value - 1;
    stateBefore.v = this.velocity;
    stateBefore.tension = this.tension;
    stateBefore.friction = this.friction;
    stateAfter = springIntegrateState( stateBefore, delta );

    this.value = 1 + stateAfter.x;
    finalVelocity = stateAfter.v;
    netFloat = stateAfter.x;
    net1DVelocity = stateAfter.v;
    netValueIsLow = Math.abs( netFloat ) < this.threshold;
    netVelocityIsLow = Math.abs( net1DVelocity ) < this.threshold;
    this.isComplete = netValueIsLow && netVelocityIsLow;
    this.velocity = finalVelocity;
    return this.value;
  };

  LAID.$springTransition.prototype.checkIsComplete = function() {
    return this.isComplete;
  };


  function springAccelerationForState ( state ) {
    return ( - state.tension * state.x ) - ( state.friction * state.v );
  };

  function springEvaluateState ( initialState ) {
    var output;
    output = {};
    output.dx = initialState.v;
    output.dv = springAccelerationForState( initialState );
    return output;
  };

  function springEvaluateStateWithDerivative( initialState, dt, derivative ) {
    var output, state;
    state = {};
    state.x = initialState.x + derivative.dx * dt;
    state.v = initialState.v + derivative.dv * dt;
    state.tension = initialState.tension;
    state.friction = initialState.friction;
    output = {};
    output.dx = state.v;
    output.dv = springAccelerationForState(state);
    return output;
  };

  function springIntegrateState ( state, speed ) {
    var a, b, c, d, dvdt, dxdt;
    a = springEvaluateState(state);
    b = springEvaluateStateWithDerivative(state, speed * 0.5, a);
    c = springEvaluateStateWithDerivative(state, speed * 0.5, b);
    d = springEvaluateStateWithDerivative(state, speed, c);


    dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);
    dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);
    state.x = state.x + dxdt * speed;
    state.v = state.v + dvdt * speed;
    return state;
  }

})();

( function () {
  "use strict";



  LAID.$transitionType2args = {
    "linear": [],
    "cubic-bezier": [ "a", "b", "c", "d" ],
    "spring": [ "velocity", "tension", "friction", "threshold" ]

  };




})();
