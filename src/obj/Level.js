( function () {
  "use strict";



  LSON.Level = function ( path, lson, clogKey, parent ) {

    this.path = path;
    this.lson = lson;
    this.parent = parent;
    this.$inherited = false;
    this.prepared = false;
    this.isPart = undefined;
    this.$stateS = [];

    // keep track of currently calculating attributes
    // to check for circular references

    if ( lson.children ) {

      this.addChildren( lson.children, clogKey );

    }


  };



  // unclog



  LSON.Level.prototype.addChildren = function ( name2lson, clogKey ) {

    if ( clogKey === undefined ) {

      clogKey = ++LSON.$curClogKey;
      LSON.$clogKey2_levelS_[ clogKey ] = [];

    }

    var childPath, childLevel;
    for ( var name in name2lson ) {

      if ( name2lson.hasOwnProperty( name ) ) {

        childPath = this.path + '/' + name;
        childLevel = new LSON.Level( childPath, name2lson[ name ], clogKey, this );
        LSON.$path2level[ childPath ] = childLevel;
        LSON.$clogKey2_levelS_[ clogKey ].push( childLevel );

      }
    }

  };

  LSON.Level.prototype.$inherit = function() {

    if ( !this.$inherited ) {
      LSON.$normalize( lson, false );
      if ( this.lson.inherits === undefined ) { // does not contain anything to inherit from

        this.$inherited = true;

      } else {

        var refS = this.lson.inherits;
        for ( var i = 0, len = refS.length, ref, level, inheritedAndNormalizedLson; i < len; i++ ) {

          ref = refS[ i ];
          if ( typeof ref === "string" ) { // pathname reference

            level = ( new LSON.Path( ref ) ).resolve( this );
            if ( !level.$inherited ) {

              level.$inherit();

            }

            inheritedAndNormalizedLson = level.lson;

          } else { // object reference

            inheritedAndNormalizedLson = LSON.$normalize( ref, true );

          }

          LSON.$inherit( this.lson, inheritedAndNormalizedLson );

        }
      }
    }
  };


  function AttrValue ( attr, value, level ) {

    this.level = level;
    this.attr = attr;
    this.value = value;
    this.isTaker = value instanceof LSON.Take;

    this.isDirty = true;
    this.isCalculating = false;
    // undefined initializations performance:
    // http://jsperf.com/objects-with-undefined-initialized-properties/2
    this.curCalcValue = undefined;
    this.finalCalcValue = undefined;
    this.startCalcValue = undefined; // relevant for transitions

    this.isTransitioning = false;
    this.transitioningTimeCurrent = 0;
    this.transitioningTimeTotal = 0;
    this.transitioningTimeDelay = 0;

    this.takerAttrValueS = [];

  }

  AttrValue.prototype.initValue = function () {

    if ( this.isTaker ) {
        this.give();
    }

  };

  /*
  * Recalculate the value of the attr value.
  * Propagate the change across the LOM (LSON object model)
  * if the change in value produces a change.
  * For constraint (take) based attributes, recalculate the
  * value, for non constraint based use the `value` parameter
  * as the change.
  * Return true if calculation successful, false if
  * a circular reference rendered it unsuccessful
  */
  AttrValue.prototype.reCalculate = function () {

    if ( this.isCalculating ) { // Check for circular reference

      // circular reference
      return false;

    } else {

      this.isCalculating = true;

      // Check if the calculating attr is a state attr

      var attrValue = attr2attrValue[ attr ];
      var isDirty = false;

      if ( attrValue.isTaker ) { //is LSON.Take

        var reCalc = attrValue.value.execute( this );
        if ( reCalc !== attrValue.finalCalcValue ) {

          isDirty = true;
          this.$attr2attrValue[ attr ].curCalcValue = reCalc;

        }

      } else {

        if ( value !== attrValue.value ) {

          isDirty = true;
          this.$attr2attrValue[ attr ].value = value;
          this.$attr2attrValue[ attr ].curCalcValue = value;

        }
      }

      if ( isDirty ) {

        var takerLevelS, pendingTakerLevelS, cleanedOne, i, len;
        takerLevelS = attrValue[ attr ];

        if ( takerLevelS !== undefined ) {
          cleanedOne = false;
          pendingTakerLevelS = [];
          do {

            for ( i = 0, len = takerLevelS.length; i < len; i++ ) {
              ??
              takerLevelS[ i ].$actOnDirtyTookAttr( this.path, attr );

            }
          } while ( cleanedOne );

        }
      }

      this.isCalculating = false; // done calculating
      return true;
    }

  };

  AttrValue.prototype.give = function ( attrValue ) {
    addElementToArray( this.takerAttrValueS, attrValue );
  };
  AttrValue.prototype.giveNot = function ( attrValue ) {
    removeElementFromArray( this.takerAttrValueS, attrValue );
  };


  AttrValue.prototype.take = function () {

    var _relPath00attr_S, relPath, level, attr;
    // value is of type `LSON.Take`
    _relPath00attr_S = this.value._relPath00attr_S;

    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      relPath = _relPath00attr_S[ i ][ 0 ];
      attr = _relPath00attr_S[ i ][ 1 ];

      level = relPath.resolve( this.level );
      if ( level === undefined ) {

        console.error("LSON ERROR: Undefined level relative path: " + relPath.childPath );

      } else {

        level.$getAttrValue( attr ).give( this );
      }
    }

  };

  AttrValue.prototype.takeNot = function ( attrValue ) {

    var _relPath00attr_S, relPath, level, attr;
    // value is of type `LSON.Take`
    _relPath00attr_S = this.value._relPath00attr_S;

    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      relPath = _relPath00attr_S[ i ][ 0 ];
      attr = _relPath00attr_S[ i ][ 1 ];

      level = relPath.resolve( this.level );
      if ( level === undefined ) {

        console.error("LSON ERROR: Undefined level relative path: " + relPath.childPath );

      } else {

        level.$getAttrValue( attr ).giveNot( this );
      }
    }

  };

  // inspiration from https://github.com/koenbok/Framer/blob/master/framer/Animators/
  function LinearAnimator () {

  }
  LinearAnimator.prototype.next = function ( delta ) {

  };
  LinearAnimator.prototype.done = function () {

  };



  LSON.Level.prototype.$initAttrs = function () {


    var attr2attrValue, dirtyAttrS,  key, value, attr, data, props;

    dirtyAttrS = [];
    attr2attrValue = {};

    data = this.lson.data;
    props = this.lson.props;
    states = this.lson.states;



    for ( key in data ) {

      if ( data.hasOwnProperty( key ) ) {

        value = data[ key ];
        attr = "data." + key;

        attr2attrValue[ attr ] = new AttrValue( attr, value, this );
        dirtyAttrS.push( attr );

      }
    }


    for ( key in props ) {

      if ( props.hasOwnProperty( key ) ) {

        value = props[ key ];
        attr = key;

        attr2attrValue[ attr ] = new AttrValue( attr, value, this );
        dirtyAttrS.push( key );

      }
    }

    for ( key in states ) {

      if ( states.hasOwnProperty( key ) ) {

        value = states[ key ].onlyif;
        attr = "state." + key;

        if ( value !== undefined ) {

          attr2attrValue[ attr ] = new AttrValue( attr, value, this );
        }
      }
    }


    this.$attr2attrValue = attr2attrValue;
    this.dirtyAttrS = dirtyAttrS;

  };

  // diff required when changing states
  // TODO: change name ot $updateState?
  LSON.Level.protoype.$diffAttrs = function () {

    //LSON.$inherit( this.lson, inheritedAndNormalizedLson );


    for ( var i = 0, len = this.$stateS.length; i < len; i++ ) {


    }

  };

  LSON.Level.prototype.$getAttrValue = function ( attr ) {

    return this.$attr2attrValue[ attr ];

  };

