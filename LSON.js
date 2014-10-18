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
    _cur_clog_key: 1,
    // initiate with the start clog key: 1
    _clog_key2levelS: { },
    _dirtyPartS: []
  };

})();

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

(function() {
  "use strict";


  LSON.Many = function () {

    

  };


})();

( function () {
  "use strict";

  var type2tag = {

    text: 'div',
    image: 'img',
    video: 'video',
    canvas: 'canvas',
    input: 'input',
    textarea: 'textarea'

  };



  var prop2default = {



  };

  var dirty_css_propertyS = [

  "width",
  "height",
  "left",
  "top",
  "backgroundColor"

  ];





  var Part = function ( path, lson ) {

    this.type = prop2val.type || 'text';

    this.node = type === 'interface' ? undefined : path === '/' ? document.body : document.createElement( type2tag[ this.type ] );

    //this.dirty_css_propertyS = LSON._clone.singleLevelArray( dirty_css_propertyS );

    this.init_prop2val = lson.props;

    LSON.dirtyPartS.push( this );

  };




  Part.prototype.takeMe = function ( takerPart, prop ) {

    var takerPartS = this.prop2takerPartS[ prop ];
    if ( takerPartS === undefined ) {

      this.prop2takerPartS[ prop ] = [ takerPart ];

    } else if ( takerPartS.indexOf( prop ) !== -1 ) {

      takerPartS.push( prop );

    }

  };


  Part.prototype.takeMeNot = function ( takerPart, prop ) {

    var takerPartS = this.prop2takerPartS[ prop ];
    if ( takerPartS !== undefined ) {

      var ind = takerPartS.indexOf( prop );
      if ( ind !== -1 ) {

        if ( takerPartS.length === 1 ) {

          delete this.prop2takerPartS[ prop ];

        } else {

          takerPartS.splice( ind, 1 );

        }
      }
    }

  };





  Part.prototype.initProperties = function ( prop2val ) {


    this.prop2val = {};
    this.initiated = false;

    for ( var prop in prop2default ) {

      if ( prop2default.hasOwnProperty( prop ) ) {

        this.prop2val[ prop ] = prop2val[ prop ] !== undefined ? prop2val[ prop ] : prop2default[ prop ];

      }

    }

    var prop2data = prop2val.data ? prop2val.data : {};

    for ( prop in prop2data ) {

      if ( prop2data.hasOwnProperty( prop ) ) {

        this.prop2data[ "data." + prop ] = prop2data[ prop ];

      }

    }


  };














  /*
  * Normally functions are to be named camelcase,
  * however for cleaning properties, we shall use the following convention:
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

  var Path = function ( relative_path ) {



    if ( relative_path === "this" ) {

      this.child_path = "";

    } else {


    this.number_of_parent_traversals =  relative_path.match(/^(..\/)*/)[0].length / 3;
    // strip off the "../"s
    this.child_path = this.number_of_parent_traversals === 0 ? relative_path : relative_path.substring( this.number_of_parent_traversals * 3 );


  }



  };

  Path.prototype.resolve = function ( referenceLevel ) {

    for ( var i = 0; i < this.number_of_parent_traversals; ++i && (referenceLevel = referenceLevel.parent ) ) {

    }

    return LSON._path2level[ referenceLevel.path + this.child_path ];


  };


  LSON.Path = Path;

})();

