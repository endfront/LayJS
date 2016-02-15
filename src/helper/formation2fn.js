( function () {
	"use strict";

	LAY.$formation2fn = {
		none: function ( f , filteredLevel, filteredLevelS, fargs ) {
			return [ undefined, undefined ];
		},
		vertical: function ( f, filteredLevel, filteredLevelS, fargs ) {
			return [
				undefined,
				fargs.gap === 0 ? 
					LAY.take(filteredLevelS[ f - 2 ].path(), "bottom") :
					LAY.take(filteredLevelS[ f - 2 ].path(), "bottom").add(
					fargs.gap)
			];
		},
		horizontal: function ( f, filteredLevel, filteredLevelS, fargs ) {
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
		},
		circular: function ( f, filteredLevel, filteredLevelS, fargs) {
		    var angle = ( (f-1) * ( 360 / filteredLevelS.length ) ) - 90;
		    var firstLevelPathName = filteredLevelS[ 0 ].path();
		    var originX = LAY.take(firstLevelPathName, "centerX");
		    var originY = LAY.take(firstLevelPathName, "centerY").add(
		      fargs.radius );
		    var degreesToRadian = Math.PI / 180;
		    var paramX = fargs.radius * Math.cos(angle*degreesToRadian);
		    var paramY = fargs.radius * Math.sin(angle*degreesToRadian);

		    return [originX.add(paramX).minus(
		      LAY.take("", "width").half()),
		       originY.add(paramY).minus(LAY.take("", "height").half())];

		  }

	};
})();