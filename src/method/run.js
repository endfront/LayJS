(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    var
      rootLevel;



    //rootLson.props.width = window.innerWidth;
    //rootLson.props.height = window.innerHeight;

    rootLevel = new LAID.Level( "/", rootLson, undefined );
    rootLevel.$init();
    LAID.$newLevelS = [ rootLevel ];

    window.onresize = updateSize;

    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );
    LAID.$solveForRecalculation();

  }




})();
