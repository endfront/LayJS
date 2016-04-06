( function () {
  "use strict";

  // The naming convention:
  // attr -> string attr name
  // attrVal -> class AttrVal

  LAY.AttrVal = function ( attr, level ) {

    // undefined initializations:
    // (1) performance
    // (http://jsperf.com/objects-with-undefined-initialized-properties/2)
    // (2) readability

    this.level = level;
    this.val = undefined;
    this.prevVal = undefined;
    this.isTakeValReady = undefined;
    this.attr = attr;
    this.isRecalculateRequired = true;
    this.isRemoved = false;

    this.calcVal = undefined;
    this.transCalcVal = undefined;
    this.startCalcVal = undefined;
    this.transition = undefined;
    this.isTransitionable = false;
    this.isDeltaTransitionable = false;

    this.isForceRecalculate = false;
    // if the attr is of "<state>.onlyif"
    // the below will store the state name <state>
    this.onlyIfStateName = getStateNameOfOnlyIf( attr );

    this.isStateProjectedAttr = checkIsStateProjectedAttr( attr );
    this.isEventReadonlyAttr =
      LAY.$eventReadonlyUtils.checkIsEventReadonlyAttr( attr );
    this.renderCall =
      level && ( level.isPart ) &&
        ( LAY.$findRenderCall( attr, level ) );

    this.takerAttrValS = [];

    this.eventReadonlyEventType2boundFnHandler = {};


  }

  /*
  * For attrs which are of type state ( i.e state.<name> )
  * Return the name component.
  * Else return the empty string.
  */
  function getStateNameOfOnlyIf ( attr ) {
    if ( attr.lastIndexOf( ".onlyif" ) !== -1 &&
      !attr.startsWith("data.") &&
      !attr.startsWith("row.")  ) {
      return attr.slice(0, attr.indexOf(".") );
    } else {
      return "";
    }

  }

  /*
  * For attrs which are of type "when"
  * ( i.e when.<eventType>.<eventNum> )
  * Return the event type component.
  * Else return the empty string.
  */
  function getWhenEventTypeOfAttrWhen ( attr ) {

    return attr.startsWith( "when." ) ?
    attr.slice( 5, attr.length - 2 ) : "";

  }
  /*
  * For attrs which are of type "transition"
  * ( i.e transition.<prop>.<>.<> )
  * Return the event type component.
  * Else return the empty string.
  */
  function getTransitionPropOfAttrTransition( attr ) {

      return  attr.startsWith( "transition." ) ?
        attr.slice( 11, attr.indexOf(".", 11 ) ) : "";

  }


  function checkIsStateProjectedAttr( attr ) {
    var i = attr.indexOf( "." );
    if ( LAY.$checkIsValidUtils.propAttr( attr ) &&
      [ "centerX", "right",
       "centerY", "bottom" ].indexOf( attr ) === -1 ) {
      return true;
    } else if (
      [ "formation", "filter" ].indexOf ( attr ) !== -1 ) {
      return true;
    } else if ( i !== -1 ) {
      var prefix = attr.slice( 0, i );
      return ([ "when", "transition", "fargs", "sort", "$$num", "$$max" ].
        indexOf( prefix ) !== -1 );
    }
  }


  /*
  * Returns true if the value is different,
  * false otherwise
  */
  LAY.AttrVal.prototype.update = function ( val ) {

    this.val = val;
    if ( !LAY.identical( val, this.prevVal ) ) {
      if ( this.prevVal instanceof LAY.Take ) {
        this.takeNot( this.prevVal );
      }
      this.isTakeValReady = false;
      this.requestRecalculation();
      return true;

    }
  };

  /*
  * Request the level corresponding to the given AttrVal
  * to recalculate this AttrVal.
  */
  LAY.AttrVal.prototype.requestRecalculation = function () {
    this.isRecalculateRequired = true;
    if ( this.level ) { // check for empty level
      LAY.$arrayUtils.pushUnique(
        LAY.$recalculateDirtyAttrValS, this );
    }
  };

  /*
  * Force the level corresponding to the given AttrVal
  * to recalculate this AttrVal.
  */
  LAY.AttrVal.prototype.forceRecalculation = function () {

    this.isForceRecalculate = true;
    this.requestRecalculation();
  };


  LAY.AttrVal.prototype.checkIsTransitionable = function () {

    this.isTransitionable = false;
    this.isDeltaTransitionable = false;
    if ( this.renderCall && ( this.startCalcVal !== this.calcVal ) ) {
      this.isTransitionable = true;
      if (this.attr !== "zIndex" &&
        ((( typeof this.startCalcVal === "number" ) &&
          ( typeof this.calcVal === "number" )) ||
        (( this.startCalcVal instanceof LAY.Color) &&
          ( this.calcVal instanceof LAY.Color )))) {
        this.isDeltaTransitionable = true;
      }
    }
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
          ( this.startCalcVal instanceof LAY.Color  )
              &&
          ( this.calcVal instanceof LAY.Color )
        )
      ) &&
      this.attr !== "zIndex";
  };

  /*
  *
  * Recalculate the value of the attr value.
  * Propagate the change across the LOM (LAY object model)
  * if the change in value produces a change.
  * For constraint (take) based attributes, recalculate the
  * value, for non constraint based use the `value` parameter
  * as the change.
  * Return true if calculation successful, false if
  * a circular reference rendered it unsuccessful
  */
  LAY.AttrVal.prototype.recalculate = function () {

    var
      isDirty = false,
      recalcVal,
      level = this.level,
      part = level.part,
      many = level.manyObj,
      attr = this.attr,
      i, len;

    if ( attr.charAt(0) === "$" ) {
      if ( LAY.$checkIfImmidiateReadonly( attr ) ) {
        this.val = part.getImmidiateReadonlyVal( attr );
      }
    }

    if ( this.val instanceof LAY.Take ) { // is LAY.Take
      if ( !this.isTakeValReady ) {
        this.isTakeValReady = this.take();
        // if the attrval has not been taken
        // as yet then there is chance that
        // the giver attrval has not been
        // initialized as yet. Thus we
        // skip a round of solving to
        // let the other attrvals complete calculation
        return false;
      }

      recalcVal = this.val.execute( this.level );

      if ( attr.startsWith("data.") ||
        attr.startsWith("row.") ) {
        recalcVal = LAY.$clone( recalcVal );
      }

      if ( !LAY.identical( recalcVal, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = recalcVal;
      }
    } else {
      if ( attr.startsWith("data.") ||
          attr.startsWith("row.") ) {
        this.val = LAY.$clone( this.val );
      }
      if ( !LAY.identical( this.val, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = this.val;
      }
    }

    if ( this.isForceRecalculate ) {
      isDirty = true;
    }


    // rows is always dirty when recalculated
    // as changes made to rows would have rows
    // retain the same pointer to the array
    if ( attr === "rows" ) {
      isDirty = true;
      level.attr2attrVal.filter.forceRecalculation();
    }

    if ( isDirty ) {
      var
        stateName = this.onlyIfStateName,
        whenEventType = getWhenEventTypeOfAttrWhen( attr ),
        transitionProp = getTransitionPropOfAttrTransition( attr );

      this.prevVal = this.val;

      for ( i = 0, len = this.takerAttrValS.length; i < len; i++ ) {
        this.takerAttrValS[i].requestRecalculation();
      }

      if ( LAY.$isDataTravellingShock ) {
        part.addTravelRenderDirtyAttrVal( this );
      }

      if ( this.renderCall ) {
        this.startCalcVal = this.transCalcVal;
        this.checkIsTransitionable();

        if ( !LAY.$isDataTravellingShock ) {
          part.addNormalRenderDirtyAttrVal( this );
        }

        switch ( attr ) {
          case "display":
            var parentLevel = this.level.parentLevel;
            if ( parentLevel ) {
              parentLevel.part.updateNaturalWidth();
              parentLevel.part.updateNaturalHeight();
            }
            if ( this.calcVal === false ) {
              recursivelySwitchOffDoingEvents( level );
            }
            break;
          case "input":
            if ( part.inputType === "option" ||
                part.inputType === "options" ) {
              level.attr2attrVal.$input.requestRecalculation();
            }
            break;
          case "width":
            if ( part.isText ) {
              var textWrapAttrVal = level.attr2attrVal.textWrap;
              if ( textWrapAttrVal &&
                !textWrapAttrVal.isRecalculateRequired &&
                textWrapAttrVal.calcVal !== "nowrap" ) {
                part.updateNaturalHeight();
              }
            } else if ( part.type === "image" ||
              part.type === "video") {
              part.updateNaturalHeight();
            }
            break;
          case "height":
            if ( part.type === "image" ||
              part.type === "video" ) {
              part.updateNaturalWidth();
            }
            break;
          case "image":
            part.isImageLoaded = false;
            break;
          case "video":
            part.isVideoLoaded = false;
            break;
          case "audioController":
            part.updateNaturalHeight();
            part.updateNaturalHeight();
            break;
          default:
            if ( attr.startsWith("videos") ) {
              part.isVideoLoaded = false;
            } else {
              var checkIfAttrAffectsTextDimesion =
                function ( attr ) {
                  return attr === "html" ||
                    attr.startsWith("text") &&
                    !attr.startsWith("textShadows") &&
                    ([ "textColor",
                      "textDecoration",
                      "textSmoothing",
                      "textShadows"
                    ]).indexOf( attr ) === -1;
              };
              if ( part.isText ) {
                if ( checkIfAttrAffectsTextDimesion( attr ) )  {
                    part.updateNaturalWidth();
                    part.updateNaturalHeight();
                } else if ( ( attr === "borderTopWidth" ) ||
                  ( attr === "borderBottomWidth" ) ) {
                    part.updateNaturalHeight();
                } else if ( ( attr === "borderLeftWidth" ) ||
                  ( attr === "borderRightWidth" ) ) {
                  part.updateNaturalWidth();
                  part.updateNaturalHeight();
                }
              }
            }
        }
        // In case there exists a transition
        // for the given prop then update it
        part.updateTransitionProp( attr );

      } else if ( stateName !== "" ) {
        if ( this.calcVal ) { // state
          if ( LAY.$arrayUtils.pushUnique( level.stateS, stateName ) ) {
            level.$updateStates();
            // remove from the list of uninstalled states (which may/may not be present within)
            LAY.$arrayUtils.remove( level.newlyUninstalledStateS, stateName );
            // add state to the list of newly installed states
            LAY.$arrayUtils.pushUnique( level.newlyInstalledStateS, stateName );
            // add level to the list of levels which have newly installed states
            LAY.$arrayUtils.pushUnique( LAY.$newlyInstalledStateLevelS, level );
          }
        } else { // remove state
          if ( LAY.$arrayUtils.remove( level.stateS, stateName ) ) {

            level.$updateStates();
            // remove from the list of installed states (which may/may not be present within)
            LAY.$arrayUtils.remove( level.newlyInstalledStateS, stateName );
            // add state to the list of newly uninstalled states
            LAY.$arrayUtils.pushUnique( level.newlyUninstalledStateS, stateName );
            // add level to the list of levels which have newly uninstalled states
            LAY.$arrayUtils.pushUnique( LAY.$newlyUninstalledStateLevelS, level );
          }
        }
      } else if ( whenEventType !== "" ) {
        part.updateWhenEventType( whenEventType );
      } else if ( transitionProp !== "" ) {
        part.updateTransitionProp( transitionProp );
      } else if ( attr === "exist" ) {
        level.$updateExistence();
      } else if ( many ) {
          if ( attr === "rows" ) {
            many.updateRows();
          } else if ( attr === "filter" ) {
            if ( !many.updateFilter() ) {
              return false;
            }
            many.updateLayout()
          } else if ( attr.startsWith("sort.") ) {
            many.updateRows();
          } else if ( attr.startsWith("fargs.") ||
           attr === "formation" ) {
            many.updateLayout();
        }
      } else {
        switch( attr ) {
          case "right":
            if ( level.parentLevel !== undefined ) {
              level.parentLevel.part.
                updateNaturalWidth();
            }
            break;
          case "bottom":
            if ( level.parentLevel !== undefined ) {
              level.parentLevel.part.
                updateNaturalHeight();
            }
            break;
          case "$naturalWidth":
            if ( this.level.attr2attrVal.scrollX ) {
              var self = this;
              setTimeout(function(){
                self.level.attr2attrVal.scrollX.
                  requestRecalculation();
                LAY.$solve();
              });
            }
            break;
          case "$naturalHeight":
            if ( this.level.attr2attrVal.scrollY ) {
              var self = this;
              setTimeout(function(){
                self.level.attr2attrVal.scrollY.
                  requestRecalculation();
                LAY.$solve();
              });
            }
            break;
          case "$input":
            part.updateNaturalWidth();
            if ( part.inputType !== "line" ||
               !part.isInitiallyRendered ) {
              part.updateNaturalHeight();
            }
            break;
          case "css":
            if ( this.calcVal ) {
              LAY.$insertCSS( this.calcVal );
            }
            break;
        }
      }
    }

    this.isForceRecalculate = false;
    this.isRecalculateRequired = false;
    return true;
  };


  /*
  * Doing events: clicking, hovering
  */
  function recursivelySwitchOffDoingEvents( level ) {
    var
      hoveringAttrVal = level.attr2attrVal.$hovering,
      clickingAttrVal = level.attr2attrVal.$clicking,
      childLevel,
      childLevelS = level.childLevelS;

    if ( hoveringAttrVal ) {
      hoveringAttrVal.update( false );
    }
    if ( clickingAttrVal ) {
      clickingAttrVal.update( false );
    }
    if ( childLevelS.length ) {
      for ( var i = 0, len = childLevelS.length;
            i < len; i++ ) {
        childLevel = childLevelS[i];
        if ( childLevel.part ) {
          recursivelySwitchOffDoingEvents( childLevel );
        }
      }
    }
  }



  LAY.AttrVal.prototype.checkIfDeferenced = function () {
    return this.takerAttrValS.length === 0;
  };

  LAY.AttrVal.prototype.give = function ( attrVal ) {

    if ( LAY.$arrayUtils.pushUnique( this.takerAttrValS, attrVal ) &&
     this.takerAttrValS.length === 1 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that a reference exists, add event listeners
        var
          eventType2fnHandler = LAY.$eventReadonlyUtils.getEventType2fnHandler(
             this.attr ),
          eventType,
          fnBoundHandler, node;

        node = this.level.part.node;
        for ( eventType in eventType2fnHandler ) {
          if ( LAY.$checkIsWindowEvent( eventType ) &&
            this.level.pathName === "/" ) {
            node = window;
          }
          fnBoundHandler =
           eventType2fnHandler[ eventType ].bind( this.level );
          LAY.$eventUtils.add( node, eventType, fnBoundHandler );

          this.eventReadonlyEventType2boundFnHandler[ eventType ] =
           fnBoundHandler;
        }
      }
    }
  };

  LAY.AttrVal.prototype.giveNot = function ( attrVal ) {
    if ( LAY.$arrayUtils.remove( this.takerAttrValS, attrVal ) &&
      this.takerAttrValS.length === 0 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that no reference exists, remove event listeners
        var
         eventType2fnHandler =
         LAY.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
         eventType,
         fnBoundHandler, node;
        node = this.level.part.node;
        for ( eventType in eventType2fnHandler ) {
          if ( LAY.$checkIsWindowEvent( eventType ) &&
            this.level.pathName === "/" ) {
            node = window;
          }
          fnBoundHandler = this.eventReadonlyEventType2boundFnHandler[ eventType ];
          LAY.$eventUtils.remove( node, eventType, fnBoundHandler );
          this.eventReadonlyEventType2boundFnHandler[ eventType ] =
           undefined;
        }
      }
    }
  };


  LAY.AttrVal.prototype.take = function () {

    if ( this.val instanceof LAY.Take ) {
      var _relPath00attr_S, relPath, level, attr,
      i, len;
      // value is of type `LAY.Take`
      _relPath00attr_S = this.val._relPath00attr_S;

      for ( i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[i][ 0 ];
        attr = _relPath00attr_S[i][ 1 ];
        level = relPath.resolve( this.level );

        if ( level === undefined ) {
          return false;
        }

        if ( ( level.attr2attrVal[ attr ] === undefined ) )  {
          level.$createLazyAttr( attr );
          // return false to let the lazily created attribute
          // to calculate itself first (in the case of no
          // created attrval lazily then returing false
          // is the only option)
          return false;
        }

        if ( level.attr2attrVal[ attr ].isRecalculateRequired ) {
          return false;
        }
      }

      for ( i = 0; i < len; i++ ) {

        relPath = _relPath00attr_S[i][ 0 ];
        attr = _relPath00attr_S[i][ 1 ];

        relPath.resolve( this.level ).$getAttrVal( attr ).give( this );

      }
    }
    return true;

  };

  LAY.AttrVal.prototype.takeNot = function ( val ) {

    if ( val instanceof LAY.Take ) {
      var _relPath00attr_S, relPath, level, attr;
      _relPath00attr_S = val._relPath00attr_S;

      for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[i][ 0 ];
        attr = _relPath00attr_S[i][ 1 ];

        level = relPath.resolve( this.level );

        if ( ( level !== undefined ) && ( level.$getAttrVal( attr ) !== undefined ) ) {
          level.$getAttrVal( attr ).giveNot( this );
        }
      }
    }
  };


  LAY.AttrVal.prototype.remove = function () {
    this.takeNot( this.val );
    this.isRemoved = true;
    this.level.attr2attrVal[ this.attr ] = undefined;
  };





})();
