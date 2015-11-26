( function () {
	"use strict";

	LAY.formation = function ( name, fn ) {
		LAY.$formationName2fn[ name ] = fn;

	};

})();