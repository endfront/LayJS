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



  var Part = function ( path, lson ) {

    this.type = lson.type || '';

    this.node = type === 'interface' ? undefined : path === '/' ? document.body : document.createElement( type2tag[ this.type ] );


    this.initProp2val = lson.props;

    LSON.dirtyPartS.push( this );

  };






















  /*
    Change variable names
  */



  Part.prototype._fnClean_left =  function() {

    this.node.style.left = this._prop2val.left + "px";

  };


  Part.prototype._fnClean_top =  function() {

    this.node.style.top = this._prop2val.top + "px";

  };


  Part.prototype._fnClean_backgroundColor =  function() {

    this.node.style.backgroundColor = this._prop2val.backgroundColor;

  };

  LSON.Part = Part;

})();

(function () {
  "use strict";

  var RelPath = function ( relativePath ) {


    if ( relativePath === "this" ) {

      this.me = true;

    } else {

      this.me = false;
    this.numberOfParentTraversals = relativePath.match(/^(..\/)*/)[0].length / 3;
    // strip off the "../"s
    this.childPath = this.numberOfParentTraversals === 0 ? relativePath : relativePath.substring( this.numberOfParentTraversals * 3 );
  }

};

RelPath.prototype.resolve = function ( referenceLevel ) {

  if ( this.me ) {

    return referenceLevel;

  } else {

    for ( var i = 0; i < this.numberOfParentTraversals; ++i && (referenceLevel = referenceLevel.parent ) ) {

    }

    return LSON.$path2level[ referenceLevel.path + this.childPath ];

  }

};


LSON.RelPath = RelPath;

})();

( function () {
  "use strict";


  var Take = function ( relativePath, attr ) {


    var path = new LSON.RelPath( relativePath );
    this._relPath00attr_S = [ [ path, attr ] ];

    this.executable = function () {

      return path.resolve( this );

    };

  };


  Take.prototype.execute = function ( contextPart ) {

    // pass in context part for relative path lookups
    return this.executable.call( contextPart );

  };



  Take.prototype.$mergePathAndProps = function ( take ) {

    var _relPath00attr_S = take._relPath00attr_S;
    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

      this._relPath00attr_S.push( _relPath00attr_S[ i ] );

    }

  };


  function cloneAndPrependArray( array, element ) {

    var new_array = new Array( array.length + 1 );

    new_array[ 0 ] = element;

    for ( var i = 0, len = array.length ; i < len; i++ ) {

      new_array[ i + 1 ] = array[ i ];

    }
    return new_array;

  }

  Take.prototype.add = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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


  Take.prototype.subtract = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.divide = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.multiply = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.remainder = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.half = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) / 2;
    };

    return this;
  };

  Take.prototype.double = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) * 2;
    };

    return this;
  };


  Take.prototype.contains = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.eq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.gt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.gte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.lt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.lte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.or = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.and = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.not = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return !oldExecutable.call( this );
    };

    return this;
  };

  Take.prototype.positive = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return +oldExecutable.call( this );
    };

    return this;
  };

  Take.prototype.negative = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return -oldExecutable.call( this );
    };

    return this;
  };


  Take.prototype.key = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
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

  Take.prototype.index = Take.prototype.key;



  Take.prototype.min = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.min( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.min( oldExecutable.call( this ) );
      };
    }
    return this;
  };

  Take.prototype.max = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.max( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.max( oldExecutable.call( this ) );
      };
    }
    return this;
  };


  Take.prototype.ceil = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.ceil( oldExecutable.call( this ) );
    };
    return this;
  };

  Take.prototype.floor = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.floor( oldExecutable.call( this ) );
    };
    return this;
  };


  Take.prototype.sin = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.sin( oldExecutable.call( this ) );
    };
    return this;
  };


  Take.prototype.cos = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.cos( oldExecutable.call( this ) );
    };
    return this;
  };


  Take.prototype.tan = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.tan( oldExecutable.call( this ) );
    };
    return this;
  };


  Take.prototype.pow = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ) );
      };
    }
    return this;
  };

  Take.prototype.log = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return Math.log( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.log( oldExecutable.call( this ) );
      };
    }
    return this;
  };

  Take.prototype.format = function () {

    var argS = new Array( arguments.length + 1 );

    for ( var i = 0, len = arguments.length; i < len; i++ ) {

      argS[ i ] = arguments[ i ];

    }

    argS[ i + 1 ] = format;

    return this.fn( argS );

  };

  Take.prototype.concat = Take.prototype.add;


  Take.prototype.matches = function () {

    //TODO

  };

  function i18nFormat ( lang, lang2format ) {

    // TODO

  }

  function format () {

    // TODO

  }


  Take.prototype.fn = function ( ) {

    var oldExecutable = this.executable;

    var argS = arguments[ 0 ];
    var fn = arguments[ 1 ];


    if ( arguments.length === 2 ) {


      if ( argS instanceof Take ) {

        this.$mergePathAndProps( argS );

      }

      this.executable = function () {

        return fn( oldExecutable.call( this ) );

      };


    } else {

      for ( var i = 0, len = arguments.length, cur; i < len; i++ ) {

        cur = arguments[ i ];

        if ( i !== len - 1 ) {

          if ( cur instanceof Take ) {

            this.$mergePathAndProps( cur );

          }

          argS.push( cur );

        } else {

          fn = cur;

        }
      }

      this.executable = function () {

        return fn.apply( window, cloneAndPrependArray( argS, oldExecutable.call( this ) ) );

      };

    }

    return this;

  };


  LSON.Take = Take;

}());

