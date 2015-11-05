( function () {
	"use strict";

	LAID.$formationName2fn = {
		onebelow: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.setFormationXY( undefined,
				LAID.take(filteredLevelS[ f - 2 ].path, "bottom").add(
					LAID.take("*", "args.onebelow.gap")) );
		},
		totheright: function ( f, filteredLevel, filteredLevelS ) {
			filteredLevel.setFormationXY(
				LAID.take(filteredLevelS[ f - 2 ].path, "right").add(
					LAID.take("*", "args.totheright.gap")),
					undefined );
		}
	};
})();