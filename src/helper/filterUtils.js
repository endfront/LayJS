( function () {
	"use strict";

	LAY.$filterUtils = {
		eq: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] === val;
				}, rowS );
		},
		
		neq: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] !== val;
				}, rowS );
		},

		gt: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] > val;
				}, rowS );
			
		},
		
		gte: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] >= val;
				}, rowS );
			
		},
		lt: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] < val;
				}, rowS );
			
		},
		lte: function ( rowS, key, val ) {
			return  filter( function ( row ) {
					return row[ key ] <= val;
				}, rowS );
			
		},
		regex: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return val.test( row[ key ] );
				}, rowS );
			
		},
		contains: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ].indexOf( val ) !== -1;
				}, rowS );
			
		},
		within: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return val.indexOf( row[ key ] ) !== -1;
				}, rowS );
			
		},

		fn: function ( rowS, fnFilter ) {
			return filter( fnFilter , rowS );
		}
		

	};

	function filter ( fnFilter, rowS ) {
		var filteredRowS = [];
		for ( var i = 0, len = rowS.length, row; i < len; i++ ) {
			row = rowS[ i ];
			if ( fnFilter( row ) ) {
				filteredRowS.push( row );
			} 
		}
		return filteredRowS;
	}

})();
