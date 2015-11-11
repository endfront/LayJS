( function () {
	"use strict";

	LAID.$formationName2fn = {
		onebelow: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.$setFormationXY( undefined,
				LAID.take(filteredLevelS[ f - 2 ].pathName, "bottom").add(
					LAID.take("*", "fargs.onebelow.gap")) );
		},
		totheright: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.$setFormationXY(
				LAID.take(filteredLevelS[ f - 2 ].pathName, "right").add(
					LAID.take("*", "fargs.totheright.gap")),
					undefined );
		}
	};
})();