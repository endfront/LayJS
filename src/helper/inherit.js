
(function () {
  "use strict";


  LSON._inherit = function ( fromLson, intoLson ) {

    for ( var key in fromLson ) {

      if ( fromLson.hasOwnProperty( key ) ) {

        attr2fnInherit[ key ]( fromLson, intoLson );

      }
    }
  };

  function inheritSingleLevelObject( fromObject, intoObject, key ) {

    var from_key2value, into_key2value;
    from_key2value = fromObject.key;
    into_key2value = intoObject.key;

    if ( from_key2value !== undefined ) {

      if ( into_key2value === undefined ) {

        intoObject.key = into_key2value;

      } else {

        for ( var from_key in from_key2value ) {

          if ( from_key2value.hasOwnProperty( from_key ) ) {

            into_key2value[ from_key ] =
            into_key2value[ from_key ] ||
            from_key2value[ from_key ];

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

      var from_many_attr2val, into_many_attr2val;
      from_many_attr2val = fromLson.many;
      into_many_attr2val = intoLson.many;

      if ( from_many_attr2val !== undefined ) {

        if ( into_many_attr2val === undefined ) {

          intoLson.many = from_many_attr2val;

        } else {

          LSON._inherit( from_many_attr2val, into_many_attr2val );

        }
      }
    },

    rows: function( fromLson, intoLson ) {

      intoLson.rows = intoLson.rows || fromLson.rows;

    },

    /*formation: function( from_many_attr2val, into_many_attr2val ) {

    var from_formation_attr2val, into_formation_attr2val;
    from_formation_attr2val = from_many_attr2val.formation;
    into_formation_attr2val = into_many_attr2va.formation;

    if ( from_formation_attr2val !== undefined ) {

    if ( into_formation_attr2val === undefined ) {

    into_many_attr2val.formation = from_formation_attr2val;

  } else {

  into_formation_attr2val.type = into_formation_attr2val.type || from_formation_attr2val.type;
  into_formation_attr2val.sort = into_formation_attr2val.sort || from_formation_attr2val.sort;
  into_formation_attr2val.order = into_formation_attr2val.order || from_formation_attr2val.order;

  inheritSingleLevelObject( from_formation_attr2val, into_formation_attr2val, "args" );

}
}
},*/



children: function( fromLson, intoLson ) {
  var from_child_name2lson, into_child_name2lson;
  from_child_name2lson = fromLson.children;
  into_child_name2lson = intoLson.children;

  for ( var name in from_child_name2lson ) {

    if ( from_child_name2lson.hasOwnProperty( name ) ) {

      if ( !into_child_name2lson[ name ] ) { // inexistent child

        into_child_name2lson[ name ] = from_child_name2lson[ name ];

      } else {

        inherit( from_child_name2lson[ name ], into_child_name2lson[ name ] );

      }
    }
  }
},


states: function( fromLson, intoLson ) {

  var from_state_name2state, into_state_name2state;
  from_state_name2state = fromLson.states;
  into_state_name2state = intoLson.states;

  var inheritFromState, inheritIntoState;
  for ( var name in from_state_name2state ) {

    if ( from_state_name2state.hasOwnProperty( name ) ) {

      if ( !into_state_name2state[ name ] ) { //inexistent state

        into_state_name2state[ name ] = from_state_name2state[ name ];

      } else {

        inheritFromState = from_state_name2state[ name ];
        inheritIntoState = into_state_name2state[ name ];

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

  var from_event_name2fnEventHandlerS, into_event_name2fnEventHandlerS;
  from_event_name2fnEventHandlerS = fromLson.when;
  into_event_name2fnEventHandlerS = intoLson.when;

  if ( from_event_name2fnEventHandlerS !== undefined ) {

    if ( into_event_name2fnEventHandlerS === undefined ) {

      intoLson.when = from_event_name2fnEventHandlerS;

    } else {
      var fnFromEventHandlerS, fnIntoEventHandlerS;

      for ( var from_event_name in from_event_name2fnEventHandlerS ) {

        fnFromEventHandlerS = from_event_name2fnEventHandlerS[ from_event_name ];
        fnIntoEventHandlerS = into_event_name2fnEventHandlerS[ from_event_name ];

        if ( fnIntoEventHandlerS === undefined ) {

          into_event_name2fnEventHandlerS[ from_event_name ] = fnIntoEventHandlerS;

        } else {

          fnIntoEventHandlerS = fnFromEventHandlerS.concat( fnIntoEventHandlerS );

        }
      }
    }
  }
}

};

})();
