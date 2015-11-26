(function () {
  "use strict";

  LAY.$checkIfDoingReadonly = function ( attr ) {
    return ( attr === "$hovering" ||
      attr === "$clicking");
  };

})();