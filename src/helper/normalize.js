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

    attr2fnNormalize.type( lson );
    attr2fnNormalize.props( lson, true );
    attr2fnNormalize.states( lson );

    if ( isRecursive ) {

      attr2fnNormalize.children( lson );

    }
  }


  /*
  * Merge the attributes to resolve the
  correct attribute name
  */

  function capitalize( word ) {

    return word.charAt( 0 ).toUpperCase() + word.slice( 1 );

  }



  var expanderProp2_expandedPropS_ = {

    borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth" ],
    borderColor: [ "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor" ],
    borderStyle: [ "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle" ],
    textPadding: [ "textTopPadding", "textRightPadding", "textBottomPadding", "textLeftPadding" ],
    cornerRadius: [ "cornerRadiusTopLeft", "cornerRadiusTopRight", "cornerRadiusBottomRight", "cornerRadiusBottomLeft" ],

  };


  /*
  var multipleTypePropS = [

  "filters",
  "boxShadows",
  "textShadows",
  "videoSources",
  "videoTracks"
  ];

  var lazyProp2_metaSecondLevelPropS_ = {

  border: [ "top", "right", "bottom", "left" ]

};

var camelCaseExtendablePropS = [

"borderTop",
"borderRight",
"borderBottom",
"borderLeft",

"background",

/^filters[\d+]$/,
/^boxShadows[\d+]$/,
/^textShadows[\d+]$/,
/^videoSources[\d+]$/,
/^videoTracks[\d+]$/,
/^audioSources[\d+]$/,
/^audioTracks[\d+]$/,

// TODO: maybe change this to second level iteration?
/^filters[\d+]DropShadow$/,


];
*/
/*
* Recursively flatten if `prop` is object or array valued
*/
function flattenProp( lson, prop ) {

  var props, value, type, flattenedProp;
  props = lson.props;
  value = props[ prop ];
  type = LSON.$findType( value );


  if ( type === "Array" ) {

    for ( var i = 0, len = value.length; i < length; i++ ) {
      flattenedProp = prop + toString.call( i );
      props[ flattenedProp ] = value[ i ];
      flattenProp( lson,  flattenedProp );
    }
    props[ prop ] = undefined;

  } else if ( type === "Object" && !( value instanceof LSON.Take || value instanceof LSON.Color ) ) {

    for ( var key in value ) {

      if ( value.hasOwnProperty( key ) ) {

        flattenedProp = prop + capitalize( key );
        props[ flattenedProp ] = value[ key ];
        flattenProp( lson, flattenedProp );

      }
      props[ prop ] = undefined;
    }
  }
}


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

var allTypeProp2defaultValue = {
  width: new LSON.Take( 'this', '$naturalWidth' ),
  height: new LSON.Take( 'this', '$naturalHeight' ),
  top: 0,
  left: 0,
  originX:0,
  originY:0,
  overflowX: "visible",
  overflowY: "visible",
  scrollX: 0,
  scrollY: 0,
  opacity:1,
  cursor: "default",
  shiftX: 0,
  shiftY: 0,
  rotateX:0,
  rotateY:0,
  rotateZ:0,
  scaleX:0,
  scaleY:0,
  cornerRadius: 0,
  backgroundColor: LSON.transparent
};



var type2_typeProp2defaultValue_ = {
  text: {
    text: "",
    textSize: 13,
    textFamily: "sans-serif",
    textWeight: "normal",
    textColor: LSON.color( "black" ), //TODO: optimize this: insert direct construction here (i.e new LSON.Color)
    textSpacing: null,
    textVariant: "normal",
    textStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    textLetterSpacing: null,
    textWordSpacing: null,
    textOverflow: "normal",
    textIndent: 0,
    textWhitespace: "normal",
    textPadding: 0
  },
  image: {
    imageUrl: ""
  },
  video: {
    videoAutplay: false,
    videoControls: true,
    videoCrossorigin: "anonymous",
    videoLoop: false,
    videoMuted: false,
    videoPreload: "auto",
    videoPoster: null
  },
  audio: {
    audioControls: true,
    audioLoop: false,
    audioMuted: false,
    audioPreload: "auto",
    audioVolume: 0.7
  },
  input: {
    inputText: "",
    inputLabel:"",
    inputPlacholder: "",
    inputRows: 2,
    inputDisabled: false,
    inputAutocomplete: true,
    inputAutocorrect: true,
  }
};


// Note that we don't have to take width as the take constraint out here as left
// is a constraint by itself too, but we shall stick to keeping width as the first
// constraint to maintain consistency with "Note 1".
var takeLeftToCenterX = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'left' ), fnPosToCenter );
var takeLeftToRight = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'left' ), fnPosToEdge );
var takeTopToCenterY = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'top' ), fnPosToCenter );
var takeTopToBottom = new LSON.Take( 'this', 'width' ).fn( new LSON.Take( 'this', 'top' ), fnPosToEdge );



var attr2fnNormalize = {
  type: function ( lson ) {

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
            if ( stateName2state[ stateName ].props.txt !== undefined ) {
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

    var prop, val;
    for ( prop in prop2val ) {
      if ( prop2val.hasOwnProperty( prop ) ) {

        flattenProp( lson, prop );
      }
    }

    /* Filling in the defaults here */
    var allTypeProp, typeProp2defaultValue, typeProp;

    for ( allTypeProp in allTypeProp2defaultValue ) {
      if ( ( allTypeProp2defaultValue.hasOwnProperty( allTypeProp ) ) && ( prop2val[ allTypeProp ] === undefined ) ) {
        prop2val[ allTypeProp ] = allTypeProp2defaultValue[ allTypeProp ];
      }
    }

    typeProp2defaultValue = type2_typeProp2defaultValue_[ lson.type ];
    if ( typeProp2defaultValue !== undefined ) {
      for ( typeProp in typeProp2defaultValue ) {
        if ( ( typeProp2defaultValue.hasOwnProperty( typeProp ) ) && ( prop2val[ typeProp ] === undefined ) ) {
          prop2val[ typeProp ] = typeProp2defaultValue[ typeProp ];
        }
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
            if ( prop2val[ expandedProp ] === undefined ) {

              prop2val[ expandedProp ] = expanderVal;

            }
          }
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
