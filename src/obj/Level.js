(function() {
  "use strict";






  var Level = function( path, lson, clog_key, parent ) {

    this.path = path;
    this.lson = lson;
    LSON._normalize( lson, false );
    this.parent = parent;
    this.inherited = false;
    this.prepared = false;
    this.is_part = true;

    if ( lson.children ) {

      this.addChildren( lson.children, clog_key );

    }

  };


  Level.prototype.addChildren = function( name2lson, clog_key ) {

    if ( clog_key === undefined ) {

      clog_key = ++LSON._cur_clog_key;
      clog_key2levelS[ clog_key ] = [];

    }

    var child_path, childLevel;
    for ( var name in name2lson ) {

      if ( name2lson.hasOwnProperty( name ) ) {

        child_path = this.path + '/' + name;
        childLevel = new LSON.Level( child_path, name2lson[ name ], clog_key, this );
        path2level[ child_path ] = childLevel;
        clog_key2levelS[ clog_key ].push( childLevel );

      }
    }

  };

  // unclog
  Level.prototype.unclog = function() {

    this._inherit();
    this._prepare();

  };

  Level.prototype._inherit = function() {

    if ( !this.lson.inherit ) {

      this.inherited = true;

    } else {

      var refS = this.lson.inherit;
      for ( var i = 0, len = refS.length, ref, level, inheritFromNormalizedLson; i < len; i++ ) {

        ref = refS[ i ];
        if ( typeof ref === 'string' ) { // pathname reference

          level = ( new LSON.Path( ref ) ).resolve( this );
          if ( !level.inherited ) {

            level._inherit(  );

          }

          inheritFromNormalizedLson = level.lson;

        } else { // object reference

          inheritFromNormalizedLson = normalize( ref, true );

        }

        LSON._inherit( inheritFromNormalizedLson, this.lson );

      }
    }
  };

  Level.prototype._initializeConstraints = function () {

    var constraint2val = {};
    var data = this.data;
    var props = this.initProps;
    var key;

    for ( key in data ) {

      if ( data.hasOwnProperty( key ) ) {

        constraint2val[ "data." + key ] = data[ key ];

      }
    }

    for ( key in props ) {

      if ( props.hasOwnProperty( key ) ) {

        constraint2val[ key ] = props[ key ];

      }
    }

    this.constraint2val = constraint2val;



  };


  Level.prototype._prepare = function () {

    var is_many = this.lson.many !== undefined;

    var lson = is_many ? this.lson.many : this.lson;

    this.data = lson.data;
    this.initLsonProps = lson.props;
    this.initLsonWhen = lson.when;
    this.states = lson.states;

    this._initializeConstraints();

    var constraint,val;
    for ( constraint in this.constraint2val ) {

      if ( this.constraint2val.hasOwnProperty( constraint ) ) {



      }

    }

    if ( is_many ) {

      // this.many = new LSON.Many( this.path, this.lson );

      // for item in dependencies
      //     if not prepared then prepare
      // prepare
      //this.part._dependencies();


    } else {

      this.is_part = true;
      this.part = new LSON.Part();

    }

  };


  Level.prototype._takeMe = function ( takerLevel, prop ) {

    var takerLevelS = this._constraint2takerLevelS[ prop ];
    if ( takerLevelS === undefined ) {

      this._constraint2takerLevelS[ prop ] = [ takerLevel ];

    } else if ( takerLevelS.indexOf( prop ) !== -1 ) {

      takerLevelS.push( prop );

    }

  };


  Level.prototype._takeMeNot = function ( takerLevel, prop ) {

    var takerLevelS = this._constraint2takerLevelS[ prop ];
    if ( takerLevelS !== undefined ) {

      var ind = takerLevelS.indexOf( prop );
      if ( ind !== -1 ) {

        if ( takerLevelS.length === 1 ) {

          delete this._constraint2takerLevelS[ prop ];

        } else {

          takerLevelS.splice( ind, 1 );

        }
      }
    }

  };

  Level.prototype._takeLevel = function (l)

  LSON.Level = Level;

})();
