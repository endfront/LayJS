( function () {
	"use strict";

	LAID.formation = function ( name, state ) {
		state.onlyif = LAID.take("*", "formation").eq( name ).and(
			LAID.take("", "$i").neq(1));

		LAID.$formationName2state[ name ] = state;

	};




})();