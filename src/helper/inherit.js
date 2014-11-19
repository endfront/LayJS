
(function () {
  "use strict";


  /*
  * Inherit the lson into `intoLson`.
  */
  LSON._inherit = function ( fromLson, intoLson ) {

    for ( var key in fromLson ) {

      if ( fromLson.hasOwnProperty( key ) ) {

        if ( attr2fnInherit.hasOwnPropoperty( key ) ) {
          attr2fnInherit[ key ]( fromLson, intoLson, isStateInheritance );
        }
      }
    }
  };

  function inheritSingleLevelObject( fromObject, intoObject, key ) {

    var fromKey2value, intoKey2value;
    fromKey2value = fromObject.key;
    intoKey2value = intoObject.key;

    if ( fromKey2value !== undefined ) {

      if ( intoKey2value === undefined ) {

        intoObject.key = intoKey2value;

      } else {

        for ( var fromKey in fromKey2value ) {

          if ( fromKey2value.hasOwnProperty( fromKey ) ) {

            intoKey2value[ fromKey ] =
            intoKey2value[ fromKey ] ||
            fromKey2value[ fromKey ];

          }
        }
      }

    }
  }


  var attr2fnInherit = {


    type: function( fromLson, intoLson ) {

      intoLson.type = intoLson.type || fromLson.type;

    },

    data: function( fromLson, intoLson ) {

      inheritSingleLevelObject( fromLson, intoLson, "data" );

    },

    props: function( fromLson, intoLson ) {

      inheritSingleLevelObject( fromLson, intoLson, "props" );
    },

    many: function( fromLson, intoLson ) {

      var fromManyAttr2val, intoManyAttr2val;
      fromManyAttr2val = fromLson.many;
      intoManyAttr2val = intoLson.many;

      if ( fromManyAttr2val !== undefined ) {

        if ( intoManyAttr2val === undefined ) {

          intoLson.many = fromManyAttr2val;

        } else {

          LSON._inherit( fromManyAttr2val, intoManyAttr2val );

        }
      }
    },

    rows: function( fromLson, intoLson ) {

      intoLson.rows = intoLson.rows || fromLson.rows;

    },





    children: function( fromLson, intoLson ) {
      var fromChildName2lson, intoChildName2lson;
      fromChildName2lson = fromLson.children;
      intoChildName2lson = intoLson.children;

      for ( var name in fromChildName2lson ) {

        if ( fromChildName2lson.hasOwnProperty( name ) ) {

          if ( !intoChildName2lson[ name ] ) { // inexistent child

            intoChildName2lson[ name ] = fromChildName2lson[ name ];

          } else {

            inherit( fromChildName2lson[ name ], intoChildName2lson[ name ] );

          }
        }
      }
    },


    states: function( fromLson, intoLson ) {

      var fromStateName2state, intoStateName2state;
      fromStateName2state = fromLson.states;
      intoStateName2state = intoLson.states;

      var inheritFromState, inheritIntoState;
      for ( var name in fromStateName2state ) {

        if ( fromStateName2state.hasOwnProperty( name ) ) {

          if ( !intoStateName2state[ name ] ) { //inexistent state

            intoStateName2state[ name ] = fromStateName2state[ name ];

          } else {

            inheritFromState = fromStateName2state[ name ];
            inheritIntoState = intoStateName2state[ name ];

            inheritIntoState.onlyif = inheritIntoState.onlify || inheritFromState.onlify;
            inheritIntoState.install = inheritIntoState.install || inheritFromState.install;
            inheritIntoState.uninstall = inheritIntoState.uninstall || inheritFromState.uninstall;


            attr2fnInherit.props( inheritFromState, inheritIntoState );
            attr2fnInherit.when( inheritFromState, inheritIntoState );


          }
        }
      }
    },

    when: function( fromLson, intoLson ) {

      var fromEventName2_fnEventHandlerS_, intoEventName2_fnEventHandlerS_;
      fromEventName2_fnEventHandlerS_ = fromLson.when;
      intoEventName2_fnEventHandlerS_ = intoLson.when;

      if ( fromEventName2_fnEventHandlerS_ !== undefined ) {

        if ( intoEventName2_fnEventHandlerS_ === undefined ) {

          intoLson.when = fromEventName2_fnEventHandlerS_;

        } else {
          var fnFromEventHandlerS, fnIntoEventHandlerS;

          for ( var fromEventName in fromEventName2_fnEventHandlerS_ ) {

            fnFromEventHandlerS = fromEventName2_fnEventHandlerS_[ fromEventName ];
            fnIntoEventHandlerS = intoEventName2_fnEventHandlerS_[ fromEventName ];

            if ( fnIntoEventHandlerS === undefined ) {

              intoEventName2_fnEventHandlerS_[ fromEventName ] = fnIntoEventHandlerS;

            } else {

              fnIntoEventHandlerS = fnFromEventHandlerS.concat( fnIntoEventHandlerS );

            }
          }
        }
      }
    }

  };

})();
