(function () {
  "use strict";

  LAY.RelPath = function ( relativePath ) {


    this.isMe = false;
    this.isMany = false;
    this.path = "";
    this.isAbsolute = false;
    this.traverseArray = [];

    if ( relativePath === "" || relativePath === "." ||
      relativePath === "./" ) {
      this.isMe = true;
    } else {
      if ( relativePath.charAt(0) === "/" ) {
        this.isAbsolute = true;
        this.path = relativePath;
      } else {
        var i=0;
        while ( i !== relativePath.length - 1 &&
          ( relativePath.charAt( i ) === "." ||
          relativePath.charAt( i ) === "~" ) ) {
          if ( relativePath.slice(i, i+3) === "../" ) {
            this.traverseArray.push(0);
            i +=3;
          } else if ( relativePath.slice(i, i+2) === "~/" ) {
            this.traverseArray.push(1);
            i += 2;
          } else if ( relativePath.slice(i, i+4) === ".../" ) {
            this.traverseArray.push(2);
            i += 4;
          } else {
            throw "LAY Error: Error in Take path: " + relativePath;
          }
        }
        // strip off the "../"s
        // eg: "~/../.../Body" should become "Body"
        this.path = relativePath.slice( i );
      }
      if ( this.path.length !== 0 &&
          this.path.lastIndexOf("~") === this.path.length - 1 ) {
        this.isMany = true;
        if ( this.path.length === 1 ) {
          this.path = "";
        } else {
          this.path = this.path.slice(0, this.path.length-2);
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
        var traverseArray = this.traverseArray;

        for ( var i=0, len=traverseArray.length; i<len; i++ ) {
          if ( traverseArray[ i ] === 0 ) { //parent traversal
            level = level.parentLevel;
          } else if ( traverseArray[ i ] === 1 ) { //closest row traversal
            do {
              level = level.parentLevel;
            } while ( !level.derivedMany );
          } else {
            do {
              level = level.parentLevel;
              if ( !level ) {
                throw "No View Found (.../) from level " +
                  referenceLevel.pathName;
              }
            } while ( !level.isView );
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
