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
