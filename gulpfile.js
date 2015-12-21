var
	gulp = require( 'gulp' ),
	concat = require( 'gulp-concat' ),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	fs = require('fs'),
	semver = require("semver"),
	curVersion = fs.readFileSync("version.txt").toString().trim();

if ( !semver.valid(curVersion) ) {
	console.error("ERROR: current version within version.txt is invalid: " + curVersion );
	return 1;
}

var js_fileS = [
	"./src/entry.js",
	"./src/obj/*.js",
	"./src/method/*.js",
	"./src/helper/*.js"
];

gulp.task("concat", function() {

	gulp.src( js_fileS )
	.pipe( concat( "LAY.js" ) )
	.pipe( replace("<version>", curVersion))
	.pipe( gulp.dest( "./" ))
	.pipe( concat("LAY.min.js"))
	.pipe(uglify({
			preserveComments: "license"
		}))
	.pipe(gulp.dest("./"))

	
});


/*gulp.task("minify", [ "concat" ], function() {

	gulp.src("LAY.js").pipe(
		concat("LAY.min.js")
		).pipe( uglify({
			preserveComments: "license"
		})
		).pipe( gulp.dest("./") );

});*/



gulp.task('default', function() {
  gulp.watch( js_fileS,  [ "concat" ] );
//  gulp.watch( "LAY.js",  [ "minify" ] );
  gulp.start( "concat" );

});

