( function () {
  "use strict";

  /* null values indicate that
  * a recalculation at runtime must
  * be done based on the level
  */

  var readonlyAttr2defaultVal = {
    $naturalWidth: null,
    $naturalHeight: null,
    //$absoluteLeft: null,
    //$absoluteTop null,
    $numberOfChildren: null,
    $dataTravelledDelta: 0,
    $dataTravelling: false,

    $hovered: false,
    $focused: false,
    $clicked: false,
    $scrolledX: 0,
    $scrolledY: 0,
    $cursorX: 0,
    $cursorY: 0,
    $input: "",
    $inputChecked: false,
  };

  LAID.$getReadonlyAttrDefaultVal = function ( attr ) {
    return readonlyAttr2defaultVal[ attr ];
  };

})();
