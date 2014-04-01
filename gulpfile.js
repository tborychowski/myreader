var gulp = require('gulp'),
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	stylus = require('gulp-stylus'),
	jshint = require('gulp-jshint'),
	watch = require('gulp-watch'),
	_path = {
		src: 'web-src',
		dest: 'public',
		js:  { src: 'web-src/js',    dest: 'public/js', lib: 'web-src/js/jquery/*.js' },
		css: { src: 'web-src/styl/', dest: 'public/css' }
	};

gulp.task('lib', function () { return gulp.src(_path.js.lib).pipe(concat('lib.js')).pipe(gulp.dest(_path.js.dest)); });

gulp.task('lint', function() {
	return gulp.src([ _path.js.src + '/**/*.js', '!' + _path.js.lib ])
		.pipe(jshint(_path.js.src + '/.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('app', function () {
	return gulp.src([ _path.js.src + '/app/*.js', _path.js.src + '/modules/*.js' ])
		// .pipe(jshint(_path.js.src + '/.jshintrc'))
		// .pipe(jshint.reporter('jshint-stylish'))
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest(_path.js.dest));
});


gulp.task('styl', function () {
	return gulp.src([
			_path.css.src + '/common.styl',
			_path.css.src + '/modules/*.styl',
			_path.css.src + '/responsive.styl'
		])
		.pipe(stylus({ paths: [ _path.css.src ], set: ['compress'] }))
		.pipe(concat('style.css'))
		.pipe(gulp.dest(_path.css.dest));
});


gulp.task('watch', function () {
	gulp.watch(_path.js.src + '/**/*.js',    [ 'app',  ]);
	gulp.watch(_path.css.src + '/**/*.styl', [ 'styl' ]);
});


gulp.task('default', [ 'app', 'lib', 'styl' ]);
