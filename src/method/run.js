(function() {
  "use strict";

  LAID.run =  function ( rootLson ) {

    setRuntimeGlobals();

    ( new LAID.Level( "/", rootLson, undefined ) ).$init();

    LAID.$solve();

    window.onresize = updateSize;

  };

  function setRuntimeGlobals () {
    var
      takeMidpointX = LAID.take("", "width").divide(2),
      takeMidpointY = LAID.take("", "height").divide(2);
    
    LAID.$miscPosAttr2take = {
      centerX: LAID.take("","left").add( takeMidpointX ),
      centerY: LAID.take("","top").add( takeMidpointY ),
      $midpointX: takeMidpointX,
      $midpointY: takeMidpointY
    };

    LAID.$essentialPosAttr2take = {
      right: LAID.take("","left").add( LAID.take("", "width") ),
      bottom: LAID.take("","top").add( LAID.take("", "height") )
    };

    LAID.$emptyAttrVal = new LAID.AttrVal( "", undefined );

    LAID.$formationDisplayNoneState = {
      onlyif: LAID.take("","$f").eq(-1),
      props: {
        display:false
      }
    };

    
  
  }

  function updateSize () {

    var rootLevel = LAID.$pathName2level[ "/" ];
    rootLevel.$changeAttrVal( "$naturalWidth",
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth );
    rootLevel.$changeAttrVal( "$naturalHeight",
     window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);

  }




})();
