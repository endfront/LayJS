(function() {
  "use strict";

  LAY.run =  function ( rootLson ) {

    LAY.$normalize( rootLson );
    setRuntimeGlobals();
    ( new LAY.Level( "/", rootLson, undefined ) ).$init();
    LAY.$solve();
    window.onresize = updateSize;

  };

  function setRuntimeGlobals () {
    var
      takeMidpointX = LAY.take("", "width").half(),
      takeMidpointY = LAY.take("", "height").half();

    LAY.$miscPosAttr2take = {
      centerX: LAY.take("","left").add( takeMidpointX ),
      centerY: LAY.take("","top").add( takeMidpointY ),
      $midpointX: takeMidpointX,
      $midpointY: takeMidpointY,
      $absoluteLeft: LAY.take("../", "$absoluteLeft").add(
        LAY.take("", "left") ),
      $absoluteTop: LAY.take("../", "$absoluteTop").add(
        LAY.take("", "top") )
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
