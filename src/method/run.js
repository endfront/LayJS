(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    var
      rootLevel;

    rootLson.props  = rootLson.props || {};

    rootLson.props.width = window.innerWidth;
    rootLson.props.height = window.innerHeight;

    rootLevel = new LAID.Level( "/", rootLson, undefined );
    rootLevel.$init();
    LAID.$newLevelS = [ rootLevel ];

    window.onresize = updateSize;


    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "width", window.innerWidth );
    rootLevel.$changeAttrVal( "height", window.innerHeight );
    LAID.$solveForRecalculation();

  }




})();
