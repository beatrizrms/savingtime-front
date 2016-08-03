var gulp       = require('gulp');
var sass       = require('gulp-sass');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
	gulp.src('0-general/style.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./'));
});

gulp.task('liveReload', function() {
	gulp.src(['index.html'])
	.pipe(livereload());
});

gulp.task('watch', ['sass'], function() {
	//livereload.listen({quiet: true});
	gulp.watch(['**/*.scss', '!./node_modules/**/*.*'], ['sass']);
	//gulp.watch(['**/*.html', '**/*.css', '**/*.js', '!./node_modules/**/*.*'], ['liveReload']);
});
