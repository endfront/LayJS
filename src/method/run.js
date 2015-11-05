(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    initiateRuntimeGlobals();

    ( new LAID.Level( "/", rootLson, undefined ) ).$init();

    LAID.$solve();

    window.onresize = updateSize;

  };

  function initiateRuntimeGlobals () {
    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

    LAID.$centerX = LAID.take("", "width").divide(2);
    LAID.$centerY = LAID.take("", "height").divide(2);
    LAID.$right = LAID.take("", "width");
    LAID.$bottom = LAID.take("", "height");

    /*
    LAID.$takeNaturalHeightInput =
      new LAID.Take( "", "$naturalHeightInput");
    LAID.$takeNaturalWidthInput =
      new LAID.Take( "", "$naturalWidthInput");
    */

    LAID.$displayNoneFormationState = {
      onlyif: LAID.take("","$f").eq(-1),
      props: {
        display:false
      }
    };
    LAID.$formationState = {
      onlyif: LAID.take("", "$f").gt(1),
      props: {
        top: LAID.take("", "root.top"),
        left: LAID.take("", "root.left")
      }
    };
  }

  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );

  }




})();
