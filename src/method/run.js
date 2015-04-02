(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );
    LAID.$displayNoneFormationState = {
      onlyif: LAID.take("","$f").eq(-1),
      props: {
        display:false
      }
    };

    ( new LAID.Level( "/", rootLson, undefined ) ).$init();

    LAID.$solve();

    window.onresize = updateSize;

  };


  function updateSize () {

    var rootLevel = LAID.$path2level[ "/" ];

    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );

  }




})();
