( function () {
	"use strict";

	LAID.$filterUtils = {
		eq: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val === curVal;
				}, rowsWrapper.rows )
			}
		},
		neq: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val !== curVal;
				}, rowsWrapper.rows )
			}
		},
		gt: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val > curVal;
				}, rowsWrapper.rows )
			}
		},
		gte: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val >= curVal;
				}, rowsWrapper.rows )
			}
		},
		lt: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val < curVal;
				}, rowsWrapper.rows )
			}
		},
		lte: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val <= curVal;
				}, rowsWrapper.rows )
			}
		},
		regex: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val.test( curVal );
				}, rowsWrapper.rows )
			}
		},
		contains: function ( rowsWrapper, val ) {
			return {
				level: rowsWrapper.level,
				rows: filter( function ( curVal ) {
					return val.indexOf( curVal ) !== -1;
				}, rowsWrapper.rows )
			}
		},
		fn: function ( rowsWrapper, fnFilter ) {
			return {
				level: rowsWrapper.level,
				rows: filter( fnFilter , rowsWrapper.rows )
			}
		},
		fetch: function ( rowsWrapper, index, attr ) {
			var 
		    row = rowsWrapper.rows[ index - 1 ],
	      many = rowsWrapper.level.$many,
        id = many.$id,
        idVal = row[ id ];

			return many.$id2level[ idVal ].$getAttrVal( attr ).calcVal;

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
