( function () {
  "use strict";

  var immidiateReadonlyS = [
    "$naturalWidth", "$naturalHeight",
    "$scrolledX", "$scrolledY",
    "$focused",
    "$input"
  ];
  
  LAY.$checkIfImmidiateReadonly = function ( attr ) {
    return immidiateReadonlyS.indexOf( attr ) !== -1;

  };


})();