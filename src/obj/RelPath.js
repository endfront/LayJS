(function () {
  "use strict";

  LAY.RelPath = function ( relativePath ) {


    this.isMe = false;
    this.isMany = false;
    this.path = "";
    this.isAbsolute = false;
    this.jumpTo = "";

    this.traverseArray = [];

    if ( relativePath === "~") {
      relativePath = "~/";
    }


    if ( relativePath === "" || relativePath === "." ||
      relativePath === "./" ) {
      this.isMe = true;
    } else {
      if ( relativePath.charAt(0) === "/" ) {
        this.isAbsolute = true;
        this.path = relativePath;
      } else {
        if ( relativePath.charAt(0) === "^") {

          var allIndices = [
            relativePath.indexOf("$"),
            relativePath.indexOf("@"),
            relativePath.indexOf("."),
            relativePath.indexOf("~"),
            relativePath.indexOf("/")
          ];

          var smallest = -1;
          for (var i=0; i<allIndices.length;i++) {
            var index = allIndices[i];
            if (index !== -1 &&
              (smallest === -1 || index < smallest ) ) {
              smallest = index;
            }
          }
          if (index === -1) {
            index = relativePath.length;
          }
          this.jumpTo = relativePath.slice(1, index);
          relativePath = relativePath.slice(index);
        }

        var i=0;
        while ( i !== relativePath.length - 1 &&
          [".", "~", "$", "@"].indexOf(relativePath.charAt(i)) !== -1 ) {
          if ( relativePath.slice(i, i+3) === "../" ) {
            this.traverseArray.push(0);
            i +=3;
          } else if ( relativePath.slice(i, i+2) === "~/" ) {
            this.traverseArray.push(1);
            i += 2;
          } else if ( relativePath.charAt(i) === "$" ) {
            this.traverseArray.push(2);
            i++;
          } else if ( relativePath.charAt(i) === "@" ) {
            this.traverseArray.push(3);
            i++;
          } else {
            LAY.$error("Error in Take path: " + relativePath);
          }
        }
        // strip off the "../"s
        // eg: "~/../.../Body" should become "Body"
        this.path = relativePath.slice(i);
      }
      var manyLastIndexOf = this.path.lastIndexOf("/many");
      if ( (this.path.length === 4 && this.path === "many") ||
          (manyLastIndexOf !== -1 &&
            manyLastIndexOf === this.path.length-5) ) {
        this.isMany = true;
        if ( this.path.length === 4 ) {
          this.path = "";
        } else {
          this.path = this.path.slice(0, this.path.length-5);
        }
      }
    }

  };


  LAY.RelPath.prototype.resolve = function ( referenceLevel ) {


    if ( this.isMe ) {
      return referenceLevel;
    } else {
      var level;
      if ( this.isAbsolute ) {
        level = LAY.$pathName2level[ this.path ];
      } else {

        level = referenceLevel;
        if (this.jumpTo !== "") {
          while (level !== undefined) {
            if (level.name === this.jumpTo) {
              break;
            }
            level = level.parentLevel;
          }
          if (level === undefined) {
            LAY.$error("No ^ (jump) level found from level " +
              referenceLevel.pathName);
          }
        }

        var traverseArray = this.traverseArray;

        for ( var i=0, len=traverseArray.length; i<len; i++ ) {
          if ( traverseArray[i] === 0 ) { //parent traversal
            level = level.parentLevel;
          } else if ( traverseArray[i] === 1 ) { //closest row traversal
            do {
              level = level.parentLevel;
            } while ( !level.derivedMany );
          } else if ( traverseArray[i] === 2 ) { // view "$"
            do {
              level = level.parentLevel;
              if ( level === undefined ) {
                LAY.$error("No View Found ($) from level " +
                  referenceLevel.pathName);
              }
            } while ( !level.isView );
          } else { //page "@"
            do {
              level = level.parentLevel;
              if ( level === undefined ) {
                LAY.$error("No Page Found (@) from level " +
                  referenceLevel.pathName);
              }
            } while ( !level.isPage );
          }
        }

        level =  ( this.path === "" ) ? level :
              LAY.$pathName2level[ level.pathName +
              ( ( level.pathName === "/" ) ? "" : "/" )+
              this.path ];
      }
      if ( this.isMany ) {
        return level.derivedMany.level;
      } else {
        return level;
      }
    }
  };



})();