(function() {
  "use strict";




  var Take = function ( relative_path, prop ) {

    //  this.level_and_prop =? arg;

    var path = new LSON.Path( relative_path );
    this.level_and_constraintS = [ [ relative_path, prop ] ];

    this.executable = function () {

      return path.resolve( this );

    };

  };


  Take.prototype.execute = function ( contextPart ) {

    // pass in context part for relative path lookups
    return this.executable.call( contextPart );

  };



  Take.prototype._mergeLevel_and_constraintS = function ( take ) {

    var level_and_constraintS = take.level_and_constraintS;
    for ( var i = 0, len = level_and_constraintS.length; i < len; i++ ) {

      this.level_and_constraintS.push( level_and_constraintS[ i ] );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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
      this._mergeLevel_and_constraintS( val );

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

        this._mergeLevel_and_constraintS( argS );

      }

      this.executable = function () {

        return fn( oldExecutable.call( this ) );

      };


    } else {

      for ( var i = 0, len = arguments.length, cur; i < len; i++ ) {

        cur = arguments[ i ];

        if ( i !== len - 1 ) {

          if ( cur instanceof Take ) {

            this._mergeLevel_and_constraintS( cur );

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


  LSON._inherit = function ( fromLson, intoLson ) {

    for ( var key in fromLson ) {

      if ( fromLson.hasOwnProperty( key ) ) {

        attr2fnInherit[ key ]( fromLson, intoLson );

      }
    }
  };

  function inheritSingleLevelObject( fromObject, intoObject, key ) {

    var from_key2value, into_key2value;
    from_key2value = fromObject.key;
    into_key2value = intoObject.key;

    if ( from_key2value !== undefined ) {

      if ( into_key2value === undefined ) {

        intoObject.key = into_key2value;

      } else {

        for ( var from_key in from_key2value ) {

          if ( from_key2value.hasOwnProperty( from_key ) ) {

            into_key2value[ from_key ] =
            into_key2value[ from_key ] ||
            from_key2value[ from_key ];

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

      var from_many_attr2val, into_many_attr2val;
      from_many_attr2val = fromLson.many;
      into_many_attr2val = intoLson.many;

      if ( from_many_attr2val !== undefined ) {

        if ( into_many_attr2val === undefined ) {

          intoLson.many = from_many_attr2val;

        } else {

          LSON._inherit( from_many_attr2val, into_many_attr2val );

        }
      }
    },

    rows: function( fromLson, intoLson ) {

      intoLson.rows = intoLson.rows || fromLson.rows;

    },

    /*formation: function( from_many_attr2val, into_many_attr2val ) {

    var from_formation_attr2val, into_formation_attr2val;
    from_formation_attr2val = from_many_attr2val.formation;
    into_formation_attr2val = into_many_attr2va.formation;

    if ( from_formation_attr2val !== undefined ) {

    if ( into_formation_attr2val === undefined ) {

    into_many_attr2val.formation = from_formation_attr2val;

  } else {

  into_formation_attr2val.type = into_formation_attr2val.type || from_formation_attr2val.type;
  into_formation_attr2val.sort = into_formation_attr2val.sort || from_formation_attr2val.sort;
  into_formation_attr2val.order = into_formation_attr2val.order || from_formation_attr2val.order;

  inheritSingleLevelObject( from_formation_attr2val, into_formation_attr2val, "args" );

}
}
},*/



children: function( fromLson, intoLson ) {
  var from_child_name2lson, into_child_name2lson;
  from_child_name2lson = fromLson.children;
  into_child_name2lson = intoLson.children;

  for ( var name in from_child_name2lson ) {

    if ( from_child_name2lson.hasOwnProperty( name ) ) {

      if ( !into_child_name2lson[ name ] ) { // inexistent child

        into_child_name2lson[ name ] = from_child_name2lson[ name ];

      } else {

        inherit( from_child_name2lson[ name ], into_child_name2lson[ name ] );

      }
    }
  }
},


states: function( fromLson, intoLson ) {

  var from_state_name2state, into_state_name2state;
  from_state_name2state = fromLson.states;
  into_state_name2state = intoLson.states;

  var inheritFromState, inheritIntoState;
  for ( var name in from_state_name2state ) {

    if ( from_state_name2state.hasOwnProperty( name ) ) {

      if ( !into_state_name2state[ name ] ) { //inexistent state

        into_state_name2state[ name ] = from_state_name2state[ name ];

      } else {

        inheritFromState = from_state_name2state[ name ];
        inheritIntoState = into_state_name2state[ name ];

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

  var from_event_name2fnEventHandlerS, into_event_name2fnEventHandlerS;
  from_event_name2fnEventHandlerS = fromLson.when;
  into_event_name2fnEventHandlerS = intoLson.when;

  if ( from_event_name2fnEventHandlerS !== undefined ) {

    if ( into_event_name2fnEventHandlerS === undefined ) {

      intoLson.when = from_event_name2fnEventHandlerS;

    } else {
      var fnFromEventHandlerS, fnIntoEventHandlerS;

      for ( var from_event_name in from_event_name2fnEventHandlerS ) {

        fnFromEventHandlerS = from_event_name2fnEventHandlerS[ from_event_name ];
        fnIntoEventHandlerS = into_event_name2fnEventHandlerS[ from_event_name ];

        if ( fnIntoEventHandlerS === undefined ) {

          into_event_name2fnEventHandlerS[ from_event_name ] = fnIntoEventHandlerS;

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


  LSON._normalize = function( lson, is_external ) {

    if ( is_external ) {

      // If we haven't previously normalized it, only then proceed
      if ( normalizedExternalLsonS.indexOf( lson ) === -1 ) {

        _normalize( lson, true );
        normalizedExternalLsonS.push( lson );

      }

    } else {

      _normalize( lson, false );

    }
  };

  function _normalize( lson, is_recursive ) {

    attr2fnNormalize.props( lson );
    attr2fnNormalize.states( lson );

    if ( is_recursive ) {

      attr2fnNormalize.children( lson );

    }
  }



  var expander_prop2expanded_propS = {

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


      var expander_val, expanded_propS;
      for ( var expander_prop in expander_prop2expanded_propS ) {

        if ( expander_prop2expanded_propS.hasOwnProperty( expander_prop ) ) {

          expander_val = prop2val[ expander_prop ];
          if ( expander_val !== undefined ) {

            expanded_propS = expander_prop2expanded_propS[ expander_prop ];
            for ( var i = 0, len = expanded_propS.length, expanded_prop; i < len; i++ ) {

              prop2val[ expanded_propS[ i ] ] = expander_val;

            }
            // When the user invokes a constraint call with a ( string ) reference
            // to the expander property, the value passed will be that of the first
            // expanded property the expander property refers to.
            // eg: borderWidth will refer to borderWidthTop
            prop2val[ expander_prop ] = LSON.take( 'this', expanded_propS[ 0 ] );

          }
        }
      }
    },



    states: function( lson ) {

      var state_name2state = lson.states;
      if ( state_name2state !== undefined ) {

        var state;
        for ( var state_name in state_name2state ) {

          if ( state_name2state.hasOwnProperty( state_name ) ) {

            state = state_name2state[ state_name ];
            attr2fnNormalize.props( state );

          }
        }
      }
    },

    children: function( lson ) {

      var child_name2childLson = lson.children;
      if ( child_name2childLson !== undefined ) {

        for ( var child_name in child_name2childLson ) {

          if ( child_name2childLson.hasOwnProperty( child_name ) ) {

            normalize( child_name2childLson[ child_name ], true );

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

    LSON._clog_key2levelS[ 1 ] = [ new LSON.Level( "/", rootLson, 1, undefined ) ];

    LSON.unclog( 1 );

    window.requestAnimationFrame( render );

  };


  function updateSize () {

    var rootPart = path2Level[ '/' ];
    rootPart.constraint2val.width =  window.innerWidth;
    rootPart.constraint2val.height =  window.innerHeight;
    //LSON._dirtyPartS.push(  );

  }



  function render() {

    //console.log( LSON._dirtyPartS.length );

    window.requestAnimationFrame( render );

  }

})();

(function() {
  "use strict";


  LSON.take = function ( relative_path, prop ) {

    return new LSON.Take( relative_path, prop );

  };

})();

(function() {
  "use strict";


  LSON.unclog = function ( clog_key ) {


    var levelS = LSON._clog_key2levelS[ clog_key ];

    if ( levelS !== undefined ) {

      for ( var i = 0, len = levelS.length; i < len; i++ ) {

        levelS[ i ].unclog();

      }

      delete LSON._clog_key2levelS[ clog_key ];

    }


  };

})();
