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

    lson.when = lson.when || {};
    lson.transition = lson.when || {};

    key2fnNormalize.inherits( lson );
    key2fnNormalize.many( lson );
    key2fnNormalize.states( lson ); // inherit states first to ensure
    // that every state projected attribute which is not present
    // within the root (lson) state is initialized
    key2fnNormalize.props( lson, undefined );
    key2fnNormalize.transition( lson, undefined );
    key2fnNormalize.when( lson, undefined );
    key2fnNormalize.type( lson );

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
      obj[ key ] = [];

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




  var essentialProp2defaultValue = {
    width:  new LAID.Take( "$naturalWidth" ),
    height:  new LAID.Take( "$naturalHeight" ),
    top: 0,
    left: 0
  };

  // These match the psuedo defaults for non expander props
  var lazyProp2defaultValue = {
    display: true,
    originX: 0.5,
    originY: 0.5,
    originZ: 0.5,
    perspective:0,
    perspectiveOriginX: 0.5,
    perspectiveOriginY: 0.5,
    backfaceVisibility: false,
    opacity:1.0,
    overflowX: "hidden",
    overflowY: "hidden",
    scrollX: 0,
    scrollY: 0,
    scrollElastic: true,
    cursor: "auto",
    backgroundColor: LAID.transparent(),
    backgroundImage: "none",
    backgroundAttachmented: "scroll",
    backgroundRepeat: false,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: undefined,
    backgroundSizeY: undefined,

    boxShadows: [],

    cornerRadiusTopLeft: 0,
    cornerRadiusTopRight: 0,
    cornerRadiusBottomLeft: 0,
    cornerRadiusBottomRight: 0,

    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",

    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,


    borderTopColor: LAID.transparent(),
    borderBottomColor: LAID.transparent(),
    borderRightColor: LAID.transparent(),
    borderLeftColor: LAID.transparent(),

    text: "",
    textSize: 13,
    textFamily: "sans-serif",
    textWeight: "normal",
    textcolor: LAID.color("black"),
    textShadows: [],
    textVariant: "normal",
    textStyle: "normal",
    textDecoration: "none",
    textAlign: "start",
    textLetterSpacing: undefined,
    textWordSpacing: undefined,
    textOverflow: "clip",
    textIndent: 0,
    textWhitespace: "normal",

    textPaddingTop: 0,
    textPaddingRight: 0,
    textPaddingBottom: 0,
    textPaddingLeft: 0,

    input: "",
    inputLabel: "",
    inputRows: 2,
    inputPlaceholder: "",
    inputAutocomplete: false,
    inputAutocorrect: true,
    inputDisabled: false,

    videoSources: [],
    videoTracks: [],
    videoAutoplay: false,
    videoControls: true,
    videoCrossorigin: "anonymous",
    videoLoop: false,
    videoMuted: false,
    videoPreload: "auto",
    videoPoster: null,

    audioSources: [],
    audioTracks: [],
    audioControls: true,
    audioLoop: false,
    audioMuted: false,
    audioPreload: "auto",
    audioVolume: 0.7

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
        }
        lson.type = isTextType ? "text" : "none";
      }
      var type = lson.type;
      if ( ( type === "text" ) && ( lson.children !== undefined ) ) {
        throw( "LAID Error: Text type Level with child Levels found" );
      }
      if ( type.startsWith( "input" ) ) {
        lson.type = "input";
        lson.inputType = type.slice( ( "input:" ).length );
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
    props: function( lson, rootLson ) {

      if ( lson.props === undefined ) {

        lson.props = {};

      }

      var prop2val = lson.props,
      prop, val,
      longhandPropS, longhandProp, shorthandVal,
      multipleTypePropMatchDetails,curMultipleMax, lazyProp,
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
      var essentialProp;

      for ( essentialProp in essentialProp2defaultValue ) {
        if ( prop2val[ essentialProp ] === undefined ) {
          prop2val[ essentialProp ] = essentialProp2defaultValue[ essentialProp ];
        }
      }



      for ( prop in prop2val ) {
        multipleTypePropMatchDetails = LAID.$multipleTypePropUtils.findMultipleTypePropMatchDetails( prop );
        if ( multipleTypePropMatchDetails !== null ) {

          lazyProp = multipleTypePropMatchDetails[ 1 ];
          curMultipleMax = LAID.$meta.get( lson, "max", multipleTypePropMatchDetails[ 1 ] );
          if ( ( curMultipleMax !== undefined ) &&  ( curMultipleMax > parseInt( multipleTypePropMatchDetails[ 2 ] )  ) ) {
            LAID.$meta.set( lson, "max", parseInt( multipleTypePropMatchDetails[ 2 ] ) );
          }

        } else {
          lazyProp = prop;
        }
        if ( ( rootLson !== undefined ) && ( rootLson.props[ lazyProp ] === undefined ) && ( lazyProp2defaultValue[ lazyProp ] !== undefined ) ) {
          rootLson[ lazyProp ] = lazyProp2defaultValue[ lazyProp ];
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

when: function ( lson, rootLson ) {

  if ( lson.when !== undefined ) {

    checkAndThrowErrorAttrAsTake( "when", lson.when );

    var eventType2_fnCallbackS_, eventType, fnCallbackS, i, len;


    for ( eventType in eventType2_fnCallbackS_ ) {
      fnCallbackS = eventType2_fnCallbackS_[ eventType ];
      checkAndThrowErrorAttrAsTake( "when." + eventType,
      fnCallbackS );
      LAID.$meta.set( lson, "$$num", "when." + eventType, fnCallbackS.length );
    }

    if ( ( rootLson !== undefined ) && ( rootLson.when[ eventType ] === undefined ) ) {
      rootLson.when[ eventType ] = [];
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

transition: function( lson, rootLson ) {

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
        if ( ( rootLson !== undefined ) && ( rootLson.transition[ transitionProp ] === undefined ) ) {
          rootLson.transition[ transitionProp ] = {};
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
    key2fnNormalize.states( many );

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

      key2fnNormalize.props( state, lson );
      key2fnNormalize.when( state, lson );
      key2fnNormalize.transition( state, lson );

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
