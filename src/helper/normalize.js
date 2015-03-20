(function () {
  "use strict";

  var
    normalizedExternalLsonS = [],
    fnCenterToPos,
    fnEdgeToPos,
    takeWidth,
    takeHeight,
    key2fnNormalize;

  

  LAID.$normalize = function( lson, isExternal ) {

    if ( isExternal ) {
      // If we haven't previously normalized it, only then proceed
      if ( normalizedExternalLsonS.indexOf( lson ) === -1 ) {

        normalize( lson, true );
        normalizedExternalLsonS.push( lson );
      }

    } else {      
      normalize( lson, false );
    }
  };

  function normalize( lson, isRecursive ) {

    var
      lsonKey,
      rootLson = lson;

    if ( !lson.states ) {
      lson.states = {};
    }

    if ( lson.states.root ) {
      throw "LAID Error: State name 'root' is reserved.";
    }

    lson.states.root = {
      props: lson.props,
      when: lson.when,
      transition: lson.transition
    };

    for ( lsonKey in lson ) {
      if ( lsonKey !== "children" || isRecursive ) {
        if ( !key2fnNormalize[ lsonKey ] ) {
          throw "LAID Error: LSON key: '" + lsonKey  + "' not found";
        }
        key2fnNormalize[ lsonKey ]( lson );
      }
    }

    lson.props = undefined;
    lson.when = undefined;
    lson.transition = undefined;


  }




  function checkAndThrowErrorAttrAsTake ( name, val ) {
    if ( val instanceof LAID.Take ) {
      throw ( "LAID Error: takes for special/expander props such as '" + name  + "' are not permitted." );
    }
  }





  /*
  * Recursively flatten the prop if object or array typed
  */
  function flattenProp( props, obj, key, prefix ) {

    var val, type, flattenedProp;
    val = obj[ key ];
    type = LAID.type( val );
    if ( type === "array" ) {
      for ( var i = 0, len = val.length; i < len; i++ ) {
        flattenedProp = prefix + ( i + 1 );
        flattenProp( props, val, i, flattenedProp );
      }
      obj[ key ] = undefined;

    } else if ( type === "object" && !( val instanceof LAID.Color ) && !( val instanceof LAID.Take ) ) {

      for ( var subKey in val ) {

        flattenedProp = prefix + LAID.$capitalize( subKey );
        flattenProp( props, val, subKey, flattenedProp );

        obj[ key ] = undefined;
      }

    } else {

      if ( LAID.$checkIsValidUtils.expanderAttr( prefix ) ) {
        checkAndThrowErrorAttrAsTake( prefix, val );
      }

      props[ prefix ] = val;

    }
  }







  fnCenterToPos = function( center, dim ) {
    return center - ( dim / 2 );
  };

  fnEdgeToPos = function( edge, dim ) {
    return edge - ( dim );
  };


  takeWidth = new LAID.Take( "", "width" );
  takeHeight = new LAID.Take( "", "height" );




  key2fnNormalize = {
    /*type: function ( lson ) {

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

    },*/
    $type: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$type", lson.$type );
    },

    $inherit: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "$inherit", lson.$inherit );
      if ( ( lson.$inherit !== undefined ) &&
        LAID.type( lson.$inherit ) !== "array" ) {
          lson.$inherit = [ lson.$inherit ];
        }

    },

    $interface: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$interface", lson.$interface );
    },

    $observe: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$observe", lson.$observe );
    },

    data: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "data", lson.data );

    },
    /*
    * normalize the `lson`
    */
    props: function( lson ) {

      var
        prop2val = lson.props,
        prop, val,
        longhandPropS, longhandProp, shorthandVal,
        multipleTypePropMatchDetails,curMultipleMax,
        i, len;


      if ( lson.props === undefined ) {

        prop2val = lson.props = {};

      }

      checkAndThrowErrorAttrAsTake( "props", lson.props );


      if ( prop2val.centerX !== undefined ) {
        prop2val.left = ( new LAID.Take( fnCenterToPos ) ).fn(
           prop2val.centerX, takeWidth );
      }

      if ( prop2val.right !== undefined ) {
        prop2val.left = ( new LAID.Take( fnEdgeToPos ) ).fn(
           prop2val.right, takeWidth );
      }

      if ( prop2val.centerY !== undefined ) {
        prop2val.top = ( new LAID.Take( fnCenterToPos ) ).fn(
           prop2val.centerY, takeHeight );
      }

      if ( prop2val.bottom !== undefined ) {
        prop2val.top = ( new LAID.Take( fnEdgeToPos ) ).fn(
           prop2val.bottom, takeHeight );
      }

      for ( prop in prop2val ) {
        flattenProp( prop2val, prop2val, prop, prop );
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

      for ( prop in prop2val ) {
        multipleTypePropMatchDetails =
          LAID.$findMultipleTypePropMatchDetails( prop );
        if ( multipleTypePropMatchDetails !== null ) {
          curMultipleMax =
            LAID.$meta.get( lson, "max", multipleTypePropMatchDetails[ 1 ] );
          if ( ( curMultipleMax === undefined ) ||
            ( curMultipleMax < parseInt( multipleTypePropMatchDetails[ 2 ] ) ) ) {
            LAID.$meta.set( lson, "max", multipleTypePropMatchDetails[ 1 ],
              parseInt( multipleTypePropMatchDetails[ 2 ] ) );
          }
        }
      }
    },

  when: function ( lson ) {

    if ( lson.when === undefined ) {
      lson.when = {};
    } else {
      checkAndThrowErrorAttrAsTake( "when", lson.when );

      var eventType2_fnCallbackS_, eventType, fnCallbackS, i, len;

      for ( eventType in eventType2_fnCallbackS_ ) {
        fnCallbackS = eventType2_fnCallbackS_[ eventType ];
        checkAndThrowErrorAttrAsTake( "when." + eventType,
        fnCallbackS );
        //LAID.$meta.set( lson, "num", "when." + eventType, fnCallbackS.length );
      }
    }
  },

  transition: function( lson ) {

    if ( lson.transition === undefined ) {
      lson.transition = {};
    } else {
      var transitionProp, transitionDirective,
      transitionArgKey2val, transitionArgKey, transitionArgKeyS,
      transition = lson.transition,
      defaulterProp, defaultedPropS, defaultedProp, i, len;

      if ( transition !== undefined ) {
        checkAndThrowErrorAttrAsTake( "transition", lson.transition );

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
          if ( LAID.$checkIsValidUtils.expanderAttr( transitionProp ) ) {
            throw ( "LAID Error: transitions for special/expander props such as '" + name  + "' are not permitted." );
          }
          transitionDirective = transition[ transitionProp ];
          checkAndThrowErrorAttrAsTake( "transition." + transitionProp,
          transitionDirective  );

          transitionArgKey2val = transitionDirective.args;
          if ( transitionArgKey2val !== undefined ) {

            checkAndThrowErrorAttrAsTake( "transition." + transitionProp + ".args",
            transitionArgKey2val  );

          }
        }
      }
    }
  },

  states: function( lson, isMany ) {

    if ( lson.states !== undefined ) {

      var stateName2state = lson.states, state;
      checkAndThrowErrorAttrAsTake( "states",  stateName2state );

      for ( var stateName in stateName2state ) {

        if ( !LAID.$checkIsValidUtils.stateName( stateName ) ) {
          throw ( "LAID Error: Invalid state name: " + stateName );
        }

        state = stateName2state[ stateName ];

        checkAndThrowErrorAttrAsTake( "states." + stateName, state );

        if ( !isMany ) {
          key2fnNormalize.props( state );
          key2fnNormalize.when( state );
          key2fnNormalize.transition( state );
        } 

      }
    }
  },


  children: function( lson ) {

    if ( lson.children !== undefined ) {

      var childName2childLson = lson.children;
      checkAndThrowErrorAttrAsTake( "children",  childName2childLson );

      for ( var childName in childName2childLson ) {

        normalize( childName2childLson[ childName ], true );

      }
    }
  },

  many: function ( lson )  {

    if ( lson.many !== undefined ) {

      var many = lson.many;

      checkAndThrowErrorAttrAsTake( "many", many );

      if ( !many.states ) {
        many.states = {};
      }

      many.states.root = {
      
        formation: many.formation,
        sort: many.sort,
        ascending: many.ascending,
        filter: many.filter

      };

      many.formation = undefined;
      many.sort = undefined;
      many.ascending = undefined;
      many.filter = undefined;

      key2fnNormalize.states( many, true );

    }
  }
};

}());
