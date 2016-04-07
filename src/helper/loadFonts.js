(function () {
  "use strict";
  //
  var
    //TEST_CONTENT = "abcdefghijklmnopqrstuvwxyz1234567890 &#58832;",
    TEST_CONTENT = "abcdefghijklmnopqrstuvwxyz1234567890 &#100;",
    DEFAULT_FONT_FAMILY = "serif,verdana,sans-serif",
    DEFAULT_WIDTH = (function () {
      var node = initiateNode(DEFAULT_FONT_FAMILY);
      var width = getWidth(node);
      removeNode(node);
      return width;
    })();



  function initiateNode( fontFamily ) {
    var node = document.createElement("div");
    node.style.position = "absolute";
    node.style.visibility = "hidden";
    node.style.top = "-9999px";
    node.style.left = "-9999px";
    node.style.fontFamily = "'" + fontFamily + "', " + DEFAULT_FONT_FAMILY;

    node.style.whiteSpace = "nowrap";
    node.style.fontSize = "32px";

    node.innerHTML = TEST_CONTENT;

/*    if ( LAY.$isBelowIE9 ) {
      node.innerText = TEST_CONTENT;
    } else {
      node.textContent = TEST_CONTENT;
    }*/

    document.body.appendChild(node);
    return node;
  }

  function getWidth(node) {
    return node.offsetWidth;
  }

  function removeNode(node) {
    document.body.removeChild(node);
  }

  function FontLoader(name) {
    this.name = name;
    this.attempts = 0;
    this.node = initiateNode(name);
    this.try();
  }
  FontLoader.prototype.try = function () {
    var calcWidth = getWidth(this.node);
    if (calcWidth !== DEFAULT_WIDTH) {
      removeNode(this.node);
      recurseFontUpdate(LAY.level("/"), this.name, false);
    } else {
      var self = this;
      setTimeout(function() {
        self.try();
      }, Math.pow(2,(++this.attempts))*20 );
    }
  };
  var font2fontLoader = {

  };


  function recurseFontUpdate(lvl,fontName) {
    var childLevelS = lvl.childLevelS;

    if (childLevelS.length > 0) {
      for (var i=0; i<childLevelS.length; i++) {
        recurseFontUpdate(childLevelS[i], fontName);
      }
    } else if (lvl.part &&
        (lvl.part.isText)) {
    var textFamilyAttrVal = lvl.attr2attrVal.textFamily;
    if(
      (textFamilyAttrVal && textFamilyAttrVal.calcVal &&
      textFamilyAttrVal.calcVal.indexOf(fontName) !== -1)) {
        lvl.part.updateNaturalWidth();
        lvl.part.updateNaturalHeight();
        LAY.$isNoTransition = true;
        LAY.$solve();
      }
    }
  }


  function updateFonts() {

    var pathName2level = LAY.$pathName2level;
    for (var pathName in pathName2level) {
      var lvl = pathName2level[pathName];
      if (lvl.part &&
          (lvl.part.isText)) {
          var textFamilyAttrVal = lvl.attr2attrVal.textFamily;
        if(
          (textFamilyAttrVal && textFamilyAttrVal.calcVal)) {
          var textFamily = textFamilyAttrVal.calcVal;
          for (var i=0;i<allFontS.length;i++) {
            if (textFamily.indexOf(allFontS[i]) !== -1) {
              lvl.part.updateNaturalWidth();
              lvl.part.updateNaturalHeight();
              LAY.$isNoTransition = true;
              LAY.$solve();
              break;
            }
          }
        }
      }
    }
  }

  var attempts = 0;
  function fontTimeout() {
    setTimeout(function () {
      updateFonts();
      fontTimeout();
    }, Math.pow(2,(attempts++))*20 );
  }
  var allFontS = [];

  fontTimeout();

  LAY.$loadFonts = function (fontS) {
    for (var i=0; i<fontS.length; i++) {
      var font = fontS[i];
      LAY.$arrayUtils.pushUnique(allFontS, font);
      /*if (font2fontLoader[font] === undefined) {
        font2fontLoader[font] = new FontLoader(font);
      }*/
    }
  }
})();
