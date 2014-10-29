(function() {
  "use strict";


  LSON.unclog = function ( clogKey ) {


    var levelS = LSON.$clogKey2_levelS_[ clogKey ];

    if ( levelS !== undefined ) {

      for ( var i = 0, len = levelS.length; i < len; i++ ) {

        levelS[ i ].unclog();

      }

      delete LSON.$clogKey2_levelS_[ clogKey ];

    }


  };

})();


/*

Loop levels | clogged
  Loop value in values
    If value is constraint
      Take value's constraints
  If level is type many
    Expand levels




*/
