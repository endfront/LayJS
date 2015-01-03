(function() {
  "use strict";


  LAID.take = function ( relativePath, prop ) {


    if ( ( prop !== undefined ) && ( LAID.$checkIsExpanderAttr( prop ) ) ) {
        throw ( "LAID Error: takes using expander props such as '" + relativePath  + "' are not permitted." );
    } else {

      return new LAID.Take( relativePath, prop );
    }

  };

})();
