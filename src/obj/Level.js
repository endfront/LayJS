( function () {
  "use strict";



  LSON.Level = function ( path, lson, clogKey, parent ) {

    this.path = path;
    this.lson = lson;
    this.parent = parent;
    this.inherited = false;
    this.prepared = false;
    this.isPart = undefined;
    this.$stateS = [];

    // keep track of currently calculating attributes
    // to check for circular references
    this.$curCalculatingAttr = undefined;

    if ( lson.children ) {

      this.addChildren( lson.children, clogKey );

    }

    this.$tookLevelPath2_tookAttr2attrS_ = {};


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

    if ( !this.inherited ) {
      LSON.$normalize( lson, false );
      if ( !this.lson.inherit ) {

        this.inherited = true;

      } else {

        var refS = this.lson.inherit;
        for ( var i = 0, len = refS.length, ref, level, inheritFromNormalizedLson; i < len; i++ ) {

          ref = refS[ i ];
          if ( typeof ref === 'string' ) { // pathname reference

            level = ( new LSON.Path( ref ) ).resolve( this );
            if ( !level.inherited ) {

              level.$inherit();

            }

            inheritFromNormalizedLson = level.lson;

          } else { // object reference

            inheritFromNormalizedLson = normalize( ref, true );

          }

          LSON.$inherit( inheritFromNormalizedLson, this.lson );

        }
      }
    }
  };

  function AttrValue ( value ) {

    this.value = value;
    this.isConstraint = value instanceof LSON.Take;
    this.stagedCalcValue = undefined;
    this.committedCalcValue = undefined;
    this.transitioningCalcValue = undefined;
    this.isTransitioning = false;
    this.takerLevelS = [];

  }

  LSON.Level.prototype.$initAttributes = function () {


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

        attr2attrValue[ attr ] = new AttrValue( value );
        dirtyAttrS.push( attr );

      }
    }


    for ( key in props ) {

      if ( props.hasOwnProperty( key ) ) {

        value = props[ key ];
        attr = key;

        attr2attrValue[ attr ] = new AttrValue( value );
        dirtyAttrS.push( key );

      }
    }

    for ( key in states ) {

      if ( states.hasOwnProperty( key ) ) {

        value = states[ key ].onlyif;
        attr = "state." + key;

        if ( value !== undefined ) {

          attr2attrValue[ attr ] = new AttrValue( value );
        }
      }
    }


    this.$attr2attrValue = attr2attrValue;
    this.dirtyAttrS = dirtyAttrS;

  };




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
    if ( attrValue !== undefined ) {
      addElementToArray( attrValue[ 3 ], level );
    }

  };



  LSON.Level.prototype.$giveAttrNot = function ( level, attr ) {

    var attrValue = attr2attrValue[ attr ];
    if ( attrValue !== undefined ) {
      removeElementFromArray( attrValue[ 3 ], level );
    }

  };





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


    this.$initAttributes();
    //this.$initWhen();
    //this.$initStates();

    var isMany = this.lson.many !== undefined;
    var lson = isMany ? this.lson.many : this.lson;

    //this.initLsonWhen = lson.when;
    //this.states = lson.states;


    var constraint,val;

    if ( isMany ) {


      // for item in dependencies
      //     if not prepared then prepare
      // prepare


    } else {

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

    }



  };

  LSON.Level.prototype.$cleanifyAttr = function ( attr ) {




  };

  /*
  * Change the value of an attribute.
  * Propagate the change across the LOM (LSON object model)
  * if the change in value produces a change.
  * For constraint (take) based attributes, recalculate the
  * value, for non constraint based use the `value` parameter
  * as the change.
  */
  LSON.Level.prototype.$calculateAttr = function ( attr, value ) {

    if ( this.$curCalculatingAttr === attr ) { // Check for circular reference

      // circular reference

    } else {

      this.$curCalculatingAttr = attr;
      // Check if the calculating attr is a state attr

      var attrValue = attr2attrValue[ attr ];
      var isDirty = false;

      if ( attrValue.isConstraint ) { //is LSON.Take

        var reCalc = attrValue.value.execute( this );
        if ( reCalc !== attrValue.committedCalcValue ) {

          isDirty = true;
          this.$attr2attrValue[ attr ].stagedCalcValue = reCalc;

        }

      } else {

        if ( value !== attrValue.value ) {

          isDirty = true;
          this.$attr2attrValue[ attr ].value = value;
          this.$attr2attrValue[ attr ].stagedCalcValue = value;

        }
      }

      if ( isDirty ) {

        var takerLevelS = attrValue[ attr ];
        if ( takerLevelS !== undefined ) {

          for ( var i = 0, len = takerLevelS.length; i < len; i++ ) {

            takerLevelS[ i ].$actOnDirtyTookAttr( this.path, attr );

          }
        }
      }
    }
  };


  LSON.Level.prototype = function $actOnDirtyTookAttr( tookLevelPath, tookAttr ) {

    var tookAttr2attrS, attrS, attr;
    var tookAttr2attrS = this.$tookLevelPath2_tookAttr2attrS_[ level.path ];
    if ( tookAttr2attrS !== undefined ) {
      attrS = tookAttr2attrS[ tookAttr ];


    }

  };


  LSON.Level.prototype.$deliver = function () {

    //TODO: (i.e render first shot (without initial state changes))

  };



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






})();
