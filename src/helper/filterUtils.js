( function () {
	"use strict";

	LAID.$filterUtils = {
		eq: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) === val;
				}, partLevelS );
		},
		
		neq: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) !== val;
				}, partLevelS );
			
		},
		gt: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) > val;
				}, partLevelS );
			
		},
		gte: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr )>= val;
				}, partLevelS );
			
		},
		lt: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ) < val;
				}, partLevelS );
			
		},
		lte: function ( partLevelS, attr, val ) {
			return  filter( function ( partLevel ) {
					return partLevel.attr( attr ) <= val;
				}, partLevelS );
			
		},
		regex: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return val.test( partLevel.attr( attr ) );
				}, partLevelS );
			
		},
		contains: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return partLevel.attr( attr ).indexOf( val ) !== -1;
				}, partLevelS );
			
		},
		within: function ( partLevelS, attr, val ) {
			return filter( function ( partLevel ) {
					return val.indexOf( partLevel.attr( attr ) ) !== -1;
				}, partLevelS );
			
		},

		fn: function ( partLevelS, fnFilter ) {
			return filter( fnFilter , partLevelS );
			
		}
		

	};

	function filter ( fnFilter, partLevelS ) {
		var filteredPartLevelS = [];
		for ( var i = 0, len = partLevelS.length, partLevel; i < len; i++ ) {
			partLevel = partLevelS[ i ];
			if ( fnFilter( partLevel ) ) {
				filteredPartLevelS.push( partLevel );
			} 
		}
		return filteredPartLevelS;
	}

})();
