
(function () {
  "use strict";


  /*
  * Inherit the lson into `intoLson`.
  */
  LSON.$inherit = function ( intoLson, fromLson ) {

    for ( var key in fromLson ) {

      if ( fromLson.hasOwnProperty( key ) ) {

        if ( key2fnInherit.hasOwnPropoperty( key ) ) {
          key2fnInherit[ key ]( intoLson, fromLson, isStateInheritance );
        }
      }
    }
  };

  function checkIsMutable ( val ) {
    return ( ( typeof val === "object" ) || val instanceof Array );
  }

  function inheritSingleLevelObject( intoObject, fromObject, key, isDuplicateOn ) {

    var fromKey2value, intoKey2value, fromKey, fromKeyValue;
    fromKey2value = fromObject.key;
    intoKey2value = intoObject.key;


    if ( intoKey2value === undefined ) {

      intoObject.key = {};

    }

    for ( fromKey in fromKey2value ) {

      if ( fromKey2value.hasOwnProperty( fromKey ) ) {

        fromKeyValue = fromKey2value[ fromKey ];

        intoObject[ fromKey ] = ( isDuplicateOn && checkIsMutable( fromKeyValue ) ) ?
        LSON.$clone( fromKeyValue ) :
        fromKeyValue;

      }
    }
  }


  // Precondition: `into<Scope>.key (eg: intoLSON.key)` is already defined
  var key2fnInherit = {


    type: function( intoLson, fromLson ) {

      intoLson.type =  fromLson.type;

    },

    inputType : function ( intoLson, fromLson ) {

      intoLson.inputType = fromLson.inputType;

    },
    data: function( intoLson, fromLson ) {

      inheritSingleLevelObject( intoLson, fromLson, "data" );

    },

    props: function( intoLson, fromLson ) {

      inheritSingleLevelObject( intoLson, fromLson, "props" );
    },


    transition: function ( intoLson, fromLson ) {

      inheritSingleLevelObject( intoLson, fromLson, "transition" );

    },

    many: function( intoLson, fromLson ) {

      if ( intoLson.many === undefined ) {
        intoLson.many = {};
      }

      LSON.$inherit( intoLson.many, fromLson.many );



    },

    rows: function( intoLson, fromLson ) {

      var intoLsonRowS, fromLsonRowS;
      intoLsonRowS = intoLson.rows;
      fromLsonRowS = fromLson.rows;


      intoLson.rows = new Array( fromLsonRowS.length );
      intoLsonRowS = intoLson.rows;
      for ( var i = 0, len = fromLsonRowS.length, fromLsonRow; i < len; i++ )  {

        fromLsonRow = fromLsonRowS[ i ];
        intoLsonRowS[ i ] = checkIsMutable( fromLsonRow ) ? LSON.$clone( fromLsonRow ) : fromLsonRow;

      }

    },





    children: function( intoLson, fromLson ) {
      var fromChildName2lson, intoChildName2lson;
      fromChildName2lson = fromLson.children;
      intoChildName2lson = intoLson.children;

      for ( var name in fromChildName2lson ) {

        if ( fromChildName2lson.hasOwnProperty( name ) ) {

          if ( intoChildName2lson[ name ] === undefined ) { // inexistent child

            intoChildName2lson[ name ] = {};

          }
          LSON.$inherit( intoChildName2lson[ name ], fromChildName2lson[ name ] );

        }

      }
    },

    states: function( intoLson, fromLson ) {

      var fromStateName2state, intoStateName2state;
      fromStateName2state = fromLson.states;
      intoStateName2state = intoLson.states;

      var inheritFromState, inheritIntoState;

      for ( var name in fromStateName2state ) {

        if ( fromStateName2state.hasOwnProperty( name ) ) {

          if ( !intoStateName2state[ name ] ) { //inexistent state

            intoStateName2state[ name ] = {};

          }

          inheritFromState = fromStateName2state[ name ];
          inheritIntoState = intoStateName2state[ name ];

          inheritIntoState.onlyif = inheritFromState.onlyif || inheritIntoState.onlyif;
          inheritIntoState.install = inheritFromState.install || inheritIntoState.install;
          inheritIntoState.uninstall = inheritFromState.uninstall || inheritIntoState.uninstall;

          if ( inheritFromState.props ) {
            key2fnInherit.props( inheritIntoState, inheritFromState );
          }
          if ( inheritFromState.when ) {
            key2fnInherit.when( inheritIntoState, inheritFromState );
          }
          if ( inheritFromState.transition ) {
            key2fnInherit.transition( inheritIntoState, inheritFromState );
          }


        }

      }

    },

    // TODO: fix!
    when: function( intoLson, fromLson ) {

      var fromEventType2_fnEventHandlerS_, intoEventType2_fnEventHandlerS_;
      fromEventType2_fnEventHandlerS_ = fromLson.when;
      intoEventType2_fnEventHandlerS_ = intoLson.when;

      if ( intoEventType2_fnEventHandlerS_ === undefined ) {

        intoLson.when = fromEventType2_fnEventHandlerS_;

      } else {
        var fnFromEventHandlerS, fnIntoEventHandlerS;

        for ( var fromEventType in fromEventType2_fnEventHandlerS_ ) {

          fnFromEventHandlerS = fromEventType2_fnEventHandlerS_[ fromEventType ];
          fnIntoEventHandlerS = intoEventType2_fnEventHandlerS_[ fromEventType ];

          if ( fnIntoEventHandlerS === undefined ) {

            intoEventType2_fnEventHandlerS_[ fromEventType ] = fnIntoEventHandlerS;

          } else {

            fnIntoEventHandlerS = fnFromEventHandlerS.concat( fnIntoEventHandlerS );

          }
        }
      }

    }

  };

})();
