( function () {
	"use strict";

	LAY.formation = function ( name, fargs, fn ) {
    	LAY.$formation2fargs[ name ] = fargs;
			LAY.$formation2fn[ name ] = fn;
	};

})();