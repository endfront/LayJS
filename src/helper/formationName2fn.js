( function () {
	"use strict";

	LAY.$formationName2fn = {
		onebelow: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.$setFormationXY( undefined,
				LAY.take(filteredLevelS[ f - 2 ].pathName, "bottom").add(
					LAY.take("*", "fargs.onebelow.gap")) );
		},
		totheright: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.$setFormationXY(
				LAY.take(filteredLevelS[ f - 2 ].pathName, "right").add(
					LAY.take("*", "fargs.totheright.gap")),
					undefined );
		}
	};
})();