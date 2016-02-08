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
	console.error("ERROR: current version within version.txt is invalid: " +
		curVersion );
	return 1;
}

var js_fileS = [
	"./src/entry.js",
	"./src/obj/*.js",
	"./src/method/*.js",
	"./src/helper/*.js"
];

gulp.task("build", function() {
	gulp.src( js_fileS )
	.pipe( concat( "LAY.js" ) )
	.pipe( replace("<version>", curVersion))
	.pipe( gulp.dest( "./" ))
	.pipe( concat("LAY.min.js"))
	.pipe( uglify({
			preserveComments: "license"
		}))
	.pipe(gulp.dest("./"))
});

gulp.task("test", function() {
	require("child_process").execSync("cd test/nondisplay; node runner.js");
});



gulp.task('default', function() {
  gulp.watch( js_fileS,  [ "build" ] );
  gulp.start( "build" );

});
