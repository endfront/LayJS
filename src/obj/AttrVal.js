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
    attr.slice( 5, attr.length - 2 ) : "";

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

    if ( ( val !== this.prevVal ) &&
      !( LAID.$checkIsNan( val ) &&
       LAID.$checkIsNan( this.prevVal ) )
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
  LAID.AttrVal.prototype.requestRecalculation = function ( ) {

    this.isRecalculateRequired = true;
    this.level.$addRecalculateDirtyAttrVal( this );
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
      this.attr !== "zIndex"

      ;


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


    if ( !isDirty ) {
      switch ( this.attr ) {
        case "input":
          this.transitionCalcVal = this.level.part.node.value;

      }
    }

    switch ( this.attr ) {
      case "scrollX":
        this.transitionCalcVal = this.level.part.node.scrollLeft;
        isDirty = true;
      case "scrollY":
        this.transitionCalcVal = this.level.part.node.scrollTop;
        isDirty = true;
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

      this.prevVal = this.val;

      for ( i = 0, len = this.takerAttrValS.length; i < len; i++ ) {
        this.takerAttrValS[ i ].requestRecalculation( );
      }

      if ( LAID.$isDataTravellingShock ) {

        level.$addTravelRenderDirtyAttrVal( this );

      }

      if ( this.renderCall ) {
        this.startCalcVal = this.transitionCalcVal;
        this.isTransitionable = this.checkIsTransitionable();


        if ( !LAID.$isDataTravellingShock ) {
          level.$addNormalRenderDirtyAttrVal( this );

        }
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

            level.$updateStates( );
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
