(function () {
  "use strict";

  if ( String.prototype.startWith === undefined ) {
    String.prototype.startsWith = function ( prefix ) {
      if (this.length < prefix.length)
        return false;
        for (var i = prefix.length - 1; (i >= 0) && (this[i] === prefix[i]); --i)
          continue;
          return i < 0;
        };
  }

})();
