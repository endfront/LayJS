
(function () {
  "use strict";


  /*
  * Inherit the lson into `intoLson`.
  */
  LSON.$inherit = function ( intoLson, fromLson ) {

    for ( var key in fromLson ) {

      if ( fromLson.hasOwnProperty( key ) ) {

        if ( attr2fnInherit.hasOwnPropoperty( key ) ) {
          attr2fnInherit[ key ]( intoLson, fromLson, isStateInheritance );
        }
      }
    }
  };

  function inheritSingleLevelObject( intoObject, fromObject, key, isDuplicateOn ) {

    var fromKey2value, intoKey2value, fromKey, fromKeyValue;
    fromKey2value = fromObject.key;
    intoKey2value = intoObject.key;

    if ( fromKey2value !== undefined ) {

      if ( intoKey2value === undefined ) {

        intoObject.key = {};

      }

      for ( fromKey in fromKey2value ) {

        if ( fromKey2value.hasOwnProperty( fromKey ) ) {

          fromKeyValue = fromKey2value[ fromKey ];

          if ( isDuplicateOn && ( typeof fromKeyValue === "object" ) ) {

            intoObject[ fromKey ] = LSON.$clone( fromKeyValue );

          } else {

            intoObject[ fromKey ] = fromKeyValue;

          }

        }
      }

    }
  }


  var attr2fnInherit = {


    type: function( intoLson, fromLson ) {

      intoLson.type = fromLson.type !== undefined ?  fromLson.type : intoLson.type;

    },

    inputType : function ( intoLson, fromLson ) {

      intoLson.inputType = fromLson.inputType !== undefined ?  fromLson.inputType : intoLson.inputType;

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

      var fromManyAttr2val, intoManyAttr2val;
      fromManyAttr2val = fromLson.many;
      intoManyAttr2val = intoLson.many;

      if ( fromManyAttr2val !== undefined ) {

        if ( intoManyAttr2val === undefined ) {
          intoLson.many = {};
          intoManyAttr2val = intoLson.many;
        }
        LSON.$inherit( intoManyAttr2val, fromManyAttr2val );

      }

    },
    
    rows: function( intoLson, fromLson ) {
      // TODO: fix
      var intoLsonRowS, fromLsonRowS;
      intoLsonRowS = intoLson.rows;
      fromLsonRowS = fromLson.rows;

      if ( fromLsonRowS !== undefined ) {

        for ( var i = 0, len = fromLsonRowS.length; i < len; i++ )  {

        }

      }
      intoLson.rows = intoLson.rows || fromLson.rows;

    },





    children: function( intoLson, fromLson ) {
      var fromChildName2lson, intoChildName2lson;
      fromChildName2lson = fromLson.children;
      intoChildName2lson = intoLson.children;

      // TODO: fix
      if ( fromChildName2lson !== undefined ) {


        for ( var name in fromChildName2lson ) {

          if ( fromChildName2lson.hasOwnProperty( name ) ) {

            if ( !intoChildName2lson[ name ] ) { // inexistent child

              intoChildName2lson[ name ] = fromChildName2lson[ name ];

            } else {

              LSON.$inherit( fromChildName2lson[ name ], intoChildName2lson[ name ] );

            }
          }
        }
      }
    },

    // TODO: fix
    states: function( intoLson, fromLson ) {

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
            //inheritIntoState.uninstall = inheritIntoState.uninstall || inheritFromState.uninstall;


            attr2fnInherit.props( inheritIntoState, inheritFromState );
            attr2fnInherit.when( inheritIntoState, inheritFromState );


          }
        }
      }
    },

    // TODO: fix
    when: function( intoLson, fromLson ) {

      var fromEventType2_fnEventHandlerS_, intoEventType2_fnEventHandlerS_;
      fromEventType2_fnEventHandlerS_ = fromLson.when;
      intoEventType2_fnEventHandlerS_ = intoLson.when;

      if ( fromEventType2_fnEventHandlerS_ !== undefined ) {

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
    }

  };

})();
