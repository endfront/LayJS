(function () {
  "use strict";

  LAID.$checkIfDoingReadonly = function ( attr ) {
    return ( attr === "$hovering" ||
      attr === "$clicking");
  };

})();