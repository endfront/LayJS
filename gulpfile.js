var gulp = require( 'gulp' );
var concat = require( 'gulp-concat' );




var js_fileS = [
	"./src/entry.js",
	"./src/obj/*.js",
	"./src/method/*.js",
	"./src/helper/*.js"
];

gulp.task( 'concat', function() {

	gulp.src( js_fileS )
	.pipe( concat( "LAID.js" ) )
	.pipe( gulp.dest( "./" ) );

});



gulp.task('default', function() {
    gulp.watch( js_fileS,  [ 'concat' ] );
});
