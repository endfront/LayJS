(function () {
  "use strict";

  LAID.RelPath = function ( relativePath ) {


    if ( ( relativePath === "this" ) || ( relativePath === "" ) ) {

      this.me = true;

    } else {

      this.me = false;
      if ( relativePath[ 0 ] === "/" ) {
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


  LAID.RelPath.prototype.resolve = function ( referenceLevel ) {

    if ( this.me ) {
      return referenceLevel;
    } else {
      if ( this.absolute ) {
          return LAID.$path2level[ this.absolutePath ];
      } else {
        for ( var i = 0; i < this.numberOfParentTraversals; ++i && (referenceLevel = referenceLevel.parentLevel ) ) {
        }

          return ( this.childPath === "" ) ? referenceLevel :
              LAID.$path2level[ referenceLevel.path +
              ( ( referenceLevel.path === "/" ) ? "" : "/" )+
              this.childPath ];
      }
    }
  };



})();
