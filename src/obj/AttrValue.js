( function () {
  "use strict";

  // The naming convention:
  // attr -> string attr name
  // attrValue -> class AttrValue

  LAID.AttrValue = function AttrValue ( attr, level ) {

    // undefined initializations:
    // (1) performance (http://jsperf.com/objects-with-undefined-initialized-properties/2)
    // (2) readability

    this.level = level;
    this.value = undefined;
    this.valueUsedForLastRecalculation = undefined;
    this.isTaken = undefined;
    this.attr = attr;

    this.calcValue = undefined;
    this.transitionCalcValue = undefined;
    this.transition = undefined;

    this.isStateProjectedAttr = checkIsStateProjectedAttr( attr );
    this.isEventReadonlyAttr = LAID.$eventReadonlyUtils.checkIsEventReadonlyAttr( attr );
    this.renderCall = level && ( level.isPart ) && ( LAID.$findRenderCall( attr ) );

    this.takerAttrValueS = [];

    this.eventReadonlyEventType2boundFnHandler = {};

  }

  /*
  * For attrs which are of type state ( i.e state.<name> )
  * Return the name component.
  * Else return the empty string.
  */
  function getStateNameOfAttrState ( attr ) {

    return attr.startsWith( "state." ) ?
    attr.slice( 6 ) : "";

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
    if ( i === -1 ) {
      return true;
    } else {
      var prefix = attr.slice( 0, i );
      return ( ( [ "when", "transition", "$$num", "$$max", /*"$$keys"*/ ] ).indexOf( prefix ) !== -1 );
    }
  }



  /* TODO: update this doc below along with its slash-asterisk
  formatting

  Returns true if the value is different,
  false otherwise */
  LAID.AttrValue.prototype.update = function ( value ) {

    this.value = value;

    if ( value !== this.valueUsedForLastRecalculation ) {

      if ( this.value instanceof LAID.Take ) {
        this.takeNot();
      }

      this.value = value;
      this.isTaken = false;
      this.requestRecalculation();

      return true;

    }

  };

  /*
  * Request the level corresponding to the given AttrValue
  * to recalculate this AttrValue.
  */
  LAID.AttrValue.prototype.requestRecalculation = function () {
    this.level.$addRecalculateDirtyAttrValue( this );
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
  LAID.AttrValue.prototype.recalculate = function () {

    var
    isDirty = false,
    reCalc,
    level = this.level,
    i, len;

    if ( this.value instanceof LAID.Take ) { // is LAID.Take
      if ( !this.isTaken ) {
        if ( !this.take() ) {
          return false;
        }
      }
      this.isTaken = true;

      reCalc = this.value.execute( this );
      if ( reCalc !== this.calcValue ) {

        isDirty = true;
        this.calcValue = reCalc;
      }
    } else {
      if ( this.value !== this.calcValue ) {
        this.calcValue = this.value;
        isDirty = true;
      }
    }

    if ( isDirty ) {
      var
      attr = this.attr,
      stateName = getStateNameOfAttrState( attr ),
      whenEventType = getWhenEventTypeOfAttrWhen( attr ),
      transitionProp = getTransitionPropOfAttrTransition( attr );

      this.valueUsedForLastRecalculation = this.value;

      for ( i = 0, len = this.takerAttrValueS.length; i < len; i++ ) {
        this.takerAttrValueS[ i ].requestRecalculation();
      }

      if ( this.renderCall ) {
        level.$addRenderDirtyAttrValue( this );

        if ( ( this.attr === "text" ) ||
          ( this.attr.startsWith( "textPadding" ) )
        )  {
          level.$updateNaturalWidthFromText();
          level.$updateNaturalHeightFromText();
        }

      } else if ( stateName !== "" ) {
        if ( this.calcValue ) { // state
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
        this.$updateWhenEventType( whenEventType );
      } else if ( transitionProp !== "" ) {
        this.$updateTransitionProp( transitionProp );
      } else if ( attr === "right" ) {
        if ( level.parentLevel !== undefined ) {
          level.parentLevel.$updateNaturalWidthFromChild( level );
        }
      } else if ( attr === "bottom" ) {
        if ( level.parentLevel !== undefined ) {
          level.parentLevel.$updateNaturalHeightFromChild( level );
        }
      }
    }
  };

  LAID.AttrValue.prototype.give = function ( attrValue ) {
    if ( LAID.$arrayUtils.pushUnique( this.takerAttrValueS, attrValue ) && this.takerAttrValueS.length === 1 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that a reference exists, add event listeners
        var
        eventType2fnHandler = LAID.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
        eventType,
        fnBoundHandler;
        for ( eventType in eventType2fnHandler ) {
          fnBoundHandler = eventType2fnHandler[ eventType ].bind( this );
          LAID.$eventUtils.add( this.$part.node, eventType, fnBoundHandler );
          this.eventReadonlyEventType2boundFnHandler[ eventType ] = fnBoundHandler;
        }
      }
    }
  };
  LAID.AttrValue.prototype.giveNot = function ( attrValue ) {
    if ( LAID.$arrayUtils.remove( this.takerAttrValueS, attrValue ) && this.takerAttrValueS.length === 0 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that no reference exists, remove event listeners
        var
        eventType2fnHandler = LAID.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
        eventType,
        fnBoundHandler;
        for ( eventType in eventType2fnHandler ) {
          fnBoundHandler = eventReadonlyEventType2boundFnHandler[ eventType ];
          LAID.$eventUtils.remove( this.$part.node, eventType, fnBoundHandler );
          this.eventReadonlyEventType2boundFnHandler[ eventType ] = undefined;
        }
      }
    }
  };


  LAID.AttrValue.prototype.take = function () {

    if ( this.value instanceof LAID.Take ) {
      var _relPath00attr_S, relPath, level, attr,
      i, len;
      // value is of type `LAID.Take`
      _relPath00attr_S = this.value._relPath00attr_S;

      for ( i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];

        level = relPath.resolve( this.level );
        if ( level === undefined ) {
          return false;
        }
        if ( level.$attr2attrValue[ attr ] === undefined )  {
          if ( eventReadonly2_eventType2fnHandler_[ attr  ] !== undefined ) {
            level.$referenceEventReadonlyAttr( attr );

          }
          if ( !LAID.$checkIsReadonlyAttr( attr ) ) {
            return false;
          }
        }
      }

      for ( i = 0; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];

        relPath.resolve( this.level ).$getAttrValue( attr ).give( this );

      }
    }

  };

  LAID.AttrValue.prototype.takeNot = function ( attrValue ) {

    if ( this.value instanceof LAID.Take ) {
      var _relPath00attr_S, relPath, level, attr;
      _relPath00attr_S = this.value._relPath00attr_S;

      for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];

        level = relPath.resolve( this.level );
        if ( ( level === undefined ) && ( level.$getAttrValue( attr ) !== undefined ) ) {
          level.$getAttrValue( attr ).giveNot( this );
        }
      }
    }

  };



})();
