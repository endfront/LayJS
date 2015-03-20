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
							return this.$many.filter().fetch(
								1, "bottom" );
						} else {
							console.log(this.$many.filter().fetch( 
								i - 1, "formation:onebelow.bottom" ));
							return LAID.filter( rows ).fetch( 
								i - 1, "formation:onebelow.bottom" );
						}

					}).fn( LAID.take("*", "all" ) ).add( 
				 	LAID.take("*", "data.formationGap")),
			}
		},
		"totheright": {
			onlyif: LAID.take( "*", "formation" ).eq( "totheright" ).and(
				LAID.take("", "$i").neq(1)),
		
			props: {
				right: LAID.take( "*", "rows" ).filterFetch( 
					LAID.take("", "$i").subtract(1),
					"formation:totheright.right"
				 ).add(LAID.take("*", "data.formationGap")),
			}
		},
	};
})();