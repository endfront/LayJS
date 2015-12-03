(function() {
  "use strict";

  LAY.run =  function ( rootLson ) {

    
    setRuntimeGlobals();

    ( new LAY.Level( "/", rootLson, undefined ) ).$init();

    LAY.$solve();

    window.onresize = updateSize;

  };

  function setRuntimeGlobals () {
    var
      takeMidpointX = LAY.take("", "width").divide(2),
      takeMidpointY = LAY.take("", "height").divide(2);
    
    LAY.$miscPosAttr2take = {
      centerX: LAY.take("","left").add( takeMidpointX ),
      centerY: LAY.take("","top").add( takeMidpointY ),
      $midpointX: takeMidpointX,
      $midpointY: takeMidpointY
    };

    LAY.$essentialPosAttr2take = {
      right: LAY.take("","left").add( LAY.take("", "width") ),
      bottom: LAY.take("","top").add( LAY.take("", "height") )
    };

    LAY.$emptyAttrVal = new LAY.AttrVal( "", undefined );

    LAY.$formationDisplayNoneState = {
      onlyif: LAY.take("","$f").eq(-1),
      props: {
        display:false
      }
    };
  }

  function updateSize () {

    var rootLevel = LAY.$pathName2level[ "/" ];
    rootLevel.$changeAttrVal( "$windowWidth", window.innerWidth ||
         document.documentElement.clientWidth ||
          document.body.clientWidth );
    rootLevel.$changeAttrVal( "$windowHeight", window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight );

  }




})();
