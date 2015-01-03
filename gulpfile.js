var gulp = require( 'gulp' );
var concat = require( 'gulp-concat' );




var js_fileS = [ "./src/entry.js", "./src/obj/*.js", "./src/helper/*.js", "./src/method/*.js" ];

gulp.task( 'concat', function() {

	gulp.src( js_fileS )
	.pipe( concat( "laid.js" ) )
	.pipe( gulp.dest( "./" ) );

});



gulp.task('default', function() {
    gulp.watch( js_fileS,  [ 'concat' ] );
});
