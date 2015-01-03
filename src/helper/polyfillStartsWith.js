(function () {
  "use strict";

  if ( String.prototype.startWith === undefined ) {
    String.prototype.startsWith = function (str, prefix) {
      if (str.length < prefix.length)
        return false;
        for (var i = prefix.length - 1; (i >= 0) && (str[i] === prefix[i]); --i)
          continue;
          return i < 0;
        };
  }

})();
