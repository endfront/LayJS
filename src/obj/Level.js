( function () {
  "use strict";

  LAID.Level = function ( path, lson, parent, derivedMany, rowDict, id ) {

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
    this.rowDict = rowDict;

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

    } else { 
      var lazyReadonlyVal = this.isPart &&
        this.part.getLazyReadonlyValAtRuntime( attr );
      if ( lazyReadonlyVal ) {
        return lazyReadonlyVal;
      } else if ( this.$createLazyAttr( attr ) ) {
        var attrVal = this.attr2attrVal[ attr ];
        attrVal.give( LAID.$emptyAttrVal );
        LAID.$solve();
        return attrVal.calcVal;

      } 
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
      LAID.$solve();
    } else if ( this.many ) {
      allLevelS = this
    }
  };

  LAID.Level.prototype.changeNativeInput = function ( value ) {
    this.part.node.value = value;
  };

  LAID.Level.prototype.changeNativeScrollX = function ( value ) {
    this.part.node.scrollLeft = value;
  };

  LAID.Level.prototype.changeNativeScrollY = function ( value ) {
    this.part.node.scrollTop = value;
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
      if ( this.derivedMany ) {
        console.error("LAID Error: Attempt to remove a lson.many derived level without using rowDelete()");
      } else {
        this.$remove();
        LAID.$solve();
      }
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
  
    LAID.$normalize( this.lson, false );
    
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

  LAID.Level.prototype.$identifyAndReproduce = function () {
    this.isPart = this.lson.many === undefined;
//    console.log(this.pathName, this.lson);

    if ( this.isPart ) {
      if ( !this.derivedMany ) {
        LAID.$defaultizePartLson( this.lson,
          this.pathName === "/" );
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
      
    }
  };

  function initAttrsObj( attrPrefix, key2val, attr2val, isNoUndefinedAllowed ) {

    var key, val;

    for ( key in key2val ) {
      if ( ( key2val[ key ] !== undefined ) ||
          !isNoUndefinedAllowed ) {
        attr2val[ attrPrefix + key ] = key2val[ key ];
      }
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
      initAttrsObj( "", slson.props, attr2val, true );

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
            transitionDirective.args, attr2val, false );
        }
      }

      for ( eventType in when ) {
        fnCallbackS = when[ eventType ];
        initAttrsArray( "when." + eventType, fnCallbackS, attr2val );
      }

      if ( slson.$$num !== undefined ) {
        initAttrsObj( "$$num.", slson.$$num, attr2val, false );
      }

      if ( slson.$$max !== undefined ) {
        initAttrsObj(  "$$max.", slson.$$max, attr2val, false );
      }
    } else {
      if ( fargs ) {
        for ( var formationFarg in fargs ) {
          initAttrsObj( "fargs." + formationFarg + ".",
            fargs[ formationFarg ], attr2val, false );        
        }
      }

      attr2val.formation = slson.formation;
      attr2val.filter = slson.filter;
      attr2val[ "$$num.sort" ] = slson.sort.length;

      for ( i = 0, len = slson.sort.length; i < len; i++ ) {
        initAttrsObj( "sort." + ( i + 1 ) + ".", slson.sort[ i ],
         attr2val, false );
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
      
      if ( this.part.type === "input" &&
          this.part.inputType !== "line" ) {
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
        if ( !this.$createLazyAttr( observableReadonly ) ) {
          throw "LAID Error: Unobervable Attr: '" +
            observableReadonly  + "'";
        }
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

    initAttrsObj( "data.", lson.data, attr2val, false );

    if ( this.derivedMany ) {
      initAttrsObj( "row.", this.rowDict, attr2val, false  );
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

    if ( this.isPart ) { 
      attr2val.right = LAID.$essentialPosAttr2take.right;
      attr2val.bottom = LAID.$essentialPosAttr2take.bottom;
    } else { // Many
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

    ( this.attr2attrVal[ attr ] =
      new LAID.AttrVal( attr, this ) ).update( val );

  };


  /*
  * Return true if attr was created as it exists (in lazy form),
  * false otherwise (it is not present at all to be created)
  */
  LAID.Level.prototype.$createLazyAttr = function ( attr ) {
    var
     splitAttrLsonComponentS, attrLsonComponentObj, i, len,
     firstAttrLsonComponent, createdAttrVal;

    if ( LAID.$miscPosAttr2take[ attr ] ) {
      this.$createAttrVal( attr,
        LAID.$miscPosAttr2take[ attr ] );
    } else if ( attr.startsWith( "$" ) ) { //readonly
      createdAttrVal = this.attr2attrVal[ attr ] =
        new LAID.AttrVal( attr, this );

      if ( [ "$type", "$interface", "$inherit", "$observe" ].indexOf(
            attr ) !== -1 ) {
          createdAttrVal.update( this.lson[ attr ] );
      } else {
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
            createdAttrVal.update( this.part.absoluteX );
            break;
          case "$absoluteY":
            createdAttrVal.update( this.part.absoluteY );
            break;
          case "$focused":
            createdAttrVal.update( this.part &&
             this.part.node === document.activeElement );
            break;
          case "$scrolledX":
            createdAttrVal.update( this.part.node.scrollLeft );
            break;
          case "$scrolledY":
            createdAttrVal.update( this.part.node.scrollTop );
            break;
          case "$cursorX":
            createdAttrVal.update( this.part.node.offsetX );
            break;
          case "$cursorY":
            createdAttrVal.update( this.part.node.offsetY );
            break;
          case "$input":
            createdAttrVal.update( this.part.node.value );
            break;
          case "$inputChecked":
            createdAttrVal.update( this.part.node.value );
            break;
          case "$hovering":
            createdAttrVal.update( false );
            break;
          case "$clicking":
            createdAttrVal.update( false );
            break;
          case "$dataTravelling":
            createdAttrVal.update( false );
            break;
          case "$dataTravelDelta":
            createdAttrVal.update( 0.0 );
            break;
          case "$dataTravelLevel":
            createdAttrVal.update( null );
            break;

        }
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
              this.$createdAttrVal( attr , firstAttrLsonComponent );
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
//        console.log( "\trecalculate", this.pathName, isSolveProgressed,
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

    // Push the "root" state to the start for least priority
    LAID.$arrayUtils.remove( sortedStateS, "root" );
    sortedStateS.unshift("root");

    // Push the "formationDisplayNone" state to the end of the
    // list of states for maximum priority.
    if ( sortedStateS.indexOf( "formationDisplayNone" ) !== -1 ) {
      LAID.$arrayUtils.remove( sortedStateS, "formationDisplayNone" );
      sortedStateS.push( "formationDisplayNone" );
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

    var attr2attrVal = this.attr2attrVal;

    this.$undefineStateProjectedAttrs();
    this.$commitAttr2Val( this.$getStateAttr2val() );

    if ( this.derivedMany &&
       !this.derivedMany.level.
        attr2attrVal.filter.isRecalculateRequired &&
        attr2attrVal.$f &&
        attr2attrVal.$f.calcVal !== 1 ) {
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
    var
      topAttrVal = this.attr2attrVal.top,
      leftAttrVal = this.attr2attrVal.left;

    if ( x === undefined ) {
      leftAttrVal.update( this.derivedMany.defaultFormationX );
    } else {
      leftAttrVal.update( x );
    }
    if ( y === undefined ) {
      topAttrVal.update( this.derivedMany.defaultFormationY );
    } else {
      topAttrVal.update( y );
    }

    topAttrVal.requestRecalculation();
    leftAttrVal.requestRecalculation();

    this.part.formationX = x;
    this.part.formationY = y;
 
  };

  LAID.Level.prototype.addRecalculateDirtyAttrVal = function ( attrVal ) {

    LAID.$arrayUtils.pushUnique( this.recalculateDirtyAttrValS, attrVal );
    LAID.$arrayUtils.pushUnique( LAID.$recalculateDirtyLevelS, this );

  };



  

  







})();
