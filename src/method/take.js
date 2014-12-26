(function() {
  "use strict";


  LSON.take = function ( relativePath, prop ) {


    if ( ( prop !== undefined ) && ( LSON.$checkIsExpanderAttr( prop ) ) ) {
        throw ( "LSON Error: takes using expander props such as '" + relativePath  + "' are not permitted." );
    } else {

      return new LSON.Take( relativePath, prop );
    }

  };

})();
