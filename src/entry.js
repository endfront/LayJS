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


.lson {

// set antialiasing of text as well!
border: none;

position: absolute;

box-sizing: border-box;
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;

transform-style: preserve-3d;
-webkit-transform-style: preserve-3d;

backface-visibility: visible;
-webkit-backface-visibility: visible;


-webkit-appearance: none;
-moz-appearance: none;
appearance: none;



}


*/

(function () {
  "use strict";

  window.laid = window.LAID = {

    $path2level: {},
    $cloggedLevelS: [],
    $newLevelS: [],
    $recalculateDirtyLevelS: [],
    $renderDirtyLevelS: [],
    $prevFrameTime: 0,
    $isClogged:false,
    $isSolvingNewLevels: false
  };

})();
