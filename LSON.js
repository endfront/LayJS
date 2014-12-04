/*

optgroup {
font-weight: bold;
}

textarea {
overflow: auto;
}


button {
overflow: visible;
}


abbr[title] {
border-bottom: 1px dotted;
}



b,
strong {
font-weight: bold;
}

dfn {
font-style: italic;
}



h1 {
font-size: 2em;
margin: 0.67em 0;
}



mark {
background: #ff0;
color: #000;
}



small {
font-size: 80%;
}



sub,
sup {
font-size: 75%;
line-height: 0;
position: relative;
vertical-align: baseline;
}

sup {
top: -0.5em;
}

sub {
bottom: -0.25em;
}


.lson {

border: none;

position: absolute;

box-sizing: border-box;
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;

transform-style: preserve-3d;
-webkit-transform-style: preserve-3d;

backface-visibility: visible;
-webkit-backface-visibility: visible;


-webkit-appearance: none;
-moz-appearance: none;
appearance: none;



}


*/

(function () {
  "use strict";


  window.LSON = {

    $path2level: {},
    $curClogKey: 1,
    // initiate with the start clog key: 1
    $clogKey2_levelS_: { },
    $dirtyPartS: []
  };

})();

( function () {
  "use strict";



  LSON.Level = function ( path, lson, clogKey, parent ) {

    this.path = path;
    this.lson = lson;
    this.parent = parent;
    this.inherited = false;
    this.prepared = false;
    this.isPart = undefined;

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

(function() {
  "use strict";


  LSON.Many = function () {

    

  };


})();

( function () {
  "use strict";





  var type2htmlTag = {

    "default": "div",
    canvas: "canvas",
    image: "img",
    video: "video",
    svg: "svg"

  };

  var inputWhichIsAnHtmlTagS = [

  "textarea",
  "select"

  ];



  LSON.Part = function ( level ) {

    this.level = level;

    LSON.dirtyPartS.push( this );

  };






















  /*
    Change variable names
  */



  LSON.Part.prototype._fnClean_left =  function() {

    this.node.style.left = this._prop2val.left + "px";

  };


  LSON.Part.prototype._fnClean_top =  function() {

    this.node.style.top = this._prop2val.top + "px";

  };


  LSON.Part.prototype._fnClean_backgroundColor =  function() {

    this.node.style.backgroundColor = this._prop2val.backgroundColor;

  };


})();

(function () {
  "use strict";

  LSON.RelPath = function ( relativePath ) {


    if ( relativePath === "this" ) {

      this.me = true;

    } else {

      this.me = false;
      if ( relativePath[ 0 ] === "/" ) {
        this.absolute = true;
        this.absolutePath = relativePath;
      } else {
        this.absolute = false;
      this.numberOfParentTraversals = relativePath.match(/^(..\/)*/)[0].length / 3;
      // strip off the "../"s
      this.childPath = this.numberOfParentTraversals === 0 ? relativePath : relativePath.substring( this.numberOfParentTraversals * 3 );
    }
  }

};

LSON.RelPath.prototype.resolve = function ( referenceLevel ) {

  if ( this.me ) {

    return referenceLevel;

  } else {

    if ( this.absolute ) {

        return LSON.$path2level[ this.absolutePath ];

    } else {

      for ( var i = 0; i < this.numberOfParentTraversals; ++i && (referenceLevel = referenceLevel.parent ) ) {

      }

      return LSON.$path2level[ referenceLevel.path + this.childPath ];
    }

  }

};



})();

( function () {
  "use strict";


  LSON.Take = function ( relativePath, attr ) {


    var path = new LSON.RelPath( relativePath );
    this._relPath00attr_S = [ [ path, attr ] ];

    this.executable = function () {

      return path.resolve( this );

    };

  };


  LSON.Take.prototype.execute = function ( contextPart ) {

    // pass in context part for relative path lookups
    return this.executable.call( contextPart );

  };



  LSON.Take.prototype.$mergePathAndProps = function ( take ) {

    var _relPath00attr_S = take._relPath00attr_S;
    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      this._relPath00attr_S.push( _relPath00attr_S[ i ] );

    }

  };



  LSON.Take.prototype.add = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) + val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) + val;
      };
    }
    return this;
  };


  LSON.Take.prototype.subtract = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) - val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) - val;
      };
    }
    return this;
  };

  LSON.Take.prototype.divide = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) / val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) / val;
      };
    }
    return this;
  };

  LSON.Take.prototype.multiply = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) * val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) * val;
      };
    }
    return this;
  };

  LSON.Take.prototype.remainder = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) % val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) % val;
      };
    }
    return this;
  };

  LSON.Take.prototype.half = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) / 2;
    };

    return this;
  };

  LSON.Take.prototype.double = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) * 2;
    };

    return this;
  };


  LSON.Take.prototype.contains = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).indexOf( val.execute( this ) ) !== -1;
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).indexOf( val ) !== -1;
      };
    }
    return this;
  };

  LSON.Take.prototype.eq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) === val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) === val;
      };
    }
    return this;
  };

  LSON.Take.prototype.gt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) > val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) > val;
      };
    }
    return this;
  };

  LSON.Take.prototype.gte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) >= val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) >= val;
      };
    }
    return this;
  };

  LSON.Take.prototype.lt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) < val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) < val;
      };
    }
    return this;
  };

  LSON.Take.prototype.lte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) <= val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) <= val;
      };
    }
    return this;
  };

  LSON.Take.prototype.or = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) || val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) || val;
      };
    }
    return this;
  };

  LSON.Take.prototype.and = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) && val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) && val;
      };
    }
    return this;
  };

  LSON.Take.prototype.not = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return !oldExecutable.call( this );
    };

    return this;
  };

  LSON.Take.prototype.positive = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return +oldExecutable.call( this );
    };

    return this;
  };

  LSON.Take.prototype.negative = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return -oldExecutable.call( this );
    };

    return this;
  };


  LSON.Take.prototype.key = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this )[ val.execute( this ) ];
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this )[ val ];
      };
    }
    return this;
  };

  LSON.Take.prototype.index = LSON.Take.prototype.key;



  LSON.Take.prototype.min = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.min( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.min( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LSON.Take.prototype.max = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.max( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.max( oldExecutable.call( this ), val );
      };
    }
    return this;
  };


  LSON.Take.prototype.ceil = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.ceil( oldExecutable.call( this ) );
    };
    return this;
  };

  LSON.Take.prototype.floor = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.floor( oldExecutable.call( this ) );
    };
    return this;
  };


  LSON.Take.prototype.sin = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.sin( oldExecutable.call( this ) );
    };
    return this;
  };


  LSON.Take.prototype.cos = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.cos( oldExecutable.call( this ) );
    };
    return this;
  };


  LSON.Take.prototype.tan = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.tan( oldExecutable.call( this ) );
    };
    return this;
  };


  LSON.Take.prototype.pow = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LSON.Take.prototype.log = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.log( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.log( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LSON.Take.prototype.format = function () {

    var argS = Array.prototype.slice.call( arguments );

    // Add the `format` function
    argS.push(LSON.$format);
    return this.fn.apply( this, argS );

  };




  LSON.Take.prototype.i18nFormat = function () {

    this._relPath00attr_S.push( [ '/', 'data.lang' ] );

    var argS = Array.prototype.slice.call(arguments);

    // Add the `i18nFormat` function
    argS.push(LSON.i18nFormat);
    return this.fn.apply( this, argS );

  };

  function i18nFormat () {

    var argS = Array.prototype.slice.call( arguments );

    argS[ argS.length - 1 ] = ( argS[ argS.length - 1 ] )[ LSON.level( '/' ).attr( 'data.lang' ) ];

    return LSON.$format.apply( undefined, argS );

  }

  LSON.Take.prototype.concat = LSON.Take.prototype.add;


  LSON.Take.prototype.match = function () {

    var oldExecutable = this.executable;
    if ( val instanceof LSON.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).match( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).match( val );
      };
    }
    return this;

  };





  LSON.Take.prototype.fn = function ( ) {

    var oldExecutable = this.executable;


    var fn;

    // optimize for arguments of length 1, and 2, by avoiding a loop
    // TODO: add non-loop optimizations for arguments of lengths 3 and 4, as well.
    if ( arguments.length === 1 ) {

      fn = arguments[ 0 ];

      if ( fn instanceof LSON.Take ) {

        this.$mergePathAndProps( fn );
        this.executable = function () {

          return (fn.execute( this )).call( this, oldExecutable.call( this ) );

        };

      } else {

        this.executable = function () {

          return fn.call( this, oldExecutable.call( this ) );

        };
      }
    }

    else if (arguments.length === 2 ) {

      var arg = arguments[ 0 ];
      fn = arguments[ 1 ];

      if ( fn instanceof LSON.Take ) {

        this.$mergePathAndProps( fn );

        if ( arg instanceof LSON.Take ) {

          this.$mergePathAndProps( arg );

          this.executable = function () {

            return (fn.execute( this )).call( this, oldExecutable.call( this ), arg.execute( this ) );

          };

        } else {

          this.executable = function () {

            return (fn.execute( this )).call( this, oldExecutable.call( this ), arg );

          };

        }

      } else {

        if ( arg instanceof LSON.Take ) {

          this.$mergePathAndProps( arg );

          this.executable = function () {

            return fn.call( this, oldExecutable.call( this ), arg.execute( this ) );

          };

        } else {

          this.executable = function () {

            return fn.call( this, oldExecutable.call( this ), arg );

          };
        }
      }

    } else {

      var argSlength = arguments.length - 1;
      var argS = Array.prototype.slice.call( arguments );

      for ( var i = 0, curArg; i < argSlength; i++ ) {

        curArg = arguments[ i ];

        if ( curArg instanceof LSON.Take ) {

          this.$mergePathAndProps( curArg );

        }
      }

      fn = argS[ argSlength - 1 ];

      if ( fn instanceof LSON.Take ) {

        this.executable = function () {


          // The "+1" allocates space for the first argument which is of the LSON.Take in current context.
          var callableArgS = new Array( argSlength + 1 );
          callableArgS[ 0 ] = oldExecutable.call( this );

          for ( var i = 0, arg; i < argSlength; i++ ) {

            arg = argS[ i ];

            callableArgS[ i ] = arg instanceof LSON.Take ? arg.execute( this ) : arg;

          }

          return ( fn.execute( this ) ).apply( this, callableArgS );

        };

      } else {

        this.executable = function () {

          // The "+1" allocates space for the first argument which is of the LSON.Take in current context.
          var callableArgS = new Array( argSlength + 1 );
          callableArgS[ 0 ] = oldExecutable.call( this );

          for ( var i = 0, arg; i < argSlength; i++ ) {

            arg = argS[ i ];

            callableArgS[ i ] = arg instanceof LSON.Take ? arg.execute( this ) : arg;

          }

          return fn.apply( window, callableArgS );


        };
      }
    }

    return this;

  };

}());

