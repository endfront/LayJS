
(function () {
  "use strict";


  /*
  * Inherit the root, state, or many LSON from `from` into `into`.
  */
  LSON.$inherit = function ( into, from, isState ) {

    if ( !isState ) {
      for ( var key in from ) {

        if ( from.hasOwnProperty( key ) ) {

          if ( key2fnInherit.hasOwnPropoperty( key ) ) {
            key2fnInherit[ key ]( into, from );
          }
        }
      }
    } else {

      into.onlyif = into.onlyif || into.onlyif;
      into.install = from.install || into.install;
      into.uninstall = from.uninstall || into.uninstall;

      if ( from.props !== undefined ) {
        key2fnInherit.props( into, from );
      }
      if ( from.when !== undefined ) {
        key2fnInherit.when( into, from );
      }
      if ( from.transition !== undefined ) {
        key2fnInherit.transition( into, from );
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

      LSON.$inherit( intoLson.many, fromLson.many, false );



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
          LSON.$inherit( intoChildName2lson[ name ], fromChildName2lson[ name ], true );

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

          LSON.$inherit( intoStateName2state[ name ], fromStateName2state[ name ], true );

        }

      }

    },

    when: function( intoLson, fromLson ) {

      var fromEventType2_fnEventHandlerS_, intoEventType2_fnEventHandlerS_,
      fnFromEventHandlerS, fnIntoEventHandlerS, fromEventType;

      fromEventType2_fnEventHandlerS_ = fromLson.when;
      intoEventType2_fnEventHandlerS_ = intoLson.when;

      if ( intoEventType2_fnEventHandlerS_ === undefined ) {

        intoLson.when = {};

      }

      for ( fromEventType in fromEventType2_fnEventHandlerS_ ) {

        fnFromEventHandlerS = fromEventType2_fnEventHandlerS_[ fromEventType ];
        fnIntoEventHandlerS = intoEventType2_fnEventHandlerS_[ fromEventType ];

        if ( fnIntoEventHandlerS === undefined ) {

          intoEventType2_fnEventHandlerS_[ fromEventType ] = Array.prototype.slice.call( fnIntoEventHandlerS );

        } else {

          intoEventType2_fnEventHandlerS_[ fromEventType ] = fnFromEventHandlerS.concat( fnIntoEventHandlerS );
        }

      }
    }

  };

})();
