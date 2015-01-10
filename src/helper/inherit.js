
(function () {
  "use strict";

  // Inheritance allows modifications to the
  // `intoLson` object, but disallows modifications
  // to `fromLson`

  /*
  * Inherit the root, state, or many LAID from `from` into `into`.
  */
  LAID.$inherit = function ( into, from, isState, isRootState ) {

    if ( !isState ) {
      for ( var key in from ) {

        if ( from[ key ] !== undefined ) {
          key2fnInherit[ key ]( into, from );
        }
      }
    } else {

      if ( !isRootState ) {
        into.onlyif = from.onlyif || into.onlyif;
        into.install = from.install || into.install;
        into.uninstall = from.uninstall || into.uninstall;
      }

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

      fromKeyValue = fromKey2value[ fromKey ];

      intoObject[ fromKey ] = ( isDuplicateOn && checkIsMutable( fromKeyValue ) ) ?
      LAID.$clone( fromKeyValue ) :
      fromKeyValue;

    }
  }



  // Precondition: `into<Scope>.key (eg: intoLAID.key)` is already defined
  var key2fnInherit = {


    type: function( intoLson, fromLson ) {

      if ( fromLson.type !== "none" ) {
        intoLson.type =  fromLson.type;
      }

    },

    inputType : function ( intoLson, fromLson ) {

      intoLson.inputType = fromLson.inputType || intoLson.inputType;

    },
    data: function( intoLson, fromLson ) {

      inheritSingleLevelObject( intoLson, fromLson, "data" );

    },

    props: function( intoLson, fromLson ) {

      inheritSingleLevelObject( intoLson, fromLson, "props" );
    },


    transition: function ( intoLson, fromLson ) {

      var
      fromTransitionAttr2transitionDirective = fromLson.transition,
      intoTransitionAttr2transitionDirective = intoLson.transition,
      fromTransitionAttr,
      fromTransitionDirective, intoTransitionDirective,
      fromTransitionArgKey2val,  intoTransitionArgKey2val,
      fromTransitionArgKey;


      if ( ( intoTransitionAttr2transitionDirective === undefined ) ||
        intoTransitionAttr2transitionDirective.all !== undefined ) {
        intoTransitionAttr2transitionDirective = intoLson.transition = {};
      }


      for ( fromTransitionAttr in fromTransitionAttr2transitionDirective ) {

        fromTransitionDirective = fromTransitionAttr2transitionDirective[ fromTransitionAttr ];
        intoTransitionDirective = intoTransitionAttr2transitionDirective[ fromTransitionAttr ];

        
        if ( intoTransitionDirective === undefined ) {
          intoTransitionDirective =
          intoTransitionAttr2transitionDirective[ fromTransitionAttr ] = {};
        }

        intoTransitionDirective.type = fromTransitionDirective.type ||
        intoTransitionDirective.type;

        intoTransitionDirective.duration = fromTransitionDirective.duration ||
        intoTransitionDirective.duration;

        intoTransitionDirective.delay = fromTransitionDirective.delay ||
        intoTransitionDirective.delay;

        intoTransitionDirective.done = fromTransitionDirective.done ||
        intoTransitionDirective.done;

        fromTransitionArgKey2val = fromTransitionDirective.args;
        intoTransitionArgKey2val = intoTransitionDirective.args;


        if ( fromTransitionArgKey2val !== undefined ) {

          if ( intoTransitionArgKey2val === undefined ) {
            intoTransitionArgKey2val =
            intoTransitionDirective.args = {};
          }

          for ( fromTransitionArgKey in fromTransitionArgKey2val ) {

            intoTransitionArgKey2val[ fromTransitionArgKey ] =
            fromTransitionArgKey2val[ fromTransitionArgKey ] ||
            intoTransitionArgKey2val[ fromTransitionArgKey ];
          }
        }
      }

    },



    many: function( intoLson, fromLson ) {

      if ( intoLson.many === undefined ) {
        intoLson.many = {};
      }

      LAID.$inherit( intoLson.many, fromLson.many, false, false );

    },

    rows: function( intoLson, fromLson ) {

      var intoLsonRowS, fromLsonRowS;
      intoLsonRowS = intoLson.rows;
      fromLsonRowS = fromLson.rows;


      intoLson.rows = new Array( fromLsonRowS.length );
      intoLsonRowS = intoLson.rows;
      for ( var i = 0, len = fromLsonRowS.length, fromLsonRow; i < len; i++ )  {

        fromLsonRow = fromLsonRowS[ i ];
        intoLsonRowS[ i ] = checkIsMutable( fromLsonRow ) ? LAID.$clone( fromLsonRow ) : fromLsonRow;

      }

    },





    children: function( intoLson, fromLson ) {
      var fromChildName2lson, intoChildName2lson;
      fromChildName2lson = fromLson.children;
      intoChildName2lson = intoLson.children;

      if ( intoChildName2lson === undefined ) {
        intoChildName2lson = intoLson.children = {};
      }

      for ( var name in fromChildName2lson ) {

        if ( intoChildName2lson[ name ] === undefined ) { // inexistent child

          intoChildName2lson[ name ] = {};

        }
        LAID.$inherit( intoChildName2lson[ name ], fromChildName2lson[ name ], false, false );

      }
    },

    states: function( intoLson, fromLson ) {

      var
      fromStateName2state = fromLson.states,
      intoStateName2state = intoLson.states,
      inheritFromState, inheritIntoState;

      if ( intoStateName2state === undefined ) {
        intoStateName2state = intoLson.states = {};
      }

      for ( var name in fromStateName2state ) {

        if ( !intoStateName2state[ name ] ) { //inexistent state

          intoStateName2state[ name ] = {};

        }

        LAID.$inherit( intoStateName2state[ name ], fromStateName2state[ name ], true, false );

      }
    },

    when: function( intoLson, fromLson ) {


      var
      fromEventType2_fnEventHandlerS_ = fromLson.when,
      intoEventType2_fnEventHandlerS_ = intoLson.when,
      fnFromEventHandlerS, fnIntoEventHandlerS, fromEventType;


      if ( intoEventType2_fnEventHandlerS_ === undefined ) {
        intoEventType2_fnEventHandlerS_ = intoLson.when = {};
      }

      for ( fromEventType in fromEventType2_fnEventHandlerS_ ) {

        fnFromEventHandlerS = fromEventType2_fnEventHandlerS_[ fromEventType ];
        fnIntoEventHandlerS = intoEventType2_fnEventHandlerS_[ fromEventType ];

        if ( fnIntoEventHandlerS === undefined ) {

          intoEventType2_fnEventHandlerS_[ fromEventType ] = LAID.$arrayUtils.cloneSingleLevel( fnFromEventHandlerS );

        } else {

          intoEventType2_fnEventHandlerS_[ fromEventType ] = fnIntoEventHandlerS.concat( fnFromEventHandlerS );
        }

        LAID.$meta.set( intoLson, "$$num", "when." + fromEventType,
        ( intoEventType2_fnEventHandlerS_[ fromEventType ] ).length );


      }
    },

    $$keys: function ( intoLson, fromLson ) {

      LAID.$meta.inherit.$$keys( intoLson, fromLson );
    },

    $$max: function ( intoLson, fromLson ) {

      LAID.$meta.inherit.$$max( intoLson, fromLson );
    },

  };

})();
