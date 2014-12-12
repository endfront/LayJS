(function() {
  "use strict";




  LSON.run =  function ( rootLson, name2lson ) {



    if ( name2lson ) {

      name2lson = rootLson;
      rootLson = {
        props: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

    } else {

      rootLson.props = rootLson.props || {};

      rootLson.props.width = window.innerWidth;
      rootLson.props.height = window.innerHeight;

    }

    rootLson.children = name2lson;

    window.onresize = updateSize;

    LSON.$clogKey2_levelS_[ 1 ] = [ new LSON.Level( "/", rootLson, 1, undefined ) ];

    LSON.unclog( 1 );

    LSON.$prevTimeFrame = Date.now();

    window.requestAnimationFrame( render );

  };


  function updateSize () {

    //var rootPart = levelPath2Level[ '/' ];
    rootPart.constraint2val.width =  window.innerWidth;
    rootPart.constraint2val.height =  window.innerHeight;

  }



  function render() {

    var curTimeFrame, timeFrameDiff, i, iLen, j, jLen, dirtyLevelS, dirtyLevel, dirtyAttrS, dirtyAttr, dirtyAttrValue;

    curTimeFrame = Date.now();
    timeFrameDiff = curTimeFrame - LSON.$prevTimeFrame;

    for ( i = 0, dirtyLevelS = LSON.$dirtyLevelS, iLen = dirtyLevelS.length; i < iLen; i++ ) {

      dirtyLevel = dirtyLevelS[ i ];

      for ( j = 0, dirtyAttrS = dirtyLevel.dirtyAttrS, jLen = dirtyAttrS.length; j < jLen; j++ ) {

        dirtyAttr = dirtyAttrS[ j ];
        dirtyAttrValue = dirtyLevel.$attr2attrValue[ dirtyAttr ];


        if ( dirtyAttrValue.isTransitioning ) { // if transitioning

          //  change value using animator
          //  if part and if css type then cssify
          //  if animating done then remove

        } else {

          //   change value
          dirtyAttrValue.stagedCalValue = dirtyAttrValue.finalCalcValue;
          //   if part and if css type then cssify
          if ( dirtyLevel.isPart ) {

            if ( )

          }
          //   remove

        }

      }

    }

    window.requestAnimationFrame( render );

  }

})();
