(function () {
  "use strict";

  LAY.RelPath = function ( relativePath ) {


    this.me = false;
    this.many = false;

    if  ( relativePath === "" ) {
      this.me = true;

    } else if ( 
      ( relativePath === "*" ) ||
      ( relativePath === "many" ) ) { 
      this.many = true;

    } else {
      if ( relativePath.charAt(0) === "/" ) {
        this.absolute = true;
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

    if ( this.me ) {
      return referenceLevel;
    } else if ( this.many ) { 
      return referenceLevel.derivedMany.level;
    } else {
      if ( this.absolute ) {
          return LAY.$pathName2level[ this.absolutePath ];
      } else {
        for ( var i = 0; i < this.numberOfParentTraversals;
         ++i && (referenceLevel = referenceLevel.parentLevel ) ) {
        }

          return ( this.childPath === "" ) ? referenceLevel :
              LAY.$pathName2level[ referenceLevel.pathName +
              ( ( referenceLevel.pathName === "/" ) ? "" : "/" )+
              this.childPath ];
      }
    }
  };



})();
