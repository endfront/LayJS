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
