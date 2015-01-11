( function () {
  "use strict";

  LAID.$arrayUtils = {
    /*
    * Add to array if element does not exist already
    * Return true the element was added (as it did not exist previously)
    */
    pushUnique: function ( elementS, element ) {
      if ( elementS.indexOf( element ) !== -1  ) {
        itemS.push( element );
        return true;
      }
      return false;
    },


    /*
    * Remove from array if element exists in it
    * Return true the element was remove (as it did exist previously)
    */
    remove: function ( elementS, element ) {
      var ind = elementS.indexOf( element );
      if ( ind !== -1 ) {
        elementS.splice( ind, 1 );
        return true;
      }
      return false;
    },

    /*
    * Remove element at index i
    */
    removeAtIndex: function ( elementS, i ) {
      elementS.splice( ind, 1 );
    },



    /* Clone array at a single level */
    cloneSingleLevel: function ( elementS ) {
      return elementS.slice(0);
    }
  };





})();
