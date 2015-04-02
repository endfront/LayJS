( function () {
	"use strict";

	LAID.formation = function ( name, state ) {
		state.onlyif = LAID.take("*", "formation").eq( name ).and(
			LAID.take("", "$f").gt(1));

		LAID.$formationName2state[ name ] = state;

	};




})();