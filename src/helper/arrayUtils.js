( function () {
  "use strict";

  LAY.$arrayUtils = {
    /*
    * Add to array if element does not exist already
    * Return true the element was added (as it did not exist previously)
    */
    pushUnique: function ( elementS, element ) {
      if ( elementS.indexOf( element ) === -1  ) {
        elementS.push( element );
        return true;
      }
      return false;
    },

    /* Prepend element, if preset already then remove and prepend */
    prependUnique: function ( elementS, element ) {
      LAY.$arrayUtils.remove( elementS, element );
      elementS.unshift( element );
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
    removeAtIndex: function ( elementS, ind ) {
      elementS.splice( ind, 1 );

    },



    /* Clone array at a single level */
    cloneSingleLevel: function ( elementS ) {
      return elementS.slice( 0 );
      
    },

    /*Swap element at index a with index b */
    swap: function ( elementS, a, b ) {
      var tmp = elementS[ a ];
      elementS[ a ] = elementS[ b ];
      elementS[ b ] = tmp;
    }

  };





})();
