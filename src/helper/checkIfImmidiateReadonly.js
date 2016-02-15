( function () {
  "use strict";

  var immidiateReadonlyS = [
    "$naturalWidth", "$naturalHeight",
    "$scrolledX", "$scrolledY",
    "$focused",
    "$input",
    "$hash",
    "$pathname",
    "$host",
    "$href"
  ];

  LAY.$checkIfImmidiateReadonly = function ( attr ) {
    return immidiateReadonlyS.indexOf( attr ) !== -1;
  };


})();
