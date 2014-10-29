(function () {
  "use strict";

  var RelPath = function ( relativePath ) {


    if ( relativePath === "this" ) {

      this.me = true;

    } else {

      this.me = false;
    this.numberOfParentTraversals = relativePath.match(/^(..\/)*/)[0].length / 3;
    // strip off the "../"s
    this.childPath = this.numberOfParentTraversals === 0 ? relativePath : relativePath.substring( this.numberOfParentTraversals * 3 );
  }

};

RelPath.prototype.resolve = function ( referenceLevel ) {

  if ( this.me ) {

    return referenceLevel;

  } else {

    for ( var i = 0; i < this.numberOfParentTraversals; ++i && (referenceLevel = referenceLevel.parent ) ) {

    }

    return LSON.$path2level[ referenceLevel.path + this.childPath ];

  }

};


LSON.RelPath = RelPath;

})();