(function () {
  "use strict";

  // Non console API compliant browsers will not throw an error
  
  if ( window.console === undefined ) {

    window.console = { error: function () {}, log: function () {}, info: function () {} };

  }

})();

// LSON has taken the below source from 'tmaeda1981jp'
// source: https://github.com/tmaeda1981jp/string-format-js/blob/master/format.js

(function() {

  "use strict";

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var Formatter = (function() {
      var Constr = function(identifier) {
        var array = function(len){ return new Array(len); };

        switch(true) {
        case /^#\{(\w+)\}*$/.test(identifier):
          this.formatter = function(line, param) {
            return line.replace('#{' + RegExp.$1 + '}', param[RegExp.$1]);
          };
          break;
        case /^([ds])$/.test(identifier):
          this.formatter = function(line, param) {
            if (RegExp.$1 === 'd' && !isNumber(param)) {
              throw new TypeError();
            }
            return line.replace("%" + identifier, param);
          };
          break;

        // Octet
        case /^(o)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace(
              "%" + identifier,
              parseInt(param).toString(8));
          };
          break;

        // Binary
        case /^(b)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace(
              "%" + identifier,
              parseInt(param).toString(2));
          };
          break;

        // Hex
        case /^([xX])$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var hex = parseInt(param).toString(16);
            if (identifier === 'X') { hex = hex.toUpperCase(); }
            return line.replace("%" + identifier, hex);
          };
          break;

        case /^(c)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace("%" + identifier, String.fromCharCode(param));
          };
          break;

        case /^(u)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace("%" + identifier, parseInt(param, 10) >>> 0);
          };
          break;

        case /^(-?)(\d*).?(\d?)(e)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var lpad = RegExp.$1 === '-',
                width = RegExp.$2,
                decimal = RegExp.$3 !== '' ? RegExp.$3: undefined,
                val = param.toExponential(decimal),
                mantissa, exponent, padLength
            ;

            if (width !== '') {
              if (decimal !== undefined) {
                padLength = width - val.length;
                if (padLength >= 0){
                  val = lpad ?
                    val + array(padLength + 1).join(" "):
                    array(padLength + 1).join(" ") + val;
                }
                else {
                  // TODO throw ?
                }
              }
              else {
                mantissa = val.split('e')[0];
                exponent = 'e' + val.split('e')[1];
                padLength = width - (mantissa.length + exponent.length);
                val = padLength >= 0 ?
                  mantissa + (array(padLength + 1)).join("0") + exponent :
                  mantissa.slice(0, padLength) + exponent;
              }
            }
            return line.replace("%" + identifier, val);
          };
          break;

        case /^(-?)(\d*).?(\d?)(f)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var lpad = RegExp.$1 === '-',
                width   = RegExp.$2,
                decimal = RegExp.$3,
                DOT_LENGTH = '.'.length,
                integralPart = param > 0 ? Math.floor(param) : Math.ceil(param),
                val = parseFloat(param).toFixed(decimal !== '' ? decimal : 6),
                numberPartWidth, spaceWidth;

            if (width !== '') {
              if (decimal !== '') {
                numberPartWidth =
                  integralPart.toString().length + DOT_LENGTH + parseInt(decimal, 10);
                spaceWidth = width - numberPartWidth;
                val = lpad ?
                  parseFloat(param).toFixed(decimal) + (array(spaceWidth + 1).join(" ")) :
                  (array(spaceWidth + 1).join(" ")) + parseFloat(param).toFixed(decimal);
              }
              else {
                val = parseFloat(param).toFixed(
                  width - (integralPart.toString().length + DOT_LENGTH));
              }
            }
            return line.replace("%" + identifier, val);
          };
          break;

        // Decimal
        case /^([0\-]?)(\d+)d$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }

            var len = RegExp.$2 - param.toString().length,
                replaceString = '',
                result;
            if (len < 0) { len = 0; }
            switch(RegExp.$1) {
            case "": // rpad
              replaceString = (array(len + 1).join(" ") + param).slice(-RegExp.$2);
              break;
            case "-": // lpad
              replaceString = (param + array(len + 1).join(" ")).slice(-RegExp.$2);
              break;
            case "0": // 0pad
              replaceString = (array(len + 1).join("0") + param).slice(-RegExp.$2);
              break;
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;

        // String
        case /^(-?)(\d)s$/.test(identifier):
          this.formatter = function(line, param) {
            var len = RegExp.$2 - param.toString().length,
                replaceString = '',
                result;
            if (len < 0) { len = 0; }
            switch(RegExp.$1) {
            case "": // rpad
              replaceString = (array(len + 1).join(" ") + param).slice(-RegExp.$2);
              break;
            case "-": // lpad
              replaceString = (param + array(len + 1).join(" ")).slice(-RegExp.$2);
              break;
            default:
              // TODO throw ?
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;

        // String with max length
        case /^(-?\d?)\.(\d)s$/.test(identifier):
          this.formatter = function(line, param) {
            var replaceString = '',
                max, spacelen;

            // %.4s
            if (RegExp.$1 === '') {
              replaceString = param.slice(0, RegExp.$2);
            }
            // %5.4s %-5.4s
            else {
              param = param.slice(0, RegExp.$2);
              max = Math.abs(RegExp.$1);
              spacelen = max - param.toString().length;
              replaceString = RegExp.$1.indexOf('-') !== -1 ?
                (param + array(spacelen + 1).join(" ")).slice(-max): // lpad
                (array(spacelen + 1).join(" ") + param).slice(-max); // rpad
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;
        default:
          this.formatter = function(line, param) {
            return line;
          };
        }
      };

      Constr.prototype = {
        format: function(line, param) {
          return this.formatter.call(this, line, param);
        }
      };
      return Constr;
    }());

    LSON.$format = function() {

      var i,
          result,
          argSLength = arguments.length,
          argS = Array.prototype.slice.call(arguments);

        // result contians the formattable string
        result = argS[ argsLength - 1 ];

        for ( i = 0; i < argSLength - 1; i++ ) {
          if (result.match(/%([.#0-9\-]*[bcdefosuxX])/)) {
            result = new Formatter(RegExp.$1).format(result, argS[ i ] );
          }
        }

      return result;
    };

}());


// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this === null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}


(function () {
  "use strict";


  /*
  * Inherit the lson into `intoLson`.
  */
  LSON._inherit = function ( fromLson, intoLson ) {

    for ( var key in fromLson ) {

      if ( fromLson.hasOwnProperty( key ) ) {

        if ( attr2fnInherit.hasOwnPropoperty( key ) ) {
          attr2fnInherit[ key ]( fromLson, intoLson, isStateInheritance );
        }
      }
    }
  };

  function inheritSingleLevelObject( fromObject, intoObject, key ) {

    var fromKey2value, intoKey2value;
    fromKey2value = fromObject.key;
    intoKey2value = intoObject.key;

    if ( fromKey2value !== undefined ) {

      if ( intoKey2value === undefined ) {

        intoObject.key = intoKey2value;

      } else {

        for ( var fromKey in fromKey2value ) {

          if ( fromKey2value.hasOwnProperty( fromKey ) ) {

            intoKey2value[ fromKey ] =
            intoKey2value[ fromKey ] ||
            fromKey2value[ fromKey ];

          }
        }
      }

    }
  }


  var attr2fnInherit = {


    type: function( fromLson, intoLson ) {

      intoLson.type = intoLson.type || fromLson.type;

    },

    data: function( fromLson, intoLson ) {

      inheritSingleLevelObject( fromLson, intoLson, "data" );

    },

    props: function( fromLson, intoLson ) {

      inheritSingleLevelObject( fromLson, intoLson, "props" );
    },

    many: function( fromLson, intoLson ) {

      var fromManyAttr2val, intoManyAttr2val;
      fromManyAttr2val = fromLson.many;
      intoManyAttr2val = intoLson.many;

      if ( fromManyAttr2val !== undefined ) {

        if ( intoManyAttr2val === undefined ) {

          intoLson.many = fromManyAttr2val;

        } else {

          LSON._inherit( fromManyAttr2val, intoManyAttr2val );

        }
      }
    },

    rows: function( fromLson, intoLson ) {

      intoLson.rows = intoLson.rows || fromLson.rows;

    },





    children: function( fromLson, intoLson ) {
      var fromChildName2lson, intoChildName2lson;
      fromChildName2lson = fromLson.children;
      intoChildName2lson = intoLson.children;

      for ( var name in fromChildName2lson ) {

        if ( fromChildName2lson.hasOwnProperty( name ) ) {

          if ( !intoChildName2lson[ name ] ) { // inexistent child

            intoChildName2lson[ name ] = fromChildName2lson[ name ];

          } else {

            inherit( fromChildName2lson[ name ], intoChildName2lson[ name ] );

          }
        }
      }
    },


    states: function( fromLson, intoLson ) {

      var fromStateName2state, intoStateName2state;
      fromStateName2state = fromLson.states;
      intoStateName2state = intoLson.states;

      var inheritFromState, inheritIntoState;
      for ( var name in fromStateName2state ) {

        if ( fromStateName2state.hasOwnProperty( name ) ) {

          if ( !intoStateName2state[ name ] ) { //inexistent state

            intoStateName2state[ name ] = fromStateName2state[ name ];

          } else {

            inheritFromState = fromStateName2state[ name ];
            inheritIntoState = intoStateName2state[ name ];

            inheritIntoState.onlyif = inheritIntoState.onlify || inheritFromState.onlify;
            inheritIntoState.install = inheritIntoState.install || inheritFromState.install;
            inheritIntoState.uninstall = inheritIntoState.uninstall || inheritFromState.uninstall;


            attr2fnInherit.props( inheritFromState, inheritIntoState );
            attr2fnInherit.when( inheritFromState, inheritIntoState );


          }
        }
      }
    },

    when: function( fromLson, intoLson ) {

      var fromEventName2_fnEventHandlerS_, intoEventName2_fnEventHandlerS_;
      fromEventName2_fnEventHandlerS_ = fromLson.when;
      intoEventName2_fnEventHandlerS_ = intoLson.when;

      if ( fromEventName2_fnEventHandlerS_ !== undefined ) {

        if ( intoEventName2_fnEventHandlerS_ === undefined ) {

          intoLson.when = fromEventName2_fnEventHandlerS_;

        } else {
          var fnFromEventHandlerS, fnIntoEventHandlerS;

          for ( var fromEventName in fromEventName2_fnEventHandlerS_ ) {

            fnFromEventHandlerS = fromEventName2_fnEventHandlerS_[ fromEventName ];
            fnIntoEventHandlerS = intoEventName2_fnEventHandlerS_[ fromEventName ];

            if ( fnIntoEventHandlerS === undefined ) {

              intoEventName2_fnEventHandlerS_[ fromEventName ] = fnIntoEventHandlerS;

            } else {

              fnIntoEventHandlerS = fnFromEventHandlerS.concat( fnIntoEventHandlerS );

            }
          }
        }
      }
    }

  };

})();

(function () {
  "use strict";

  var normalizedExternalLsonS = [  ];


  LSON.$normalize = function( lson, isExternal ) {

    if ( isExternal ) {

      // If we haven't previously normalized it, only then proceed
      if ( normalizedExternalLsonS.indexOf( lson ) === -1 ) {

        _normalize( lson, true );
        normalizedExternalLsonS.push( lson );

      }

    } else {

      _normalize( lson, false );

    }
  };

  function _normalize( lson, isRecursive ) {

    attr2fnNormalize.props( lson, true );
    attr2fnNormalize.states( lson );

    if ( isRecursive ) {

      attr2fnNormalize.children( lson );

    }
  }



  var expanderProp2expandedPropS = {

    borderWidth: [ 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth' ],
    borderColor: [ 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor' ],
    borderStyle: [ 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle' ],
    textPadding: [ 'textTopPadding', 'textRightPadding', 'textBottomPadding', 'textLeftPadding' ],
    cornerRadius: [ 'cornerRadiusTopLeft', 'cornerRadiusTopRight', 'cornerRadiusBottomRight', 'cornerRadiusBottomLeft' ],

  };


  var fnCenterToPos = function( width, center ) {
    return center - ( width / 2 );
  };

  var fnEdgeToPos = function( width, edge ) {
    return center - ( width );
  };

  var fnPosToCenter = function( width, pos ) {
    return pos + ( width / 2 );
  };

  var fnPosToEdge = function( width, pos ) {
    return pos + ( width );
  };


  // Note that we don't have to take width as the take constraint out here as left
  // is a constraint by itself too, but we shall stick to keeping width as the first
  // constraint to maintain consistency with "Note 1".
  var takeLeftToCenterX = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'left' ), fnPosToCenter );
  var takeLeftToRight = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'left' ), fnPosToEdge );
  var takeTopToCenterY = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'top' ), fnPosToCenter );
  var takeTopToBottom = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'top' ), fnPosToEdge );


  var attr2fnNormalize = {

    /*
    * normalize the `lson`
    * `isRoot` signifies whether the props
    * are a direct descedant of the lson and
    * and not a state.
    */
    props: function( lson, isRoot ) {

      var prop2val = lson.props;
      if ( !prop2val ) {

        prop2val = lson.props = {};

      }

      if ( prop2val.centerX ) {

        // ( Note 1 ) The reason we dont 'take' centerX as the taker property is because
        // there exists a possibility that centerX is a non constraint value.
        // On the other hand, width is always a constraint.
        // And the reason we use 'fn' is to optimize the take logic down to one
        // function nest.
        prop2val.left = LSON.take( 'this', 'width' ).fn( prop2val.centerX, fnCenterToPos );

      }

      if ( prop2val.right ) {

        prop2val.left = LSON.take( 'this', 'width' ).fn( prop2val.right, fnEdgeToPos );

      }


      if ( prop2val.centerY ) {

        prop2val.top = LSON.take( 'this', 'width' ).fn( prop2val.centerY, fnCenterToPos );

      }

      if ( prop2val.bottom ) {

        prop2val.top = LSON.take( 'this', 'width' ).fn( prop2val.bottom, fnEdgeToPos );

      }

    if ( isRoot ) {

      prop2val.centerX = takeLeftToCenterX;
      prop2val.right = takeLeftToRight;
      prop2val.centerY = takeTopToCenterY;
      prop2val.bottom = takeTopToBottom;

    }

      var expanderVal, expandedPropS;
      for ( var expanderProp in expanderProp2expandedPropS ) {

        if ( expanderProp2expandedPropS.hasOwnProperty( expanderProp ) ) {

          expanderVal = prop2val[ expanderProp ];
          if ( expanderVal !== undefined ) {

            expandedPropS = expanderProp2expandedPropS[ expanderProp ];
            for ( var i = 0, len = expandedPropS.length, expandedProp; i < len; i++ ) {

              prop2val[ expandedPropS[ i ] ] = expanderVal;

            }
            // When the user invokes a constraint call with a ( string ) reference
            // to the expander property, the value passed will be that of the first
            // expanded property the expander property refers to.
            // eg: borderWidth will refer to borderWidthTop
            prop2val[ expanderProp ] = LSON.take( 'this', expandedPropS[ 0 ] );

          }
        }
      }
    },



    states: function( lson ) {

      var stateName2state = lson.states;
      if ( stateName2state !== undefined ) {

        var state;
        for ( var stateName in stateName2state ) {

          if ( stateName2state.hasOwnProperty( stateName ) ) {

            state = stateName2state[ stateName ];
            attr2fnNormalize.props( state, false );

          }
        }
      }
    },

    children: function( lson ) {

      var childName2childLson = lson.children;
      if ( childName2childLson !== undefined ) {

        for ( var childName in childName2childLson ) {

          if ( childName2childLson.hasOwnProperty( childName ) ) {

            _normalize( childName2childLson[ childName ], true );

          }
        }
      }
    }
  };

}());

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
  "use strict";
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                   window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function() {
  "use strict";

})();

