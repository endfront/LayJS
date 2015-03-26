( function () {
  "use strict";

  var essentialProp2defaultValue;

  LAID.$defaultizeMany = function ( lson ) {
    
    var
      essentialProp,
      rootStateProps = lson.states.root.props;
    
    
    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootStateProps[ essentialProp ] === undefined ) {
        rootStateProps[ essentialProp ] =
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
