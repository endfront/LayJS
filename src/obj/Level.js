( function () {
  "use strict";



  LSON.Level = function ( path, lson, clogKey, parent ) {

    this.path = path;
    this.lson = lson;
    LSON.$normalize( lson, false );
    this.parent = parent;
    this.inherited = false;
    this.prepared = false;
    this.isPart = true;

    if ( lson.children ) {

      this.addChildren( lson.children, clogKey );

    }

    this.$takenLevelPath2_takenAttr2selfAttr_ = {};


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
        path2level[ childPath ] = childLevel;
        LSON.$clogKey2_levelS_[ clogKey ].push( childLevel );

      }
    }

  };

  LSON.Level.prototype.$inherit = function() {

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
  };



  LSON.Level.prototype.$initAttributes = function () {



    var attr2_value00calc00isConstraint00takerLevelS_, dirtyAttrS, key, data, props, value, isConstraint;

    dirtyAttrS = [];
    attr2_value00calc00isConstraint00takerLevelS_ = {};

    data = this.lson.data;
    props = this.lson.props;
    states = this.lson.states;

    // Check for defaults

    if ( !props.opacity ) {

    }


    for ( key in data ) {

      if ( data.hasOwnProperty( key ) ) {


        value = data[ key ];
        key = "data." + key;
        isConstraint = value instanceof LSON.Take;


        attr2_value00calc00isConstraint00takerLevelS_[ key ] = [ value, 0, isConstraint, [] ];
        dirtyAttrS.push( key );

      }
    }


    for ( key in props ) {

      if ( props.hasOwnProperty( key ) ) {

        value = props[ key ];
        isConstraint = value instanceof LSON.Take;

        attr2_value00calc00isConstraint00takerLevelS_[ key ] = [ value, 0, isConstraint, [] ];
        dirtyAttrS.push( key );

      }
    }

    for ( key in states ) {

      if ( states.hasOwnProperty( key ) ) {

        value = states[ key ].onlyif;
        key = "state." + key;

        if ( value !== undefined ) {

          isConstraint = value instanceof LSON.Take;
          attr2_value00calc00isConstraint00takerLevelS_[ key ] = [ value, 0, isConstraint, [] ];
          dirtyAttrS.push( key );

        }
      }
    }


    this.$attr2_value00calc00isConstraint00takerLevelS_ = attr2_value00calc00isConstraint00takerLevelS_;
    this.dirtyAttrS = dirtyAttrS;

  };




  LSON.Level.prototype.$takeLevels = function ( value, selfAttr ) {

    var _relPath00attr_S, relPath, attr, level, levelPath, takenAttr2selfAttr;
    _relPath00attr_S = value._relPath00attr_S;

    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      relPath = _relPath00attr_S[ i ][ 0 ];
      attr = _relPath00attr_S[ i ][ 1 ];

      level = relPath.resolve( this );
      if ( level === undefined ) {

        console.error("LSON ERROR: Undefined level relative path: " + relPath.childPath );

      } else {

        level.$takeMe( this, selfAttr );
        levelPath = level.path;

        takenAttr2selfAttr = this.$takenLevelPath2_takenAttr2selfAttr_[ levelPath ];
        if ( takenAttr2selfAttr === undefined ) {

          this.$takenLevelPath2_takenAttr2selfAttr_[ levelPath ] = new HashArray();
          takenAttr2selfAttr = this.$takenLevelPath2_takenAttr2selfAttr_;

        }

        takenAttr2selfAttr.add( attr, selfAttr );

      }
    }
  };

  LSON.Level.prototype.$takeLevelsNot = function ( ) {

    var _relPath00attr_S, relPath, attr, level, levelPath, takenAttr2selfAttr;
    _relPath00attr_S = value._relPath00attr_S;

    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      relPath = _relPath00attr_S[ i ][ 0 ];
      attr = _relPath00attr_S[ i ][ 1 ];

      level = relPath.resolve( this );
      if ( level === undefined ) {

        console.error("LSON ERROR: Undefined level relative path: " + relPath.childPath );

      } else {

        level.$takeMeNot( this, selfAttr );
        levelPath = level.path;

        takenAttr2selfAttr = this.$takenLevelPath2_takenAttr2selfAttr_[ levelPath ];
        if ( takenAttr2selfAttr !== undefined ) {

          takenAttr2selfAttr.remove( attr, selfAttr );
          // even if the level path reference in the $takenLevelPath2_takenAttr2selfAttr_ hashmap points to an empty HashArray
          // a deference will not be performed for:
          // (1) The initial reference was created by the level's state or data change. It is very possible in the case
          // of the latter (state change) that the change will revert, therefore reinitialization will have to be performed.
          // (2) Unlike arrays, checking for an empty hashmap is lesser efficient in terms of performance.
        }
      }
    }

  };
  LSON.Level.prototype.$takeMe = function ( level, attr ) {

    this.selfAttr2_takerLevelS_.add( attr, level );

  };

  LSON.Level.prototype.$takeMeNot = function () {

    this.selfAttr2_takerLevelS_.remove( attr, level );

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
      //var attr2_value00calc00isConstraint00takerLevelS_ =  this.$attr2_value00calc00isConstraint00takerLevelS_;

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

    var value00calc00isConstraint00takerLevelS = attr2_value00calc00isConstraint00takerLevelS_[ attr ];
    var isDirty = false;

    if ( value00calc00isConstraint00takerLevelS[ 3 ]) { //is LSON.Take

      var reCalc = value00calc00isConstraint00takerLevelS[ 0 ].execute( this );
      if ( reCalc !== value00calc00isConstraint00takerLevelS[ 1 ] {

        isDirty = true;
        this.$attr2_value00calc00isConstraint00takerLevelS_[ attr ][ 1 ] = ;

      }

    } else {

      if ( value !== value00calc00isConstraint00takerLevelS[ 0 ] ) {

        isDirty = true;
        this.$attr2_value00calc00isConstraint00takerLevelS_[ attr ][ 0 ] = value;
        this.$attr2_value00calc00isConstraint00takerLevelS_[ attr ][ 1 ] = value;

      }
    }

    if ( isDirty ) {

      var takerLevelS = this.$selfAttr2_takerLevelS_[ attr ];
      if ( takerLevelS !== undefined ) {

        for ( var i = 0, len = takerLevelS.length; i < len; i++ ) {

          takerLevelS[ i ].$actOnDirtyOtherAttr( this, attr );

        }
      }
    }


  };



  LSON.Level.prototype.$deliver = function () {

    //TODO: (i.e render first shot (without initial state changes))

  };



  /*
  * Data structure of a HashMap mapping to array of strings.
  * If mapping exists to a single element array, mapping is directed to
  * string, to reduce overhead of storing an array data structure.
  */
  function HashArray() {

    this.hashmap = {};

  }


  HashArray.prototype.add = function ( key, element ) {

    var element3elementS = this.hashmap[ key ];

    if ( element3elementS === undefined ) {

      this.hashmap[ key ] = element;

    } else if ( ! element3elementS instanceof Array ) {

      if ( element3elementS !== element ) {

        this.hashmap[ key ] = [ element3elementS, element ];

      }

    } else if ( element3elementS.indexOf( element ) !== -1  ) {

      element3elementS.push( element );

    }
  };


  HashArray.prototype.remove = function ( key, element ) {

    var element3elementS = this.hashmap[ key ];
    if ( element3elementS !== undefined ) {

      if ( ! element3elementS instanceof Array ) {

        if ( element3elementS === element ) {

          this.hashmap[ key ] = null;

        }

      } else {
        var ind = element3elementS.indexOf( attr );
        if ( ind !== -1 ) {

          element3elementS.splice( ind, 1 );
          if ( element3elementS.length === 1 ) {

            this.hashmap[ key ] = element3elementS[ 0 ];

          }
        }
      }
    }

  };






})();
