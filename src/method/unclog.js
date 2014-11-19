(function() {
  "use strict";


  LSON.unclog = function ( clogKey ) {


    var levelS = LSON.$clogKey2_levelS_[ clogKey ];

    if ( levelS !== undefined ) {

      var i;
      len = levelS.length;


      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$inherit();

      }

      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$initAttrs();

      }

      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$initConstraints();

      }

      for ( i = 0; i < len; i++ ) {

        levelS[ i ].$clean();

      }




      LSON.$clogKey2_levelS_[ clogKey ] = null;

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
