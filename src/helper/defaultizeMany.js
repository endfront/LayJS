( function () {
  "use strict";

  var essentialProp2defaultValue;

  LAID.$defaultizeMany = function ( lson ) {
    
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
    filter:  new LAID.Take( "", "$all" ),
    sort: null,
    formation: "onebelow",
    ascending: true
    
  };


})();
