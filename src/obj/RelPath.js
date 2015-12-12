(function () {
  "use strict";

  LAY.RelPath = function ( relativePath ) {


    this.isMe = false;
    this.isMany = false;
    this.isAbsolute = false;
    this.isClosestRow = false;

    if  ( relativePath === "" ) {
      this.isMe = true;

    } else if ( 
      ( relativePath === "*" ) ||
      ( relativePath === "many" ) ) { 
      this.isMany = true;
    } else if ( relativePath.startsWith(".../")) {
      this.isClosestRow = true;
      this.childPath = relativePath.slice(4);
    } else {
      if ( relativePath.charAt(0) === "/" ) {
        this.isAbsolute = true;
        this.absolutePath = relativePath;
      } else {
        this.absolute = false;
        this.numberOfParentTraversals =
         ( relativePath.match( /^(..\/)*/ )[ 0 ].length ) / 3;
        // strip off the "../"s
        // eg: "../../Body" should become "Body"
        this.childPath = this.numberOfParentTraversals === 0 ? relativePath :
         relativePath.substring( (
           (this.numberOfParentTraversals) * 3 ) );

      }
    }

  };


  LAY.RelPath.prototype.resolve = function ( referenceLevel ) {

    if ( this.isMe ) {
      return referenceLevel;
    } else if ( this.isMany ) { 
      return referenceLevel.derivedMany.level;
    } else {
      if ( this.isAbsolute ) {
          return LAY.$pathName2level[ this.absolutePath ];
      } else {
        if ( this.isClosestRow ) {
          while (!referenceLevel.derivedMany ) {
            referenceLevel = referenceLevel.parentLevel;
          }
          if ( referenceLevel === undefined ) {
            throw "LAY Error: Closest row level for */ now found";
          }
        } else {
          for ( var i = 0; i < this.numberOfParentTraversals;
           ++i && (referenceLevel = referenceLevel.parentLevel ) ) {
          }
        }

          return ( this.childPath === "" ) ? referenceLevel :
              LAY.$pathName2level[ referenceLevel.pathName +
              ( ( referenceLevel.pathName === "/" ) ? "" : "/" )+
              this.childPath ];
      }
    }
  };



})();
