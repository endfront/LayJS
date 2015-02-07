/*

optgroup {
font-weight: bold;
}

textarea {
overflow: auto;
}


button {
overflow: visible;
}


abbr[title] {
border-bottom: 1px dotted;
}



b,
strong {
font-weight: bold;
}

dfn {
font-style: italic;
}



h1 {
font-size: 2em;
margin: 0.67em 0;
}



mark {
background: #ff0;
color: #000;
}



small {
font-size: 80%;
}



sub,
sup {
font-size: 75%;
line-height: 0;
position: relative;
vertical-align: baseline;
}

sup {
top: -0.5em;
}

sub {
bottom: -0.25em;
}



*/

(function () {
  "use strict";

  /*
  var
    textTestNodeCSS = "position:absolute;isibility:hidden;box-sizing:border-box;-moz-box-sizing:border-box;font-family:sans-serif:font-size:13px;",
    textWidthTestNode = document.createElement( "span" ),
    textHeightTestNode = document.createElement( "div" );

  textHeightTestNode.id = "t-height";
  textWidthTestNode.id = "t-width";

  textWidthTestNode.style.cssText = textTestNodeCSS;
  textHeightTestNode.style.cssText = textTestNodeCSS;


  document.body.appendChild( textWidthTestNode );
  document.body.appendChild( textHeightTestNode );

*/

  window.laid = window.LAID = {

    $path2level: {},
    $cloggedLevelS: [],
    $newPartS: [],
    $newlyInstalledStateLevelS: [],
    $newlyUninstalledStateLevelS: [],
    $newLevelS: [],
    $recalculateDirtyLevelS: [],
    $renderDirtyLevelS: [],
    $prevFrameTime: 0,
    //$uninitialized: {},
    $isClogged:false,
    $isSolvingNewLevels: false,
    $isRequestedForAnimationFrame: false
  };

})();
