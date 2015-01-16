(function () {
  "use strict";

  var normalizedExternalLsonS = [];

  /*
  * Rules of a state name:
  * (1) Must only contain alphanumeric characters, the underscore ("_"), or the hyphen ("-")
  * (2) Must contain atleast one character
  * (3) Must not be any of the following: {"root", "transition", "data", "when", "state"}
  */
  function checkIsValidStateName( stateName ) {

    return ( ( /^[\w\-]+$/ ).test( stateName ) ) && ( ( [ "root", "transition", "data", "when", "state" ] ).indexOf( stateName ) === -1 );
  }

  LAID.$normalize = function( lson, isExternal ) {

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

    key2fnNormalize.type( lson );
    key2fnNormalize.inherits( lson );
    key2fnNormalize.props( lson );
    key2fnNormalize.transition( lson );
    key2fnNormalize.when( lson );
    key2fnNormalize.many( lson );
    key2fnNormalize.states( lson );


    rootProp2val = lson.props;

    rootProp2val.centerX = takeLeftToCenterX;
    rootProp2val.right = takeLeftToRight;
    rootProp2val.centerY = takeTopToCenterY;
    rootProp2val.bottom = takeTopToBottom;


    // Recurse to normalize children
    if ( isRecursive ) {

      key2fnNormalize.children( lson );

    }
  }




  function checkAndThrowErrorAttrAsTake ( name, val ) {
    if ( val instanceof LAID.Take ) {
      throw ( "LAID Error: takes for special/expander props such as '" + name  + "' are not permitted." );
    }
  }




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
  * Recursively flatten the prop if object or array typed
  */
  function flattenProp( lson, obj, key, prefix ) {

    var val, type;
    val = obj[ key ];
    type = LAID.type( val );

    if ( type === "Array" ) {

      for ( var i = 0, len = val.length; i < length; i++ ) {
        flattenedAttr = prefix + i;
        flattenProp( lson,  val[ i ], flattenedAttr );
      }
      obj[ key ] = undefined;

    } else if ( type === "Object" && !( val instanceof LAID.Color ) && !( val instanceof LAID.Take ) ) {

      for ( var subKey in val ) {

        flattenedProp = prop + LAID.$capitalize( subKey );
        flattenProp( lson,  val[ subKey ], flattenedAttr );

        obj[ key ] = undefined;
      }

    } else {

      if ( LAID.$checkIsExpanderAttr( prefix ) ) {
        checkAndThrowErrorAttrAsTake( prefix, val );
      }

      lson[ prefix ] = val;

    }
  }

  /*
  Given a dictionary of `props`, find the highest prop number mentioend
  of the multiple-typed-prop `multipleTypeProp`
  */
  function findMaxMultipleTypePropNum( multipleTypeProp, prop2val ) {

    var prop, multipleTypePropRegex, multipleTypePropRegexMatch, max;
    max = 0;
    multipleTypePropRegex = multipleTypeProp2multipleTypePropRegex[ multipleTypeProp ];
    for ( prop in prop2val ) {
      multipleTypePropRegexMatch = prop.match( multipleTypePropRegex );
      if ( multipleTypePropRegexMatch !== null ) {
        max = Math.max( max, parseInt( multipleTypePropRegexMatch[ 1 ] ) );
      }
    }
    return max;
  }


  var allTypeProp2defaultValue = {
    width: new LAID.Take( "this", "$naturalWidth" ),
    height: new LAID.Take( "this", "$naturalHeight" ),
    top: 0,
    left: 0
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


  var takeLeft = new LAID.Take( "this", "left" );
  var takeWidth = new LAID.Take( "this", "width" );
  var takeTop = new LAID.Take( "this", "top" );
  var takeHeight = new LAID.Take( "this", "height" );


  var takeLeftToCenterX = new LAID.Take( fnPosToCenter ).fn( takeLeft, takeWidth );
  var takeLeftToRight = new LAID.Take( fnPosToEdge ).fn( takeLeft, takeWidth );
  var takeTopToCenterY = new LAID.Take( fnPosToCenter ).fn( takeTop, takeHeight );
  var takeTopToBottom = new LAID.Take( fnPosToEdge ).fn( takeTop, takeHeight );





  var key2fnNormalize = {
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
          if ( stateName2state !== undefined ) {
            for ( stateName in stateName2state ) {
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
      if ( type.startsWith( "input" ) ) {
        lson.type = "input";
        lson.inputType = type.slice("input:".length);
      }

    },

    inherits: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "inherits", lson.inherits );

    },

    interface: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "interface", lson.interface );

    },

    /*
    * normalize the `lson`
    */
    props: function( lson ) {

      if ( lson.props === undefined ) {

        lson.props = {};

      }

      var prop2val = lson.props,
      prop, val,
      longhandPropS, longhandProp, shorthandVal,
      i, len;

      checkAndThrowErrorAttrAsTake( "props", lson.props );


      if ( prop2val.centerX ) {

        prop2val.left = ( new LAID.Take( fnCenterToPos ) ).fn( prop2val.centerX, takeWidth );

      }

      if ( prop2val.right ) {

        prop2val.left = ( new LAID.Take( fnEdgeToPos ) ).fn( prop2val.right, takeWidth );

      }

      if ( prop2val.centerY ) {

        prop2val.top = ( new LAID.Take( fnCenterToPos ) ).fn( prop2val.centerY, takeHeight );


      }

      if ( prop2val.bottom ) {

        prop2val.top = ( new LAID.Take( fnEdgeToPos ) ).fn( prop2val.bottom, takeHeight );

      }

      for ( prop in prop2val ) {
        flattenProp( lson, prop2val, prop, prop, true );
      }

      for ( prop in prop2val ) {
        longhandPropS = LAID.$shorthandPropsUtils.getLonghandPropsDecenteralized( prop );
        if ( longhandPropS !== undefined ) {
          shorthandVal = prop2val[ prop ];
          for ( i = 0, len = longhandPropS.length; i < len; i++ ) {
            longhandProp = longhandPropS[ i ];
            prop2val[ longhandProp ] = prop2val[ longhandProp ] ||
            shorthandVal;

          }
        }
      }




      /* Filling in the defaults here */
      var allTypeProp, typeProp2defaultValue, typeProp;

      for ( allTypeProp in allTypeProp2defaultValue ) {
        if ( prop2val[ allTypeProp ] === undefined ) {
          prop2val[ allTypeProp ] = allTypeProp2defaultValue[ allTypeProp ];
        }
      }

      var multipleTypeProp, maxMultipleTypePropNum;
      for ( multipleTypeProp in multipleTypeProp2multipleTypePropRegex ) {
        maxMultipleTypePropNum = findMaxMultipleTypePropNum( multipleTypeProp, prop2val );
        if ( maxMultipleTypePropNum !== 0 ) {
          LAID.$meta.set( lson, "max", multipleTypeProp, maxMultipleTypePropNum );
        }
      }
      /*
      typeProp2defaultValue = type2_typeProp2defaultValue_[ lson.type ];
      if ( typeProp2defaultValue !== undefined ) {
      for ( typeProp in typeProp2defaultValue ) {
      if ( ( prop2val[ typeProp ] === undefined ) ) {
      prop2val[ typeProp ] = typeProp2defaultValue[ typeProp ];
    }
  }
}*/

},

when: function ( lson ) {

  // TODO: fix this unicorn
  if ( lson.when !== undefined ) {

    checkAndThrowErrorAttrAsTake( "when", lson.when );

    var eventType2_fnCallbackS_, eventType, fnCallbackS, i, len;

    for ( eventType in eventType2_fnCallbackS_ ) {
      fnCallbackS = eventType2_fnCallbackS_[ eventType ];
      checkAndThrowErrorAttrAsTake( "when." + eventType,
      fnCallbackS );
      LAID.$meta.set( lson, "$$num", "when." + eventType, fnCallbackS.length );

    }
  }
},
/*
data: function ( lson ) {
// normalize color here

var key2value = lson.data;

for ( var key in key2value ) {


if ()

}


},
*/

transition: function( lson ) {

  if ( lson.transition !== undefined ) {


    var transitionProp, transitionDirective,
    transitionArgKey2val, transitionArgKey, transitionArgKeyS,
    transition = lson.transition,
    defaulterProp, defaultedPropS, defaultedProp, i, len;

    if ( transition !== undefined ) {
      checkAndThrowErrortransitionPropAsTake( "transition", lson.transition );

      if ( transition.centerX !== undefined ) {
        transition.left =
        transition.centerX;
      }
      if ( transition.right !== undefined ) {
        transition.left =
        transition.right;
      }
      if ( transition.centerY !== undefined ) {
        transition.top =
        transition.centerY;
      }
      if ( transition.bottom !== undefined ) {
        transition.top =
        transition.bottom;
      }







        for ( transitionProp in transition ) {
          if ( LAID.$checkIsExpanderAttr( transitionProp ) ) {
            throw ( "LAID Error: transitions for special/expander props such as '" + name  + "' are not permitted." );
          }
          transitionDirective = transition[ transitionProp ];
          checkAndThrowErrortransitionPropAsTake( "transition." + transitionProp,
          transitionDirective  );

          transitionArgKey2val = transitionDirective.args;
          if ( transitionArgKey2val !== undefined ) {

            checkAndThrowErrortransitionPropAsTake( "transition." + transitionProp + ".args",
            transitionArgKey2val  );

            transitionArgKeyS = [];
            for ( transitionArgKey in transitionArgKey2val ) {
              transitionArgKeyS.push( transitionArgKey );
            }
            LAID.$meta.set( lson, "keys", "transition." + transitionProp, transitionArgKeyS );
          }
        }
      }
    }
  },

  many: function ( lson ) {

    if ( lson.many !== undefined ) {
      var many = lson.many;
      checkAndThrowErrorAttrAsTake( "many", many );

      key2fnNormalize.inherits( many );
      key2fnNormalize.props( many );
      key2fnNormalize.transition( many );
      //key2fnNormalize.when( many );
      key2fnNormalize.states( many );

      //TODO: rows


    }



  },

  states: function( lson ) {

    if ( lson.states !== undefined ) {


      var stateName2state = lson.states, state;
      checkAndThrowErrorAttrAsTake( "states",  stateName2state );

      for ( var stateName in stateName2state ) {

        if ( !checkIsValidStateName( stateName ) ) {
          throw ( "LAID Error: Invalid state name: " + stateName );
        }

        state = stateName2state[ stateName ];

        checkAndThrowErrorAttrAsTake( "states." + stateName, state );

        key2fnNormalize.props( state );
        key2fnNormalize.when( state );
        key2fnNormalize.transition( state );

      }
    }
  },


  children: function( lson ) {

    if ( lson.children !== undefined ) {


      var childName2childLson = lson.children;

      for ( var childName in childName2childLson ) {

        _normalize( childName2childLson[ childName ], true );

      }
    }
  }
};

}());
