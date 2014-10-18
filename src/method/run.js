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

    LSON._clog_key2levelS[ 1 ] = [ new LSON.Level( "/", rootLson, 1, undefined ) ];

    LSON.unclog( 1 );

    window.requestAnimationFrame( render );

  };


  function updateSize () {

    var rootPart = path2Level[ '/' ];
    rootPart.constraint2val.width =  window.innerWidth;
    rootPart.constraint2val.height =  window.innerHeight;
    //LSON._dirtyPartS.push(  );

  }



  function render() {

    //console.log( LSON._dirtyPartS.length );

    window.requestAnimationFrame( render );

  }

})();
