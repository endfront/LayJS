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

    // version is a method in order
    // to maintain the consistency of
    // only method accesses from the user
    version: function(){ return 1; },

    
    $pathName2level: {},
    $cloggedLevelS: [],

    $newlyInstalledStateLevelS: [],
    $newlyUninstalledStateLevelS: [],
    $newLevelS: [],
    $recalculateDirtyLevelS: [],
    $renderDirtyPartS: [],
    $prevFrameTime: 0,
    $newManyS: [],

    $isClogged:false,
    $isSolving: false,
//    $isRequestedForAnimationFrame: false,
    $isSolveRequiredOnRenderFinish: false,

    $isDataTravellingShock: false,
    $isDataTravelling: false,
    $dataTravelDelta: 0.0,
    $dataTravellingLevel: undefined,
    $dataTravellingAttrInitialVal: undefined,
    $dataTravellingAttrVal: undefined



  };

})();
