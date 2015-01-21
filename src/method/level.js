(function() {
  "use strict";

  LAID.level = function ( path, refLevel ) {

    return ( refLevel !== undefined ) ?
    ( new LAID.RelPath( path ) ).resolve( refLevel ) :
    LAID.$path2level[ path ];

  };


})();