(function () {
  "use strict";

  // Non console API compliant browsers will not throw an error
  
  if ( window.console === undefined ) {

    window.console = { error: function () {}, log: function () {}, info: function () {} };

  }

})();


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


  LSON._inherit = function ( fromLson, intoLson ) {

    for ( var key in fromLson ) {

      if ( fromLson.hasOwnProperty( key ) ) {

        attr2fnInherit[ key ]( fromLson, intoLson );

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

  var fromEventName2fnEventHandlerS, intoEventName2fnEventHandlerS;
  fromEventName2fnEventHandlerS = fromLson.when;
  intoEventName2fnEventHandlerS = intoLson.when;

  if ( fromEventName2fnEventHandlerS !== undefined ) {

    if ( intoEventName2fnEventHandlerS === undefined ) {

      intoLson.when = fromEventName2fnEventHandlerS;

    } else {
      var fnFromEventHandlerS, fnIntoEventHandlerS;

      for ( var fromEventName in fromEventName2fnEventHandlerS ) {

        fnFromEventHandlerS = fromEventName2fnEventHandlerS[ fromEventName ];
        fnIntoEventHandlerS = intoEventName2fnEventHandlerS[ fromEventName ];

        if ( fnIntoEventHandlerS === undefined ) {

          intoEventName2fnEventHandlerS[ fromEventName ] = fnIntoEventHandlerS;

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

    attr2fnNormalize.props( lson );
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
    scale: [ 'scaleX', 'scaleY' ],
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

    props: function( lson ) {

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
      prop2val.centerX = takeLeftToCenterX;

      if ( prop2val.right ) {

        prop2val.left = LSON.take( 'this', 'width' ).fn( prop2val.right, fnEdgeToPos );

      }
      prop2val.right = takeLeftToRight;


      if ( prop2val.centerY ) {

        prop2val.top = LSON.take( 'this', 'width' ).fn( prop2val.centerY, fnCenterToPos );

      }
      prop2val.centerY = takeTopToCenterY;

      if ( prop2val.bottom ) {

        prop2val.top = LSON.take( 'this', 'width' ).fn( prop2val.bottom, fnEdgeToPos );

      }
      prop2val.bottom = takeTopToBottom;


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
            attr2fnNormalize.props( state );

          }
        }
      }
    },

    children: function( lson ) {

      var childName2childLson = lson.children;
      if ( childName2childLson !== undefined ) {

        for ( var childName in childName2childLson ) {

          if ( childName2childLson.hasOwnProperty( childName ) ) {

            normalize( childName2childLson[ childName ], true );

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

      for ( var i = 0, len = levelS.length; i < len; i++ ) {

        levelS[ i ].unclog();

      }

      delete LSON.$clogKey2_levelS_[ clogKey ];

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
