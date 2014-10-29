( function () {
  "use strict";



  var Level = function ( path, lson, clogKey, parent ) {

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

    this.$selfAttr2_takerLevelS_ = new HashArray();
    this.$takenLevelPath2_takenAttr2selfAttr_ = {};


  };



  // unclog
  Level.prototype.unclog = function () {

    this.$inherit();
    this.$prepare();
    this.$deliver();


  };

  Level.prototype.addChildren = function ( name2lson, clogKey ) {

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

  Level.prototype.$inherit = function() {

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






  Level.prototype.$takeLevels = function ( value, selfAttr ) {

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

  Level.prototype.$takeLevelsNot = function ( ) {

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
  Level.prototype.$takeMe = function ( level, attr ) {

    this.selfAttr2_takerLevelS_.add( attr, level );

  };

  Level.prototype.$takeMeNot = function () {

    this.selfAttr2_takerLevelS_.remove( attr, level );

  };


  Level.prototype.$initAttributes = function () {



    var attr2_value00calc00isDirty00isConstraint_, dirtyAttrS, key, data, props, value;

    dirtyAttrS = [];
    attr2_value00calc00isDirty00isConstraint_ = {};

    data = this.lson.data;
    props = this.lson.props;
    states = this.lson.states;


    for ( key in data ) {

      if ( data.hasOwnProperty( key ) ) {

        value = data[ key ];
        key = "data." + key;

        if ( value instanceof LSON.Take ) {

          attr2_value00calc00isDirty00isConstraint_[ key ] = [ value, 0, true, true ];

          dirtyAttrS.push( key );


        } else {

          attr2_value00calc00isDirty00isConstraint_[ key ] = [ value, value, false, false ];

        }
      }
    }


    for ( key in props ) {

      if ( props.hasOwnProperty( key ) ) {

        value = props[ key ];

        if ( value instanceof LSON.Take ) {

          attr2_value00calc00isDirty00isConstraint_[ key ] = [ value, 0, true, true ];
          dirtyAttrS.push( key );
          this.$takeLevel( value );


        } else {

          attr2_value00calc00isDirty00isConstraint_[ key ] = [ value, value, false, false ];

        }
      }
    }

    for ( key in states ) {

      if ( states.hasOwnProperty( key ) ) {

        value = states[ key ].onlyif;
        key = "state." + key;

        if ( value !== undefined ) {

          attr2_value00calc00isDirty00isConstraint_[ key ] = [ value, 0, true, true ];
          dirtyAttrS.push( key );

        }

      }
    }

    this.attr2_value00calc00isDirty00isConstraint_ = attr2_value00calc00isDirty00isConstraint_;
    this.dirtyAttrS = dirtyAttrS;

  };






  Level.prototype.$prepare = function () {


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
      //this.part = new LSON.Part();

    }

  };


  Level.prototype.$deliver = function () {

    //TODO: (i.e render first shot (without initial state changes))

  };


  LSON.Level = Level;


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

          delete this.hashmap[ key ];

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