/*
  LSON.Level.prototype.$takeLevels = function ( value, attr ) {

    var _relPath00attr_S, relPath, level, levelPath, tookAttr2attrS, tookAttr;
    // value is of type `LSON.Take`
    _relPath00attr_S = value._relPath00attr_S;

    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      relPath = _relPath00attr_S[ i ][ 0 ];
      tookAttr = _relPath00attr_S[ i ][ 1 ];

      level = relPath.resolve( this );
      if ( level === undefined ) {

        console.error("LSON ERROR: Undefined level relative path: " + relPath.childPath );

      } else {

        level.$giveAttr( this, tookAttr );
        levelPath = level.path;

        tookAttr2attrS = this.$tookLevelPath2_tookAttr2attrS_[ levelPath ];
        if ( tookAttr2attrS === undefined ) {

          this.$tookLevelPath2_tookAttr2attrS_[ levelPath ] = new HashArray();
          tookAttr2attrS = this.$tookLevelPath2_tookAttr2attrS_;

        }

        addElementToHashmapArray( tookAttr2attrS, tookAttr, attr );

      }
    }
  };

  LSON.Level.prototype.$takeLevelsNot = function ( value, attr ) {

    var _relPath00attr_S, relPath, level, levelPath, tookAttr2attrS, tookAttr;
    _relPath00attr_S = value._relPath00attr_S;

    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      relPath = _relPath00attr_S[ i ][ 0 ];
      tookAttr = _relPath00attr_S[ i ][ 1 ];

      level = relPath.resolve( this );
      if ( level === undefined ) {

        console.error("LSON ERROR: Undefined level relative path: " + relPath.childPath );

      } else {

        levelPath = level.path;

        tookAttr2attrS = this.$tookLevelPath2_tookAttr2attrS_[ levelPath ];
        if ( tookAttr2attrS !== undefined ) {

          removeElementFromHashmapArray( tookAttr2attrS, tookAttr, attr);

          // Check if this was the last reference to the attribute
          if ( tookAttr2attrS[ tookAttr ] === undefined ) {
            level.$giveAttrNot( this, tookAttr );
          }

          // even if the level path reference in the $tookLevelPath2_tookAttr2attrS_ hashmap points to an empty HashArray
          // a deference will not be performed for:
          // (1) The initial reference was created by the level's state or data change. It is very possible in the case
          // of the latter (state change) that the change will revert, therefore reinitialization will have to be performed.
          // (2) Unlike arrays, checking for an empty hashmap is lesser efficient in terms of performance.

        }


      }
    }

  };
  LSON.Level.prototype.$giveAttr = function ( level, attr ) {

    var attrValue = attr2attrValue[ attr ];
    if ( attrValue === undefined ) {
      // inititialize this uninitialized attr
      // as the taking level `level` would not
      // be notified if this attr actually turns
      // out to exist later.
      // Perfect example would be LSON.Color where
      // the taking level demands a component
      // of a color format, for instance "h" (hue),
      // If we haven't "calculated" the value of the
      // given color we will not have the hue component
      // available for the current moment
      this.$attr2attrValue[ attr ] = new AttrValue( undefined );
      attrValue = this.$attr2attrValue[ attr ];
    }
    addElementToArray( attrValue.takerLevelS, level );


  };


  LSON.Level.prototype.$giveAttrNot = function ( level, attr ) {

    var attrValue = attr2attrValue[ attr ];
    if ( attrValue !== undefined ) {
      removeElementFromArray( attrValue.takerLevelS, level );
    }

  };

*/



  function checkIsAttrState ( attr ) {

    return attr[ 0 ] === "s" &
    attr[ 1 ] === "t" &
    attr[ 2 ] === "a" &
    attr[ 3 ] === "t" &
    attr[ 4 ] === "e" &
    attr[ 5 ] === ".";

  }

  function checkIsAttrData ( attr ) {

    return attr[ 0 ] === "d" &
    attr[ 1 ] === "a" &
    attr[ 2 ] === "t" &
    attr[ 3 ] === "a" &
    attr[ 4 ] === ".";

  }

  LSON.Level.prototype.$prepare = function () {



    var isMany = this.lson.many !== undefined;
    var lson = isMany ? this.lson.many : this.lson;

    this.isPart = true;
    this.part = new LSON.Part( this );
    var dirtyAttrS = this.dirtyAttrS;
    //var attr2attrValue =  this.$attr2attrValue;

    for ( var i = 0, len = dirtyAttrS.length, dirtyAttr; i < len; i++ ) {

      dirtyAttr = dirtyAttrS[ i ];
      if ( !checkIsAttrState( dirtyAttr ) ) {

        this.$cleanifyAttr( dirtyAttr );

      }
    }



  };

