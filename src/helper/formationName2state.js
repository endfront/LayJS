( function () {
	"use strict";

	LAID.$formationName2state = {
		"onebelow": {
			onlyif: LAID.take( "*", "formation" ).eq( "onebelow" ).and(
				LAID.take("", "$f").gt(1)),
			
			props: {
				top: LAID.take("*", "$filtered").queryFetch(
					LAID.take("", "$f").subtract(1), "bottom"
					).add(LAID.take("*", "args.onebelow.gap" )),
			}
		},
		"totheright": {
			onlyif: LAID.take( "*", "formation" ).eq( "totheright" ).and(
				LAID.take("", "$f").gt(1)),
			
			props: {
				left: LAID.take("*", "$filtered").queryFetch(
					LAID.take("", "$f").subtract(1), "right"
					).add(LAID.take("*", "args.totheright.gap" )),
			}
		},
		"grid": {
			onlyif: LAID.take( "*", "formation" ).eq( "grid" ).and(
				LAID.take("", "$f").gt(1)),
			
			props: {
				left: 
					LAID.take(function(){
						var f = this.attr("$f");
						var numColumns = this.many().attr("args.grid.columns");
						var newRow = ! ( ( f - 1 ) % numColumns );
						var hgap = this.many().attr("args.grid.hgap");

						if ( ( f === 2 ) && !newRow ) {
							return this.many().filter().fetch(
								1, "right" ) + hgap;
						} else if ( newRow ) {
							return 0;
						} else {
							return this.many().filter().fetch( 
								f - 1, "formation:totheright.right" ) + hgap;
						
						}
					}).fn( LAID.take("*", "$filtered" ) ),
				top:
					LAID.take(function(){
						var f = this.attr("$f");
						var numColumns = this.many().attr("args.grid.columns");
						var nthRow =  Math.floor( f  / numColumns );
						var vgap = this.many().attr("args.grid.vgap");

						return this.many.filter().fn(function( curRow ){
							return curRow
						})
						
					}).fn( LAID.take("*", "$filtered" ) )

			}
		}
	};
})();