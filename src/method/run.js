(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

    ( new LAID.Level( "/", rootLson, undefined ) ).$init();

    window.onresize = updateSize;

  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );

  }




})();
