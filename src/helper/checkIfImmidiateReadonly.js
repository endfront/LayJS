( function () {
  "use strict";

  var immidiateReadonlyS = [
    "$naturalWidth", "$naturalHeight",
    "$scrolledX", "$scrolledY",
    "$cursorX", "$cursorY",
    "$focused",
    "$absoluteX", "$absoluteY",
    "$input", "$inputFocused"
  ];
  
  LAY.$checkIfImmidiateReadonly = function ( attr ) {
    return immidiateReadonlyS.indexOf( attr ) !== -1;

  };


})();