( function () {
  "use strict";

  var essentialProp2defaultValue;

  LAY.$defaultizeManyLson = function ( lson ) {
    
    var
      essentialProp,
      rootState = lson.states.root;
        
    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootState[ essentialProp ] === undefined ) {
        rootState[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }
  };

  essentialProp2defaultValue = {
    filter:  new LAY.Take( "", "rows" ),
    sort: [],
    formation: "onebelow",
    rows: [],
    fargs: {
      onebelow: {
        gap: 0
      },
      totheright: {
        gap: 0
      }
    }
    
  };


})();
