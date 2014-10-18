(function () {
  "use strict";

  var Path = function ( relative_path ) {



    if ( relative_path === "this" ) {

      this.child_path = "";

    } else {


    this.number_of_parent_traversals =  relative_path.match(/^(..\/)*/)[0].length / 3;
    // strip off the "../"s
    this.child_path = this.number_of_parent_traversals === 0 ? relative_path : relative_path.substring( this.number_of_parent_traversals * 3 );


  }



  };

  Path.prototype.resolve = function ( referenceLevel ) {

    for ( var i = 0; i < this.number_of_parent_traversals; ++i && (referenceLevel = referenceLevel.parent ) ) {

    }

    return LSON._path2level[ referenceLevel.path + this.child_path ];


  };


  LSON.Path = Path;

})();
