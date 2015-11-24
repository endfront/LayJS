(function () {
  "use strict";

  if ( String.prototype.startWith === undefined ) {
    String.prototype.startsWith = function ( prefix ) {
      return this.indexOf(prefix) === 0;
    }
  }

})();
