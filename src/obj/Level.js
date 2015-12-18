( function () {
  "use strict";

  LAY.Level = function ( path, lson, parent, isHelper, derivedMany, rowDict, id ) {

    this.pathName = path;
    this.lson = lson;
    // if level is many, partLson contains the non-many part of the lson
    this.partLson = undefined;
    this.isGpu = undefined;
    this.isInitialized = false;

    this.parentLevel = parent; // parent Level
    this.attr2attrVal = {};

    // True if the Level is a Part Level,
    // false if the Level is a Many Level.
    this.isPart = undefined;

    // If the level name begins with "_",
    // the level is considered a helper (non-renderable)
    this.isHelper = isHelper;

    this.isExist = true;

    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.part = undefined;
    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.manyObj = undefined;


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

    this.childLevelS = [];

    this.stateS = [ "root" ];
    this.stringHashedStates2_cachedAttr2val_ =  {};
    this.newlyInstalledStateS = [];
    this.newlyUninstalledStateS = [];

  };

  LAY.Level.prototype.$init = function () {

    LAY.$pathName2level[ this.pathName ] = this;
    LAY.$newLevelS.push( this );
    if ( this.parentLevel ) {
      this.parentLevel.childLevelS.push( this );
    }

  };


  LAY.Level.prototype.level = function ( relativePath ) {

    return ( new LAY.RelPath( relativePath ) ).resolve( this );
  };

  LAY.Level.prototype.parent = function () {
    return this.parentLevel;
  };

  LAY.Level.prototype.path = function () {
    return this.pathName;
  };


  LAY.Level.prototype.node = function () {

    return this.isPart && this.part.node;
  };


  LAY.Level.prototype.attr = function ( attr ) {

    if ( this.attr2attrVal[ attr ] ) {
      return this.attr2attrVal[ attr ].calcVal;
    } else { 
      // Check if it is a doing event
      if ( attr.charAt( 0 ) === "$" ) {
        if ( LAY.$checkIfDoingReadonly( attr ) ) {
          console.error("LAY Error: " + attr + " must be placed in $obdurate");
          return undefined;
        } else if ( LAY.$checkIfImmidiateReadonly( attr ) ) {
          return this.part.getImmidiateReadonlyVal( attr );
        }
      } 
      if ( this.$createLazyAttr( attr, true ) ) {
        var attrVal = this.attr2attrVal[ attr ];
        attrVal.give( LAY.$emptyAttrVal );
        LAY.$solve();
        return attrVal.calcVal;
      } else {
        return undefined;
      }
    }
  };

  LAY.Level.prototype.data = function ( dataKey, value ) {
    this.$changeAttrVal( "data." + dataKey, value );
    LAY.$solve();
  };

  LAY.Level.prototype.row = function ( rowKey, value ) {
    if ( this.derivedMany ) {
      this.derivedMany.id2row[ this.id ][ rowKey ] = value;
      this.derivedMany.level.attr2attrVal.rows.requestRecalculation();
      LAY.$solve();
    }
  };

  LAY.Level.prototype.changeNativeInput = function ( value ) {
    this.part.node.value = value;
  };

  LAY.Level.prototype.changeNativeScrollX = function ( value ) {
    this.part.node.scrollLeft = value;
  };

  LAY.Level.prototype.changeNativeScrollY = function ( value ) {
    this.part.node.scrollTop = value;
  };

  LAY.Level.prototype.many = function () {
    return this.derivedMany && this.derivedMany.level;
  };

  LAY.Level.prototype.levels = function () {
    return this.manyObj && this.manyObj.allLevelS;
  };


  LAY.Level.prototype.rowsCommit = function ( newRowS ) {

    if ( !this.isPart ) {
      this.manyObj.rowsCommit( newRowS );
    }
  };

  LAY.Level.prototype.rowsMore = function ( newRowS ) {

    if ( !this.isPart ) {
      this.manyObj.rowsMore( newRowS );
    }
  };

  LAY.Level.prototype.rowAdd = function ( newRow ) {
    this.rowsMore( [ newRow ] );
  };

  LAY.Level.prototype.rowDeleteByID = function ( id ) {

    if ( !this.isPart ) {
      this.manyObj.rowDeleteByID( id );
    }
  };

  LAY.Level.prototype.rowsUpdate = function ( key, val, queryRowS ) {
    if ( !this.isPart ) {
      if ( queryRowS instanceof LAY.Query ) {
        queryRowS = queryRowS.rowS;
      }
      this.manyObj.rowsUpdate( key, val, queryRowS );
    }
  };

  LAY.Level.prototype.rowsDelete = function ( queryRowS ) {
    if ( !this.isPart ) {
      if ( queryRowS instanceof LAY.Query ) {
        queryRowS = queryRowS.rowS;
      }
      this.manyObj.rowsDelete( queryRowS );
    }
  };

  LAY.Level.prototype.dataTravelBegin = function ( dataKey, finalVal ) {
    var attrVal;
    if ( LAY.$isDataTravelling ) {
      console.error("LAY Warning: Existence of another unfinished data travel");
    } else {
      attrVal = this.attr2attrVal[ "data." + dataKey ];
      if ( attrVal === undefined ) {
        console.error ("LAY Warning: Inexistence of data key for data travel");
      }
      LAY.$isDataTravelling = true;
      LAY.level("/").attr2attrVal.$dataTravelling.update( true );
      LAY.$dataTravellingLevel = this;
      LAY.level("/").attr2attrVal.$dataTravelLevel.update( this );
      LAY.$dataTravellingAttrInitialVal = attrVal.val;
      LAY.$dataTravellingAttrVal = attrVal;

      LAY.$isDataTravellingShock = true;
      attrVal.update( finalVal );
      LAY.$solve();
      LAY.$isDataTravellingShock = false;

    }
  };

  LAY.Level.prototype.dataTravelContinue = function ( delta ) {
    if ( !LAY.$isDataTravelling ) {
      console.error( "LAY Warning: Inexistence of a data travel" );
    } else if ( this !== LAY.$dataTravellingLevel ){
      console.error( "LAY Warning: Inexistence of a data travel for this Level" );
    } else {
      if ( LAY.$dataTravelDelta !== delta ) {
        LAY.$dataTravelDelta = delta;
        LAY.level("/").attr2attrVal.$dataTravelDelta.update( delta );
        LAY.$render();
      }
    }
  };

  LAY.Level.prototype.dataTravelArrive = function ( isArrived ) {
    if ( !LAY.$isDataTravelling ) {
      console.error( "LAY Warning: Inexistence of a data travel" );
    } else {

      LAY.$isDataTravelling = false;
      LAY.level("/").attr2attrVal.$dataTravelling.update( false );
      LAY.$dataTravellingLevel = undefined;
      LAY.level("/").attr2attrVal.$dataTravelLevel.update( null );
      LAY.$dataTravelDelta = 0.0;
      LAY.level("/").attr2attrVal.$dataTravelDelta.update( 0.0 );


      // clear out attrvalues which are data travelling
      LAY.$clearDataTravellingAttrVals();
      if ( !isArrived ) {
        LAY.$dataTravellingAttrVal.update(
          LAY.$dataTravellingAttrInitialVal );
        LAY.$solve();

      } else {

      }

      LAY.$render();
    }
  };



  LAY.Level.prototype.queryRows = function () {
    if ( !this.isPart ) {
      return this.manyObj.queryRows();
    }
  };

  LAY.Level.prototype.queryFilter = function () {
    if ( !this.isPart ) {
      return this.manyObj.queryFilter();
    }
  };

  LAY.Level.prototype.addChildren = function ( name2lson ) {
    
    for ( var name in name2lson ) {
      var lson = name2lson[ lson ];
      this.lson.children[ name ] = lson; 
      this.$addChild( name, name2lson );
    }

  };


  LAY.Level.prototype.remove = function () {
    
    if ( this.pathName === "/" ) {
      console.error("LAY Error: Attempt to remove root level '/' prohibited");
    } else {
      if ( this.derivedMany ) {
        this.derivedMany.rowDeleteByID( this.id );
      } else {
        this.$remove();
        LAY.$solve();
      }
    }
    
  };

  LAY.Level.prototype.$remove = function () {

    this.$disappear();

    LAY.$pathName2level[ this.pathName ] = undefined;
    LAY.$arrayUtils.remove( this.parentLevel.childLevelS, this );
  
  };

  LAY.Level.prototype.$addChildren = function ( name2lson ) {

    if ( name2lson !== undefined ) {
      for ( var name in name2lson ) {
        this.$addChild( name, name2lson[ name ] );
      }
    }
  };

  LAY.Level.prototype.$addChild = function ( name, lson ) {
    var childPath, childLevel;

    if ( !LAY.$checkIsValidUtils.levelName( name ) ) {
      throw ( "LAY Error: Invalid Level Name: " + name );
    }
    childPath = this.pathName +
      ( this.pathName === "/" ? "" : "/" ) + name;
    if ( LAY.$pathName2level[ childPath ] !== undefined ) {
      throw ( "LAY Error: Level already exists with path: " +
        childPath + " within Level: " + this.pathName );
    }
    childLevel = new LAY.Level( childPath,
     lson, this, name.charAt(0) === "_" );
    childLevel.$init();

  };


  /*
  * Return false if the level could not be inherited (due
  * to another level not being present or started as yet)
  */
  LAY.Level.prototype.$normalizeAndInherit = function () {

    var lson, refS, i, len, ref, level, inheritedAndNormalizedLson;
    LAY.$normalize( this.lson, this.isHelper );
    
    // check if it contains anything to inherit from
    if ( this.lson.$inherit !== undefined ) { 
      lson = {};
      refS = this.lson.$inherit;
      for ( i = 0, len = refS.length; i < len; i++ ) {
        
        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference
          if ( ref === this.pathName ) {
            return false;
          }
          level = ( new LAY.RelPath( ref ) ).resolve( this );
          if ( ( level === undefined ) || !level.isInherited ) {
            return false;
          }
        }
      }
      for ( i = 0; i < len; i++ ) {

        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference
          
          level = ( new LAY.RelPath( ref ) ).resolve( this );
          inheritedAndNormalizedLson = level.lson;

        } else { // object reference
           LAY.$normalize( ref, true );
           inheritedAndNormalizedLson = ref;
        }

        LAY.$inherit( lson, inheritedAndNormalizedLson );
      }

      LAY.$inherit( lson, this.lson );
      
      this.lson = lson;
    }

    this.isInherited = true;
    return true;


  };

  LAY.Level.prototype.$reproduce = function () {
    if ( this.isPart ) {
      this.part = new LAY.Part( this );
      this.part.init();
      
      if ( this.lson.children !== undefined ) {
        this.$addChildren( this.lson.children );
      }
    } else {
      this.manyObj = new LAY.Many( this, this.partLson );
      this.manyObj.init();
    }
  };

  LAY.Level.prototype.$identify = function () {
    this.isPart = this.lson.many === undefined ||
      this.derivedMany;
    if ( this.pathName === "/" ) {
      this.isGpu = this.lson.$gpu === undefined ?
        true : 
        this.lson.$gpu;
    } else {
      this.isGpu = this.lson.$gpu === undefined ?
        this.parentLevel.isGpu :
        this.lson.$gpu;
    }
    this.isGpu = this.isGpu && LAY.$isGpuAccelerated;

    if ( this.isPart ) {
      if ( !this.derivedMany ) {
      LAY.$defaultizePartLson( this.lson,
        this.parentLevel );
      }
    } else {
      if ( this.pathName === "/" ) {
        throw "LAY Error: 'many' prohibited for root level /";
      }
      this.partLson = this.lson;
      this.lson = this.lson.many;
      
      LAY.$defaultizeManyLson( this.lson );
    }
  };

  function initAttrsObj( attrPrefix, key2val,
   attr2val, isNoUndefinedAllowed ) {

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

      attr2val.formation = slson.formation;
      attr2val.filter = slson.filter;

      if ( fargs ) {
        for ( var formationFarg in fargs ) {
          initAttrsObj( "fargs." + formationFarg + ".",
            fargs[ formationFarg ], attr2val, false );        
        }
      }

      attr2val[ "$$num.sort" ] = slson.sort.length;

      for ( i = 0, len = slson.sort.length; i < len; i++ ) {
        initAttrsObj( "sort." + ( i + 1 ) + ".", slson.sort[ i ],
         attr2val, false );
      }
      
    }
  }

  LAY.Level.prototype.$updateExistence = function () {
    var isExist = this.attr2attrVal.exist.calcVal;
    if ( isExist ) {
      this.$appear();
    } else {
      this.$disappear();
    }
  };

  /*
  LAY.Level.prototype.$checkIfParentExists = function () {
    if ( this.pathName === "/" ) {
      return this.isExist;
    } else {
      return this.isExist ? this.parentLevel.$checkIfParentExists() : false;
    }
  };*/

  LAY.Level.prototype.$appear = function () {
    this.isExist = true;
    this.$reproduce();
    this.$initAllAttrs();

    if ( this.isPart ) {
      this.part.add();
    }
    
  };  

   LAY.Level.prototype.$disappear = function () {
    this.isExist = false;
    var attr2attrVal = this.attr2attrVal;
    for ( var attr in attr2attrVal ) {
      if ( attr !== "exist" ) {
        attr2attrVal[ attr ].remove();
      }
    }
    var descendantLevelS = this.isPart ? 
      this.childLevelS : this.manyObj.allLevelS ;
    for ( var i=0, len=descendantLevelS.length; i<len; i++ ) {
      descendantLevelS[ i ] &&
        descendantLevelS[ i ].$remove();
    }

    if ( this.isPart ) {
      this.part && this.part.remove();
    } else {
      this.manyObj.remove();
    }
   
  };

  LAY.Level.prototype.$decideExistence = function () {
    if ( !this.isHelper ) {
      this.$createAttrVal( "exist", this.lson.exist ===
        undefined ? true : this.lson.exist );    
    }
  };

  LAY.Level.prototype.$initAllAttrs = function () {

    var
      obdurateReadonlyS = this.lson.$obdurate ?
       this.lson.$obdurate : [],
      obdurateReadonly, i, len;
  
    this.isInitialized = true;

    if ( this.isPart ) {
      if ( this.lson.states.root.props.scrollX ) {
        obdurateReadonlyS.push( "$naturalWidth" );
      }
      if ( this.lson.states.root.props.scrollY ) {
        obdurateReadonlyS.push( "$naturalHeight" );
      }
      
      if ( this.part.type === "input" &&
          this.part.inputType !== "line" ) {
        // $input will be required to compute
        // the natural height if it exists
        // TODO: optimize
        obdurateReadonlyS.push( "$input" );
      }
    }

    if ( obdurateReadonlyS.length ) {
      for ( i = 0, len = obdurateReadonlyS.length; i < len; i++ ) {
        obdurateReadonly = obdurateReadonlyS[ i ];
        if ( !this.$createLazyAttr( obdurateReadonly ) ) {
          throw "LAY Error: Unobervable Attr: '" +
            obdurateReadonly  + "'";
        }
        this.attr2attrVal[ obdurateReadonly ].give(
          LAY.$emptyAttrVal );
      }
    }

    this.$initNonStateProjectedAttrs();
    this.$updateStates();

  };

  LAY.Level.prototype.$initNonStateProjectedAttrs = function () {

    var 
      key, val, stateName, state,
      states = this.lson.states,
      lson = this.lson,
      attr2val = {};


    initAttrsObj( "data.", lson.data, attr2val, false );

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
      attr2val.right = LAY.$essentialPosAttr2take.right;
      attr2val.bottom = LAY.$essentialPosAttr2take.bottom;
      if ( this.pathName === "/" ) {
        attr2val.$dataTravelling = false;
        attr2val.$dataTravelDelta = 0.0;
        attr2val.$dataTravelLevel = undefined;
        attr2val.$absoluteLeft = 0;
        attr2val.$absoluteTop = 0;
        attr2val.$windowWidth = window.innerWidth ||
         document.documentElement.clientWidth ||
          document.body.clientWidth;
        attr2val.$windowHeight = window.innerHeight ||
         document.documentElement.clientHeight ||
          document.body.clientHeight;
      } else if ( this.derivedMany ) {
        initAttrsObj( "row.", this.rowDict, attr2val, false );
        attr2val.$i = 0;
        attr2val.$f = 0;
      }
    } else { // Many
      attr2val.rows = lson.rows;
      attr2val.$id = lson.$id;
      attr2val.$$layout = null;
    }

    this.$commitAttr2Val( attr2val );

  };

  LAY.Level.prototype.$commitAttr2Val = function ( attr2val ) {

    var attr, val, attrVal;
    for ( attr in attr2val ) {
      val = attr2val[ attr ];
      attrVal = this.attr2attrVal[ attr ];
      if ( ( attrVal === undefined ) ) {
        attrVal = this.attr2attrVal[ attr ] = new LAY.AttrVal( attr, this );
      }
      attrVal.update( val );

    }
  };

  LAY.Level.prototype.$createAttrVal = function ( attr, val ) {

    ( this.attr2attrVal[ attr ] =
      new LAY.AttrVal( attr, this ) ).update( val );

  };


  /*
  * Return true if attr was created as it exists (in lazy form),
  * false otherwise (it is not present at all to be created)
  */
  LAY.Level.prototype.$createLazyAttr = function ( attr, isNoImmidiateReadonly ) {
    var
     splitAttrLsonComponentS, attrLsonComponentObj, i, len,
     firstAttrLsonComponent;

    if ( LAY.$miscPosAttr2take[ attr ] ) {
      this.$createAttrVal( attr,
        LAY.$miscPosAttr2take[ attr ] );
    } else if ( attr.charAt( 0 ) === "$" ) { //readonly
      if ( [ "$type", "$load", "$id", "$inherit", "$obdurate" ].indexOf(
            attr ) !== -1 ) {
          this.$createAttrVal( attr, this.lson[ attr ] );
      } else if ( attr === "$path" ) {
        this.$createAttrVal( "$path", this.pathName );
      } else {
        if ( !isNoImmidiateReadonly &&
         LAY.$checkIfImmidiateReadonly( attr ) ) {
          this.$createAttrVal( attr, null );
        } else if ( LAY.$checkIfDoingReadonly( attr ) ) {
          this.$createAttrVal( attr, false );
        } else {
          console.error("LAY Error: Incorrectly named readonly: " + attr );
          return false;
        }
      }
    } else {
      if ( attr.indexOf( "." ) === -1 ) {
        var lazyVal = LAY.$getLazyPropVal( attr,
          this.parentLevel === undefined );
        if ( lazyVal !== undefined ) {
          this.$createAttrVal( attr, lazyVal );
        } else {
          return false;
        }
      } else {
        if ( attr.startsWith( "data." ||
            attr.startsWith("row.") ) ) {
          return false;
        } else {
          splitAttrLsonComponentS = attr.split( "." );
          if ( this.lson.states === undefined ) {
            return false;
          } else {
            firstAttrLsonComponent = splitAttrLsonComponentS[ 0 ];

            // Get down to state level
            if ( LAY.$checkIsValidUtils.stateName(
             firstAttrLsonComponent ) ) {
              attrLsonComponentObj = this.lson.states[ firstAttrLsonComponent ];
            } else {
              return false;
            }
            splitAttrLsonComponentS.shift();

            // remove the state part of the attr components
            if ( splitAttrLsonComponentS[ 0 ]  === "when" ) {
              splitAttrLsonComponentS[ splitAttrLsonComponentS.length - 1 ] =
                parseInt( splitAttrLsonComponentS[
                  splitAttrLsonComponentS.length -1 ] ) - 1;
            } else if ( ["fargs", "sort",
             "formation", "filter", "rows"].indexOf(
              splitAttrLsonComponentS[ 0 ]) !== -1 ) {

            } else if ( splitAttrLsonComponentS[ 0 ] !== "transition" ) {
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
              this.$createAttrVal( attr ,
                 attrLsonComponentObj );
            }
          }
        }
      }
    }
    return true;
  };

 

  /*
  Undefine all current attributes which are influencable
  by states: props, transition, when, $$num, $$max
  */
  LAY.Level.prototype.$undefineStateProjectedAttrs = function() {

    var attr;
    for ( attr in this.attr2attrVal ) {
      if ( this.attr2attrVal[ attr ].isStateProjectedAttr ) {
        this.attr2attrVal[ attr ].update( undefined );
      }
    }
  };


  /* Return the attr2value generated
  by the current states */
  LAY.Level.prototype.$getStateAttr2val = function () {

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
  LAY.Level.prototype.$sortStates = function ( stateS ) {

    var
      sortedStateS = this.stateS.sort(),
      i, len, sortedState;

    // Push the "root" state to the start for least priority
    LAY.$arrayUtils.remove( sortedStateS, "root" );
    sortedStateS.unshift("root");

    // Push the "formationDisplayNone" state to the end of the
    // list of states for maximum priority.
    if ( sortedStateS.indexOf( "formationDisplayNone" ) !== -1 ) {
      LAY.$arrayUtils.remove( sortedStateS, "formationDisplayNone" );
      sortedStateS.push( "formationDisplayNone" );
    }

  };

  /*
  *  From the current states generate the
  *  correspinding SLSON (state projected lson)
  *  Requirement: the order of states must be sorted
  */
  LAY.Level.prototype.$generateSLSON =  function () {

    this.$sortStates();

    var slson = {}, attr2val;
    for ( var i = 0, len = this.stateS.length; i < len; i++ ) {
      LAY.$inherit( slson, this.lson.states[ this.stateS[ i ] ],
        true, !this.isPart, true );
    }

    return slson;

  };


  LAY.Level.prototype.$updateStates = function () {

    var attr2attrVal = this.attr2attrVal;

    this.$undefineStateProjectedAttrs();
    this.$commitAttr2Val( this.$getStateAttr2val() );

    if ( this.derivedMany &&
        !this.derivedMany.level.attr2attrVal.filter.isRecalculateRequired &&
        attr2attrVal.$f.calcVal !== 1 ) {
      this.$setFormationXY( this.part.formationX,
          this.part.formationY );
    }


    if ( this.pathName === "/" ) {
      if ( this.attr2attrVal.width.val !==
        this.lson.states.root.props.width ) {
        throw "LAY Error: width of root level unchangeable";
      }
      if ( this.attr2attrVal.height.val !==
        this.lson.states.root.props.height ) {
        throw "LAY Error: height of root level unchangeable";
      }
      if ( this.attr2attrVal.top.val !== 0 ) {
        throw "LAY Error: top of root level unchangeable";        
      }
      if ( this.attr2attrVal.left.val !== 0 ) {
        throw "LAY Error: left of root level unchangeable";        
      }
    } 
  };


  LAY.Level.prototype.$getAttrVal = function ( attr ) {
    return this.attr2attrVal[ attr ];

  };

  /* Manually change attr value */
  LAY.Level.prototype.$changeAttrVal = function ( attr, val ) {
    if ( this.attr2attrVal[ attr ] ) {
      this.attr2attrVal[ attr ].update( val );
      LAY.$solve();
    }
  };

  LAY.Level.prototype.$requestRecalculation = function ( attr ) {
    if ( this.attr2attrVal[ attr ] ) {
      this.attr2attrVal[ attr ].requestRecalculation();
      LAY.$solve();
    }
  };

  LAY.Level.prototype.$setFormationXY = function ( x, y ) {

    this.part.formationX = x;
    this.part.formationY = y;

    if ( this.part ) { //level might not initialized as yet
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
    }
 
  };

  /*
  LAY.Level.prototype.addRecalculateDirtyAttrVal = function ( attrVal ) {

    LAY.$arrayUtils.pushUnique( this.recalculateDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( LAY.$recalculateDirtyLevelS, this );

  };
  */


  

  







})();
