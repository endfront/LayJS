(function () {
  "use strict";

  var normalizedExternalLsonS = [];


  function checkIsValidStateName( stateName ) {

    return ( ( /^[\w\-]+$/ ).test( stateName ) ) && ( ( [ "root", "transition", "data", "when", "state" ] ).indexOf( stateName ) === -1 );
  }

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

    var rootProp2val, stateProp2val, stateName2state, stateName,
    multipleTypeProp, multipleTypePropNumName;

    attr2fnNormalize.type( lson );
    attr2fnNormalize.inherits( lson );
    attr2fnNormalize.props( lson );
    attr2fnNormalize.transition( lson );
    attr2fnNormalize.when( lson );
    attr2fnNormalize.many( lson );
    attr2fnNormalize.states( lson );


    rootProp2val = lson.props;

    rootProp2val.centerX = takeLeftToCenterX;
    rootProp2val.right = takeLeftToRight;
    rootProp2val.centerY = takeTopToCenterY;
    rootProp2val.bottom = takeTopToBottom;

    // Find the multiple-type prop highest number for
    // each multiple-type prop

    for ( multipleTypeProp in multipleTypeProp2multipleTypePropRegex ) {
      if ( multipleTypeProp2multipleTypePropRegex.hasOwnProperty( multipleTypeProp ) ) {

        rootProp2val[ LSON.$generateMultipleTypePropNumName( multipleTypeProp ) ] =
        findHighestMultipleTypePropNum( multipleTypeProp, rootProp2val );

      }
    }

    stateName2state = lson.states;
    for ( stateName in stateName2state ) {
      if ( stateName2state.hasOwnProperty( stateName ) ) {
        stateProp2val = stateName2state[ stateName ].props;
        for ( multipleTypeProp in multipleTypeProp2multipleTypePropRegex ) {
          if ( multipleTypeProp2multipleTypePropRegex.hasOwnProperty( multipleTypeProp ) ) {

            multipleTypePropNumName = LSON.$generateMultipleTypePropNumName( multipleTypeProp );
            rootProp2val[ multipleTypePropNumName ] =
            Math.max( rootProp2val[ multipleTypePropNumName ],
              findHighestMultipleTypePropNum( multipleTypeProp, stateProp2val ) );

            }
          }
        }
      }

      // Recurse to normalize children

      if ( isRecursive ) {

        attr2fnNormalize.children( lson );

      }
    }




    function checkAndThrowErrorAttrAsTake ( name, val ) {
      if ( val instanceof LSON.Take ) {
        throw ( "LSON Error: takes for special/expander props such as '" + name  + "' are not permitted." );
      }
    }


    var expanderProp2_expandedPropS_ = {

      borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth" ],
      borderColor: [ "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor" ],
      borderStyle: [ "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle" ],
      textPadding: [ "textTopPadding", "textRightPadding", "textBottomPadding", "textLeftPadding" ],
      cornerRadius: [ "cornerRadiusTopLeft", "cornerRadiusTopRight", "cornerRadiusBottomRight", "cornerRadiusBottomLeft" ],

    };

    var multipleTypeProp2multipleTypePropRegex = {

      filters: /^filters(\d+)/,
      boxShadows: /^boxShadows(\d+)/,
      textShadows: /^textShadows(\d+)/,
      audioTracks: /^audioTracks(\d+)/,
      videoTracks: /^videoTracks(\d+)/,
      audioSources: /^audioSources(\d+)/,
      videoSources: /^videoSources(\d+)/

    };

    /*
    * Recursively flatten if `prop` is object or array valued
    */
    function flattenProp( lson, prop ) {

      var props, value, type, flattenedProp;
      props = lson.props;
      value = props[ prop ];
      type = LSON.type( value );


      if ( type === "Array" ) {

        for ( var i = 0, len = value.length; i < length; i++ ) {
          flattenedProp = prop + i;
          props[ flattenedProp ] = value[ i ];
          flattenProp( lson,  flattenedProp );
        }
        props[ prop ] = undefined;

      } else if ( type === "Object" && !( value instanceof LSON.Color ) ) {


        if ( LSON.$checkIsExpanderAttr( prop ) ) {
          checkAndThrowErrorAttrAsTake( prop, lson[ prop ] );
        }

        for ( var key in value ) {

          if ( value.hasOwnProperty( key ) ) {

            flattenedProp = prop + LSON.$capitalize( key );
            props[ flattenedProp ] = value[ key ];
            flattenProp( lson, flattenedProp );

          }
          props[ prop ] = undefined;
        }

      }
    }

    /*
    Given a dictionary of `props`, find the highest prop number mentioend
    of the multiple-typed-prop `multipleTypeProp`
    */
    function findHighestMultipleTypePropNum( multipleTypeProp, prop2val ) {

      var prop, multipleTypePropRegex, multipleTypePropRegexMatch, highest;
      highest = 0;
      multipleTypePropRegex = multipleTypeProp2multipleTypePropRegex[ multipleTypeProp ];
      for ( prop in prop2val ) {
        if ( prop2val.hasOwnProperty( prop ) ) {
          multipleTypePropRegexMatch = prop.match( multipleTypePropRegex );
          if ( multipleTypePropRegexMatch !== null ) {
            highest = Math.max( highest, parseInt( multipleTypePropRegexMatch[ 1 ] ) );
          }
        }
      }
      return highest;
    }


    var allTypeProp2defaultValue = {
      width: new LSON.Take( 'this', '$naturalWidth' ),
      height: new LSON.Take( 'this', '$naturalHeight' ),
      top: 0,
      left: 0,
      z: 0,
      originX:0.5,
      originY:0.5,
      originZ: 0,
      shiftX: 0,
      shiftY: 0,
      rotateX:0,
      rotateY:0,
      rotateZ:0,
      scaleX:0,
      scaleY:0,
      scaleZ:0,
      skewX:0,
      skewY:0,
    };




    var fnCenterToPos = function( center, width ) {
      return center - ( width / 2 );
    };

    var fnEdgeToPos = function( edge, width ) {
      return center - ( width );
    };

    var fnPosToCenter = function( pos, width ) {
      return pos + ( width / 2 );
    };

    var fnPosToEdge = function( pos, width ) {
      return pos + ( width );
    };


    var takeLeft = new LSON.Take( "this", "left" );
    var takeWidth = new LSON.Take( "this", "width" );
    var takeTop = new LSON.Take( "this", "top" );
    var takeHeight = new LSON.Take( "this", "height" );


    var takeLeftToCenterX = new LSON.Take( fnPosToCenter ).fn( takeLeft, takeWidth );
    var takeLeftToRight = new LSON.Take( fnPosToEdge ).fn( takeLeft, takeWidth );
    var takeTopToCenterY = new LSON.Take( fnPosToCenter ).fn( takeTop, takeHeight );
    var takeTopToBottom = new LSON.Take( fnPosToEdge ).fn( takeTop, takeHeight );





    var attr2fnNormalize = {
      type: function ( lson ) {

        checkAndThrowErrorAttrAsTake( "type", lson.type );

        if ( lson.type === undefined ) {
          // check if text type
          var isTextType = false;
          if ( lson.props.text !== undefined ) {
            isTextType = true;
          } else {
            var stateName, stateName2state;
            stateName2state = lson.states;
            for ( stateName in stateName2state ) {
              if ( stateName2state.hasOwnProperty( stateName ) ) {
                if ( stateName2state[ stateName ].props.text !== undefined ) {
                  isTextType = true;
                  break;
                }
              }
            }
          }
          lson.type = isTextType ? "text" : "none";
        }
        var type = lson.type;
        if ( LSON.$startsWith(type, "input") ) {
          lson.type = "input";
          lson.inputType = type.slice("input:".length);
        }

      },

      inherits: function ( lson ) {

        checkAndThrowErrorAttrAsTake( "inherits", lson.inherits );


      },


      /*
      * normalize the `lson`
      */
      props: function( lson ) {

        var prop2val = lson.props;

        checkAndThrowErrorAttrAsTake( "props", lson.props );


        if ( prop2val === undefined ) {

          lson.props = {};
          prop2val = lson.props;

        }

        if ( prop2val.centerX ) {

          prop2val.left = ( new LSON.Take( fnCenterToPos ) ).fn( prop2val.centerX, takeWidth );

        }

        if ( prop2val.right ) {

          prop2val.left = ( new LSON.Take( fnEdgeToPos ) ).fn( prop2val.right, takeWidth );

        }

        if ( prop2val.centerY ) {

          prop2val.top = ( new LSON.Take( fnCenterToPos ) ).fn( prop2val.centerY, takeHeight );


        }

        if ( prop2val.bottom ) {

          prop2val.top = ( new LSON.Take( fnEdgeToPos ) ).fn( prop2val.bottom, takeHeight );

        }


        var prop, val;
        for ( prop in prop2val ) {
          if ( prop2val.hasOwnProperty( prop ) ) {

            flattenProp( lson, prop );
          }
        }


        var expanderProp, expanderVal, expandedPropS, expandedProp;
        for ( expanderProp in expanderProp2expandedPropS ) {

          if ( expanderProp2expandedPropS.hasOwnProperty( expanderProp ) ) {

            expanderVal = prop2val[ expanderProp ];
            if ( expanderVal !== undefined ) {

              expandedPropS = expanderProp2expandedPropS[ expanderProp ];
              for ( var i = 0, len = expandedPropS.length; i < len; i++ ) {

                expandedProp = expandedPropS[ i ];
                // Only change if the property does not exist as yet
                // to prevent overwriting of "specefic" prop-keys
                if ( prop2val[ expandedProp ] === undefined ) {

                  prop2val[ expandedProp ] = expanderVal;

                }
              }
            }
          }
        }



        /* Filling in the defaults here */
        var allTypeProp, typeProp2defaultValue, typeProp;

        for ( allTypeProp in allTypeProp2defaultValue ) {
          if ( ( allTypeProp2defaultValue.hasOwnProperty( allTypeProp ) ) && ( prop2val[ allTypeProp ] === undefined ) ) {
            prop2val[ allTypeProp ] = allTypeProp2defaultValue[ allTypeProp ];
          }
        }
        /*
        typeProp2defaultValue = type2_typeProp2defaultValue_[ lson.type ];
        if ( typeProp2defaultValue !== undefined ) {
        for ( typeProp in typeProp2defaultValue ) {
        if ( ( typeProp2defaultValue.hasOwnProperty( typeProp ) ) && ( prop2val[ typeProp ] === undefined ) ) {
        prop2val[ typeProp ] = typeProp2defaultValue[ typeProp ];
      }
    }
  }*/

},

when: function ( lson ) {

  checkAndThrowErrorAttrAsTake( "when", lson.when );


  var eventType2_fnCallbackS_, eventType, fnCallbackS;

  for ( eventType in eventType2_fnCallbackS_ ) {
    if ( eventType2_fnCallbackS_.hasOwnProperty( eventType ) ) {
      checkAndThrowErrorAttrAsTake( "when." + eventType,
       eventType2_fnCallbackS_[ eventType ] );

    }
  }
},
/*
data: function ( lson ) {
// normalize color here

var key2value = lson.data;

for ( var key in key2value ) {

if ( key2value.hasOwnProperty( key ) ) {

if ()

}
}


},
*/

transition: function( lson ) {
  var attr2transitionDirective, attr, transitionDirective;
  attr2transitionDirective = lson.transition;
  if ( attr2transitionDirective !== undefined ) {
    checkAndThrowErrorAttrAsTake( "transition", lson.transition );

    for ( attr in attr2transitionDirective ) {
      if ( attr2transitionDirective.hasOwnProperty( attr ) ) {

        checkAndThrowErrorAttrAsTake( "transition." + attr,
         attr2transitionDirective[ attr ] );

      }
    }
  }
},

many: function ( lson ) {

  var many = lson.many;
  if ( many !== undefined ) {
    checkAndThrowErrorAttrAsTake( "many", many );

    attr2fnNormalize.inherits( many );
    attr2fnNormalize.props( many );
    attr2fnNormalize.transition( many );
    //attr2fnNormalize.when( many );
    attr2fnNormalize.states( many );



  }



},

states: function( lson ) {

  var stateName2state = lson.states, state;
  if ( stateName2state !== undefined ) {
    if ( stateName2state instanceof LSON.Take ) {
      return errorAttrAsTake( "states" );
    }
    for ( var stateName in stateName2state ) {

      if ( stateName2state.hasOwnProperty( stateName ) ) {

        if ( !checkIsValidStateName( stateName ) ) {
          throw ( "LSON Error: Invalid state name: " + stateName );
        }

        state = stateName2state[ stateName ];

        if ( stateName2state instanceof LSON.Take ) {
          return errorAttrAsTake( "states" );
        }
        attr2fnNormalize.props( state );
        attr2fnNormalize.when( state );
        attr2fnNormalize.transition( state );

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
