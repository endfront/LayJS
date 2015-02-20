( function () {
  "use strict";

  LAID.$clearDataTravellingAttrVals = function () {

    var
      dataTravellingAffectedAttrValS = LAID.$dataTravellingAffectedAttrValS,
      dataTravellingAffectedAttrVal,
      i, len;

    for ( i = 0, len = dataTravellingAffectedAttrValS; i < len; i++ ) {
      dataTravellingAffectedAttrVal =  dataTravellingAffectedAttrValS[ i ];
      dataTravellingAffectedAttrVal.isDataTravelling = true;
    }

    LAID.$dataTravellingAffectedAttrValS = [];

  };

})();
