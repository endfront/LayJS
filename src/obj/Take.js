( function () {
  "use strict";

  LAID.Take = function ( relativePath, attr ) {

    var _relPath00attr_S;

    if ( attr !== undefined ) {
      var path = new LAID.RelPath( relativePath );
      _relPath00attr_S = [ [ path, attr ] ];

      this.executable = function () {

        return path.resolve( this ).$getAttrVal( attr ).calcVal;

      };
    } else { // direct value provided
      _relPath00attr_S = [];
      // note that 'relativePath' is misleading name
      // here in this second overloaded case
      var directValue = relativePath;

      if ( directValue instanceof LAID.Take ) {
          this.$mergePathAndProps( directValue );
      }
      this.executable = function () {
        return directValue;
      };
    }

    this._relPath00attr_S = _relPath00attr_S;

  };


  LAID.Take.prototype.execute = function ( contextPart ) {

    // pass in context part for relative path lookups
    return this.executable.call( contextPart );

  };


  LAID.Take.prototype.$mergePathAndProps = function ( take ) {

    var _relPath00attr_S = take._relPath00attr_S;
    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {
      this._relPath00attr_S.push( _relPath00attr_S[ i ] );

    }

  };



  LAID.Take.prototype.add = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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



  LAID.Take.prototype.subtract = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.divide = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.multiply = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.remainder = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.half = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) / 2;
    };

    return this;
  };

  LAID.Take.prototype.double = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) * 2;
    };

    return this;
  };


  LAID.Take.prototype.contains = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.identical = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return LAID.identical( oldExecutable.call( this ),
          val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return LAID.identical( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LAID.Take.prototype.eq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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



  LAID.Take.prototype.neq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ) !== val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) !== val;
      };
    }
    return this;
  };

  LAID.Take.prototype.gt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.gte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.lt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.lte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.or = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.and = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.not = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return !oldExecutable.call( this );
    };

    return this;
  };


  LAID.Take.prototype.negative = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return -oldExecutable.call( this );
    };

    return this;
  };



  LAID.Take.prototype.key = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.index = LAID.Take.prototype.key;




  LAID.Take.prototype.min = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.max = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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


  LAID.Take.prototype.ceil = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.ceil( oldExecutable.call( this ) );
    };
    return this;
  };

  LAID.Take.prototype.floor = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.floor( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.sin = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.sin( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.cos = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.cos( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.tan = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.tan( oldExecutable.call( this ) );
    };
    return this;
  };

  LAID.Take.prototype.abs = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.abs( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.pow = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.log = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.log( oldExecutable.call( this ) );
    };
    return this;
  };


  LAID.Take.prototype.match = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
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

  LAID.Take.prototype.test = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).test( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).test( val );
      };
    }
    return this;

  };

  LAID.Take.prototype.concat = LAID.Take.prototype.add;


  LAID.Take.prototype.format = function () {

    var argS = Array.prototype.slice.call( arguments ),
      takeFormat = new LAID.Take( LAID.$format );

    argS.unshift( this );

    return takeFormat.fn.apply( takeFormat, argS );

    // Add the `format` function
    //argS.push(LAID.$format);
    //return this.fn.apply( this, argS );

  };




  LAID.Take.prototype.i18nFormat = function () {

    this._relPath00attr_S.push( [ new LAID.RelPath( '/' ), 'data.lang' ] );

    var argS = Array.prototype.slice.call(arguments),
      takeFormat = new LAID.Take( fnWrapperI18nFormat );

    argS.unshift( this );

    return takeFormat.fn.apply( takeFormat, argS);

    // Add the `i18nFormat` function
    //argS.push(i18nFormat);
    //return this.fn.apply( this, argS );

  };

  function fnWrapperI18nFormat () {

    var argS = Array.prototype.slice.call( arguments );
    argS[ 0 ] = ( argS[ 0 ] )[ LAID.level( '/' ).attr( 'data.lang' ) ];

    if ( argS[ 0 ] === undefined ) {
      throw "LAID Error: No language defined for i18nFormat";
    }

    return LAID.$format.apply( undefined, argS );

  }






  LAID.Take.prototype.colorEquals = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).equals( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).equals( val );
      };
    }
    return this;

  };


  LAID.Take.prototype.colorLighten = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().lighten( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().lighten( val );
      };
    }
    return this;

  };


  LAID.Take.prototype.colorDarken = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().darken( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().darken( val );
      };
    }
    return this;

  };


  LAID.Take.prototype.colorStringify = function ( ) {

    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).copy().stringify( );
    };

    return this;

  };

  LAID.Take.prototype.colorInvert = function ( ) {

    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).copy().invert();
    };

    return this;

  };

  LAID.Take.prototype.colorSaturate = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturate( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturate( val );
      };
    }
    return this;

  };

  LAID.Take.prototype.colorDesaturate = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().desaturate( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().desaturate( val );
      };
    }
    return this;

  };


  LAID.Take.prototype.colorAlpha = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().alpha( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().alpha( val );
      };
    }
    return this;

  };

  LAID.Take.prototype.colorRed = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val );
      };
    }
    return this;
  };


  LAID.Take.prototype.colorGreen = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorBlue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorHue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorSaturation = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.colorLightness = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val );
      };
    }
    return this;
  };

  LAID.Take.prototype.queryLength = LAID.Take.prototype.length;

  LAID.Take.prototype.queryFetch = function ( index, attr ) {

    var oldExecutable = this.executable;

    if ( index instanceof LAID.Take ) {
      this.$mergePathAndProps( index );

      if ( attr instanceof LAID.Take ) {
        this.$mergePathAndProps( attr );
        this.executable = function () {
          return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index.execute( this ),
            attr.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index.execute( this ),
            attr
          );
        }
      }
    } else if ( attr instanceof LAID.Take ) {
      this.$mergePathAndProps( attr );
      this.executable = function () {
        return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index,
            attr.execute( this )
          );
      }

    } else {
      this.executable = function () {
        return LAID.$queryUtils.fetch(
            oldExecutable.call( this ),
            index,
            attr
          );
      }
    }

    return this;

  };

  LAID.Take.prototype.filterEq = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAID.Take ) {
      this.$mergePathAndProps( attr );

      if ( val instanceof LAID.Take ) {
        this.$mergePathAndProps( val );
        this.executable = function () {
          return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAID.Take ) {
      this.$mergePathAndProps( val );
      this.executable = function () {
        return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }

    } else {
      this.executable = function () {
        console.log(LAID.level("/Option").$attr2attrVal);

        return LAID.$filterUtils.eq(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }

    return this;

  };

  /*
  * Call custom function with arguments, where arguments
  * can be LAID.Take objects.
  */
  LAID.Take.prototype.fn = function ( ) {

    var fnExecutable = this.executable;
    //console.log(fnExecutable.call(this));
    //console.log(fnExecutable, arguments, arguments.length);
    if ( arguments.length === 0 ) {

      this.executable = function () {
        return fnExecutable.call( this ).call( this );
      };

    } else if ( arguments.length === 1 ) {

      var arg = arguments[ 0 ];

      if ( arg instanceof LAID.Take ) {

        this.$mergePathAndProps( arg );
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg.execute( this ) );
        };
      } else {
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg );
        };
      }

    } else if ( arguments.length === 2 ) {

      var arg1 = arguments[ 0 ];
      var arg2 = arguments[ 1 ];

      if ( arg1 instanceof LAID.Take ) {

        this.$mergePathAndProps( arg1 );

        if ( arg2 instanceof LAID.Take ) {

          this.$mergePathAndProps( arg2 );

          this.executable = function () {
            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2.execute( this ) );
          };

        } else {
          this.executable = function () {

            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2 );
          };
        }

      } else if ( arg2 instanceof LAID.Take ) {

        this.$mergePathAndProps( arg2 );
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg1, arg2.execute( this ) );
        };


      } else {

        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg1, arg2 );
        };
      }
    } else {

      var argSlength = arguments.length;
      var argS = Array.prototype.slice.call( arguments );

      for ( var i = 0, curArg; i < argSlength; i++ ) {

        curArg = arguments[ i ];

        if ( curArg instanceof LAID.Take ) {

          this.$mergePathAndProps( curArg );

        }
      }

      this.executable = function () {

        var executedArgS = new Array( argSlength );

        for ( var i = 0, arg; i < argSlength; i++ ) {

          arg = argS[ i ];

          executedArgS[ i ] = arg instanceof LAID.Take ? arg.execute( this ) : arg;

        }

        return fnExecutable.call( this ).apply( this, executedArgS );

      };
    }

    return this;

    /*

    var fn;
    var oldExecutable = this.executable;

    if ( arguments.length === 1 ) {

    fn = arguments[ 0 ];

    if ( fn instanceof LAID.Take ) {

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

if ( fn instanceof LAID.Take ) {

this.$mergePathAndProps( fn );

if ( arg instanceof LAID.Take ) {

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

if ( arg instanceof LAID.Take ) {

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

if ( curArg instanceof LAID.Take ) {

this.$mergePathAndProps( curArg );

}
}

fn = argS[ argSlength - 1 ];

if ( fn instanceof LAID.Take ) {

this.executable = function () {


// The "+1" allocates space for the first argument which is of the LAID.Take in current context.
var callableArgS = new Array( argSlength + 1 );
callableArgS[ 0 ] = oldExecutable.call( this );

for ( var i = 0, arg; i < argSlength; i++ ) {

arg = argS[ i ];

callableArgS[ i ] = arg instanceof LAID.Take ? arg.execute( this ) : arg;

}

return ( fn.execute( this ) ).apply( this, callableArgS );

};

} else {

this.executable = function () {

// The "+1" allocates space for the first argument which is of the LAID.Take in current context.
var callableArgS = new Array( argSlength + 1 );
callableArgS[ 0 ] = oldExecutable.call( this );

for ( var i = 0, arg; i < argSlength; i++ ) {

arg = argS[ i ];

callableArgS[ i ] = arg instanceof LAID.Take ? arg.execute( this ) : arg;

}

return fn.apply( window, callableArgS );


};
}
}

return this;
*/

};

}());
