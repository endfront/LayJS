(function () {
  "use strict";

  LAID.RelPath = function ( relativePath ) {


    if ( relativePath === "this" ) {

      this.me = true;

    } else {

      this.me = false;
      if ( relativePath[ 0 ] === "/" ) {
        this.absolute = true;
        this.absolutePath = relativePath;
      } else {
        this.absolute = false;
      this.numberOfParentTraversals = relativePath.match(/^(..\/)*/)[0].length / 3;
      // strip off the "../"s
      this.childPath = this.numberOfParentTraversals === 0 ? relativePath : relativePath.substring( this.numberOfParentTraversals * 3 );
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

      for ( var i = 0; i < this.numberOfParentTraversals; ++i && (referenceLevel = referenceLevel.parent ) ) {

      }

      return LAID.$path2level[ referenceLevel.path + this.childPath ];
    }

  }

};



})();
