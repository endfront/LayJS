( function () {
	"use strict";

	LAID.$formationName2state = {
		"onebelow": {
			onlyif: LAID.take( "*", "formation" ).eq( "onebelow" ).and(
				LAID.take("", "$i").neq(1)),
			
			props: {
				top: 
					LAID.take(function(){
						var i = this.attr("$i");
						if ( i === 2 ) {
							return this.many().query().fetch(
								1, "bottom" );
						} else {
	
							return this.many().query().fetch( 
								i - 1, "formation:onebelow.bottom" );
						}

					}).fn( LAID.take("*", "all" ) ).add( 
				 	LAID.take("*", "args.onebelow.gap")),
			}
		},
		"totheright": {
			onlyif: LAID.take( "*", "formation" ).eq( "totheright" ).and(
				LAID.take("", "$i").neq(1)),
			
			props: {
				left: 
					LAID.take(function(){
						var i = this.attr("$i");
						if ( i === 2 ) {
							return this.many().query().fetch(
								1, "right" );
						} else {
	
							return this.many().query().fetch( 
								i - 1, "formation:totheright.right" );
						}

					}).fn( LAID.take("*", "all" ) ).add( 
				 	LAID.take("*", "args.totheright.gap")),
			}
		},
		"grid": {
			onlyif: LAID.take( "*", "formation" ).eq( "grid" ).and(
				LAID.take("", "$i").neq(1)),
			
			props: {
				left: 
					LAID.take(function(){
						var i = this.attr("$i");
						var numColumns = this.many().attr("args.grid.columns");
						var newRow = ! ( ( i - 1 ) % numColumns );
						var hgap = this.many().attr("args.grid.hgap");

						if ( ( i === 2 ) && !newRow ) {
							return this.many().filter().fetch(
								1, "right" ) + hgap;
						} else if ( newRow ) {
							return 0;
						} else {
							return this.many().filter().fetch( 
								i - 1, "formation:totheright.right" ) + hgap;
						
						}
					}).fn( LAID.take("*", "all" ) ),
				top:
					LAID.take(function(){
						var i = this.attr("$i");
						var numColumns = this.many().attr("args.grid.columns");
						var nthRow =  Math.floor( i  / numColumns );
						var vgap = this.many().attr("args.grid.vgap");

						return this.many.filter().fn(function( curRow ){
							return curRow
						})
						
					}).fn( LAID.take("*", "all" ) )

			}
		}
	};
})();