/*

  LSON.Level.prototype.$actOnDirtyTookAttr = function ( tookLevelPath, tookAttr ) {

    this.$curCalculatingAttr = undefined; ??

    var tookAttr2attrS, attrS, attr;
    tookAttr2attrS = this.$tookLevelPath2_tookAttr2attrS_[ level.path ];

    if ( tookAttr2attrS !== undefined ) {
      attrS = tookAttr2attrS[ tookAttr ];


    }

  };
*/





  /*
  * Add to array if element does not exist already
  * Return true the element was added (as it did not exist previously)
  */
  function addElementToArray( elementS, element ) {
    if ( elementS.indexOf( element ) !== -1  ) {
      itemS.push( element );
      return true;
    }
    return false;
  }

  /*
  * Remove from array if element exists in it
  * Return true the element was remove (as it did exist previously)
  */
  function removeElementFromArray( elementS, element ) {
    var ind = elementS.indexOf( element );
    if ( ind !== -1 ) {
      elementS.splice( ind, 1 );
      return true;
    }
    return false;
  }


  /*
  * Data structure of a HashMap mapping to array of strings.
  * If mapping exists to a single element array, mapping is directed to
  * string, to reduce overhead of storing an array data structure.
  */
  /*
  function addElementToHashmapArray( hashmap, key, element ) {

    var element3elementS = hashmap[ key ];

    if ( element3elementS === undefined ) {

      hashmap[ key ] = element;

    } else if ( ! element3elementS instanceof Array ) {

      if ( element3elementS !== element ) {

        hashmap[ key ] = [ element3elementS, element ];

      }

    } else  {

      addElementToArray( element3elementS, element );
    }
  }


  function removeElementFromHashmapArray( hashmap, key, element ) {

    var element3elementS = hashmap[ key ];
    if ( element3elementS !== undefined ) {

      if ( !( element3elementS instanceof Array ) ) {

        if ( element3elementS === element ) {

          hashmap[ key ] = null;

        }

      } else {
        removeElementFromArray( element3elementS, element );
        if ( element3elementS.length === 1 ) {

          hashmap[ key ] = element3elementS[ 0 ];
        }
      }
    }
  }
  */





})();
