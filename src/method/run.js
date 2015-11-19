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
      takeEdgeX = LAID.take("", "width"),
      takeMidpointY = LAID.take("", "height").divide(2),
      takeEdgeY = LAID.take("", "height");
    
    LAID.$miscPosAttr2take = {
      centerX: LAID.take("","left").add( takeMidpointX ),
      centerY: LAID.take("","top").add( takeMidpointY ),
      $centerX: takeMidpointX,
      $right: takeEdgeX,
      $centerY: takeMidpointY,
      $bottom: takeEdgeY
    };

    LAID.$essentialPosAttr2take = {
      right: LAID.take("","left").add( takeEdgeX ),
      bottom: LAID.take("","top").add( takeEdgeY ),
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
    rootLevel.$changeAttrVal( "$naturalWidth", window.innerWidth );
    rootLevel.$changeAttrVal( "$naturalHeight", window.innerHeight );

  }




})();
