( function () {
  "use strict";

  LAY.$mapUtils = {
    key: function ( itemS, key ) {
      var mappedItemS = new Array( itemS.length );
      for ( var i=0, len=itemS.length; i<len; i++ ) {
        mappedItemS[i] = itemS[i][ key ];
      }
      return mappedItemS;
    },
    fn: function ( itemS, fn ) {
      var mappedItemS = new Array( itemS.length );
      for ( var i=0, len=itemS.length; i<len; i++ ) {
        mappedItemS[i] = fn( itemS[i] );
      }
      return mappedItemS;
    }

  };


})();
