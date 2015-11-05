( function () {
  "use strict";

  /* null values indicate that
  * a recalculation at runtime must
  * be done based on the level
  */

  var readonlyAttr2defaultVal = {
    $naturalWidth: null,
    $naturalHeight: null,
    $naturalWidthInput: null,
    $naturalHeightInput: null,
    $absoluteX: null,
    $absoluteY: null,
    $centerX: 0,
    $centerY: 0,
    $right: 0,
    $bottom: 0,

    //$numberOfChildren: null,
    $dataTravelling: false,
    $dataTravelDelta: 0.0,
    $dataTravelLevel: null,

    $hovered: false,
    $focused: false,
    $clicked: false,
    $scrolledX: 0,
    $scrolledY: 0,
    $cursorX: 0,
    $cursorY: 0,
    $input: "",
    $inputChecked: false
  };

  LAID.$getReadonlyAttrDefaultVal = function ( attr ) {
    return readonlyAttr2defaultVal[ attr ];
  };

})();
