(function() {
  "use strict";

  LAY.level = function (path, attr) {
    var lvl = LAY.$pathName2level[path];
    if (attr !== undefined) {
      if (lvl !== undefined) {
        return lvl.attr(attr);
      }
    } else {
      return lvl;
    }
  };

})();