(function() {
  "use strict";




  LSON.run =  function ( rootLson, name2lson ) {



    if ( name2lson ) {

      name2lson = rootLson;
      rootLson = {
        props: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

    } else {

      rootLson.props = rootLson.props || {};

      rootLson.props.width = window.innerWidth;
      rootLson.props.height = window.innerHeight;

    }

    rootLson.children = name2lson;

    window.onresize = updateSize;

    LSON.$clogKey2_levelS_[ 1 ] = [ new LSON.Level( "/", rootLson, 1, undefined ) ];

    LSON.unclog( 1 );

    window.requestAnimationFrame( render );

  };


  function updateSize () {

    //var rootPart = levelPath2Level[ '/' ];
    rootPart.constraint2val.width =  window.innerWidth;
    rootPart.constraint2val.height =  window.innerHeight;

  }



  function render() {


    window.requestAnimationFrame( render );

  }

})();

(function() {
  "use strict";


  LSON.take = function ( relativePath, prop ) {

    return new LSON.Take( relativePath, prop );

  };

})();

(function() {
  "use strict";


  LSON.unclog = function ( clogKey ) {


    var levelS = LSON.$clogKey2_levelS_[ clogKey ];

    if ( levelS !== undefined ) {

      var i;
      len = levelS.length;


      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$inherit();

      }

      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$initAttrs();

      }

      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$initConstraints();

      }

      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$clean();

      }




      LSON.$clogKey2_levelS_[ clogKey ] = null;

    }


  };

})();


/*

Loop levels | clogged
  Loop value in values
    If value is constraint
      Take value's constraints
  If level is type many
    Expand levels




*/
