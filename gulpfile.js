// -----------------------------------------------------------
var gulp 			= require('gulp'),
	browserify 		= require('gulp-browserify'),
	concat			= require('gulp-concat'),
	webserver 		= require('gulp-webserver');
// -----------------------------------------------------------

gulp.task('browserify', function() {
	gulp.src(['js/main.js'])
	.pipe(browserify({
		insertGlobals: true,
		debug: false
	}))
	.on('error', function(error) {
		console.log(error);
		this.emit('end');
	})
//	.pipe(uglify())
	.pipe(concat('app.js'))
	.pipe(gulp.dest('js'));
});

gulp.task('bundle-libs', function() {
  return gulp.src('js/o3djs/*.js')
    .pipe(concat('bundle.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      open: true,
      fallback: 'index.html'
    }));
});

gulp.task('watch', function() {
	gulp.watch('js/**', 		['browserify'	]);
	gulp.watch('js/o3djs/**', 	['bundle-libs'	]);
});

gulp.task('build-all',['browserify','bundle-libs']);
gulp.task('default',['watch', 'webserver']);
