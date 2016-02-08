( function () {
  "use strict";

  var
    essentialProp2defaultValue,
    formation2defaultArgs;

  LAY.$defaultizeManyLson = function ( lson ) {

    var
      essentialProp,
      rootState = lson.states.root;

    lson.rows = lson.rows || [];

    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootState[ essentialProp ] === undefined ) {
        rootState[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }
    // TODO: defaultize fargs here?

  };


  essentialProp2defaultValue = {
    filter:  new LAY.Take( "", "rows" ),
    sort:[],
    formation: "onebelow",
    fargs: {}
  };


})();
