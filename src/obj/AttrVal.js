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
      level && ( level.$isPart ) && ( LAID.$findRenderCall( attr ) );

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
    if ( !LAID.identical( val, this.prevVal ) ) {
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
      this.level.$addRecalculateDirtyAttrVal( this );
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
      part = level.$part,
      many = level.$many,
      attr = this.attr,
      i, len; 


    //console.log("update", level.path, attr, this.val );

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
      if ( !LAID.identical( recalcVal, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = recalcVal;
      }
    } else {
      if ( !LAID.identical( this.val, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = this.val;
      }
    }



    if ( attr === "$all" || attr === "$filtered" ) {
      //isDirty = true;
    }

    if ( this.isForceRecalculate ) {
      isDirty = true;
    }

    switch ( attr ) {
      case "scrollX":
         this.transitionCalcVal =
             this.level.$part.node.scrollLeft;      
        if ( level.$attr2attrVal.$scrolledX ) {
          level.$changeAttrVal( "$scrolledX",
           this.calcVal );
        }
        isDirty = true;
        break;
      case "scrollY":
         this.transitionCalcVal =
             this.level.$part.node.scrollTop;
        if ( level.$attr2attrVal.$scrolledY ) {
          level.$changeAttrVal( "$scrolledY",
           this.calcVal );
        }
        isDirty = true;
        break;
      case "rows":
        isDirty = true;
        break;
      case "input":
        if ( level.$attr2attrVal.$input ) {
          level.$changeAttrVal( "$input",
           this.calcVal );
        }
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

      if ( level.$derivedMany ) {
        level.$derivedMany.level.$attr2attrVal.$all.requestRecalculation();
        if ( level.$attr2attrVal.$f.calcVal !== -1 ) {
         if ( attr !== "top" ) {
           level.$derivedMany.level.$attr2attrVal.$filtered.requestRecalculation();
         }
       }
      }

      if ( LAID.$isDataTravellingShock ) {

        part.$addTravelRenderDirtyAttrVal( this );

      }

      if ( this.renderCall ) {
        this.startCalcVal = this.transitionCalcVal;
        this.isTransitionable = this.checkIsTransitionable();


        if ( !LAID.$isDataTravellingShock ) {
          part.$addNormalRenderDirtyAttrVal( this );
        }

        switch ( attr ) {
          case "text":
            part.$updateNaturalHeightFromText();
            part.$updateNaturalWidthFromText();
            break;
          case "$input":
            part.$updateNaturalWidthInput();
            part.$updateNaturalHeightInput();
            break;
          case "width":
            if ( level.$attr2attrVal.text ) {
              part.$updateNaturalHeightFromText();
              
            } else if ( part.isInputText ) {
              part.$updateNaturalHeightInput();
            }
            break;
          case "left":
            part.$updateAbsoluteX();
            break;
          case "shiftX":
            part.$updateAbsoluteX();
            break;
          case "top":
            part.$updateAbsoluteY();
            break;
          case "shiftY":
            part.$updateAbsoluteY();
            break;
        

          default:
            var checkIfAttrNotAffectTextDimesion  = function ( attr ) {
              return ( ["textDecoration", "textColor"] ).indexOf( attr ) !== -1;
            }
            if ( attr.startsWith( "text" ) &&
              !checkIfAttrNotAffectTextDimesion( attr ) )  {
              
              var childLevelS = level.$childLevelS;

              if ( childLevelS.length ) {
                // A CSS text styling inherit taking
                // place must have all the children
                // levels (parts) notified.
                for ( var i = 0, len = childLevelS.length,
                    childPart;
                    i < len; i++ ) {
                  childPart = childLevelS[ i ].$part;
                  if ( childPart ) {
                    childPart.$updateNaturalWidthFromText();
                    childPart.$updateNaturalHeightFromText();
                    childPart.$updateNaturalWidthInput();
                    childPart.$updateNaturalHeightInput(); 
                  }
                }
              } else {
                part.$updateNaturalWidthFromText();
                part.$updateNaturalHeightFromText();
                part.$updateNaturalWidthInput();
                part.$updateNaturalHeightInput(); 
              }     
            } 
        }

        // In case there exists a transition
        // for the given prop then update it
        part.$updateTransitionProp( attr );

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
        part.$updateWhenEventType( whenEventType );
      } else if ( transitionProp !== "" ) {
        part.$updateTransitionProp( transitionProp );
      } else {  

        switch( attr ) {
          case "right":
            if ( level.parentLevel !== undefined ) {
             level.parentLevel.$part.
              $updateNaturalWidthFromChild( level );
            }
            break;
          case "bottom":
            if ( level.parentLevel !== undefined ) {
              level.parentLevel.$part.
                $updateNaturalHeightFromChild( level );

            }
            break;
          case "rows":
            many.$updateRows();
            break;
          case "filter":
            many.$updateFilter();  
            break;
          case "$naturalWidth":
            if ( this.level.$attr2attrVal.scrollX ) {
              var self = this;
              setTimeout(function(){
                self.level.$attr2attrVal.scrollX.
                  requestRecalculation();
                LAID.$solve();
              });
            }
            break;
          case "$naturalHeight":

            if ( this.level.$attr2attrVal.scrollY ) {
              var self = this;
              setTimeout(function(){
                self.level.$attr2attrVal.scrollY.
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
        // Given that a reference exists, add event listeners
        var
          eventType2fnHandler = LAID.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
          eventType,
          fnBoundHandler;
        for ( eventType in eventType2fnHandler ) {
          fnBoundHandler =
           eventType2fnHandler[ eventType ].bind( this.level );
          LAID.$eventUtils.add( this.level.$part.node, eventType, fnBoundHandler );

          this.eventReadonlyEventType2boundFnHandler[ eventType ] =
           fnBoundHandler;
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
          fnBoundHandler = this.eventReadonlyEventType2boundFnHandler[ eventType ];
          LAID.$eventUtils.remove( this.level.$part.node, eventType, fnBoundHandler );
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

      var _relPath00attr_S, i, len, takingLevel, takingAttrVal;

      if ( !( this.val instanceof LAID.Take ) ) {
        return false;
      } else {
        _relPath00attr_S = this.val._relPath00attr_S;
        for ( i = 0, len = _relPath00attr_S.length; i < len; i++ ) {
          takingLevel = ( _relPath00attr_S[ i ][ 0 ] ).resolve( this.level );
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
