(function() {
  "use strict";


  LAID.$checkIsPropAttr = function ( attr ) {
    return ( ( attr.indexOf( "." ) === -1 ) &&
     ( attr[ 0 ] !== "$") );
   };

})();
