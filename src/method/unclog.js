(function() {
  "use strict";


  LSON.unclog = function ( clog_key ) {


    var levelS = LSON._clog_key2levelS[ clog_key ];

    if ( levelS !== undefined ) {

      for ( var i = 0, len = levelS.length; i < len; i++ ) {

        levelS[ i ].unclog();

      }

      delete LSON._clog_key2levelS[ clog_key ];

    }


  };

})();
