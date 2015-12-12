( function () {
	"use strict";

	LAY.$formation2fn = {
		none: function ( f , filteredLevel, filteredLevelS, fargs ) {
			return [ undefined, undefined ];
		},
		onebelow: function ( f, filteredLevel, filteredLevelS, fargs ) {
			return [
				undefined,
				fargs.gap === 0 ? 
					LAY.take(filteredLevelS[ f - 2 ].path(), "bottom") :
					LAY.take(filteredLevelS[ f - 2 ].path(), "bottom").add(
					fargs.gap)
			];
		},
		totheright: function ( f, filteredLevel, filteredLevelS, fargs ) {
			return [
				fargs.gap === 0 ? 
					LAY.take(filteredLevelS[ f - 2 ].path(), "right") :
					LAY.take(filteredLevelS[ f - 2 ].path(), "right").add(
					fargs.gap),
				undefined
			];
		},

		grid: function ( f, filteredLevel, filteredLevelS, fargs ) {
			var numCols = fargs.columns;
			var vgap = fargs.vgap;
			var hgap = fargs.hgap;
			var x,y;
			if ( f > numCols && ( ( f % numCols === 1 ) || numCols === 1 ) ) {
				x = LAY.take( filteredLevelS[ 0 ].path(), "left" );
			} else {
				x = LAY.take( filteredLevelS[ f - 2 ].path(), "right" ).add(hgap);
			}
			if ( f <= numCols ) {
				y = undefined;
			} else {
				y = LAY.take( filteredLevelS[ f - numCols -  1 ].path(),
					"bottom" ).add(vgap);
			}
			return [ x, y ];
		}
	};
})();