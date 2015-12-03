(function () {
  "use strict";

  var doingReadonlyS = [
    "$hovering", "$clicking"
  ];

  LAY.$checkIfDoingReadonly = function ( attr ) {
    return doingReadonlyS.indexOf( attr ) !== -1;
  };

})();