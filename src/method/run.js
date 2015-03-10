(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    var
      rootLevel;



    
    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

    rootLevel = new LAID.Level( "/", rootLson, undefined );
    rootLevel.$init();
    LAID.$newLevelS = [ rootLevel ];

    window.onresize = updateSize;


  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );
    LAID.$solveForRecalculation();

  }




})();
