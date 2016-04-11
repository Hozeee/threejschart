'use strict';

var gulp = require('gulp');  // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var chalk = require('chalk'); // Allows for coloring for logging
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process

var eslint = require('gulp-eslint');
var sassLint = require('gulp-sass-lint');
var sass = require('gulp-sass');

gulp.task('watch', function() {
	gulp.watch('source/scss/**/*.scss', ['sasslint' , 'sass-compile']);
	gulp.watch('source/js/module/**/*.js', ['eslint' , 'js']);
})
;
// Configuration for Gulp
var config = {
	js: {
		src: './source/js/module/source.js',
		watch: './source/js/**/*',
		outputDir: './build/js/',
		outputFile: 'app.js'
	}
};

// Error reporting function
function mapError(err) {
	if (err.fileName) {
		// Regular error
		gutil.log(chalk.red(err.name)
			+ ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
			+ ': ' + 'Line ' + chalk.magenta(err.lineNumber)
			+ ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
			+ ': ' + chalk.blue(err.description));
	} else {
		// Browserify error..
		gutil.log(chalk.red(err.name)
			+ ': '
			+ chalk.yellow(err.message));
	}
}

// Completes the final file outputs
function bundle(bundler) {
	var bundleTimer = duration('Javascript bundle time');

	bundler
		.bundle()
		.on('error', mapError) // Map error reporting
		.pipe(source('main.js')) // Set source name
		.pipe(buffer()) // Convert to gulp pipeline
		.pipe(rename(config.js.outputFile)) // Rename the output file
		.pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
		.pipe(sourcemaps.write('./map')) // Set folder for sourcemaps to output to
		.pipe(gulp.dest(config.js.outputDir)) // Set the output folder
		.pipe(notify({
			message: 'Generated file: <%= file.relative %>',
		})) // Output the file being created
		.pipe(bundleTimer);
}

gulp.task('watch-js', function() {
	var args = merge(watchify.args, {debug: true});

	var bundler = browserify(config.js.src, args) // Browserify
		.plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']})
		.transform(babelify, {presets: ['es2015', 'react']});

	bundle(bundler);

	bundler.on('update', function () {
		bundle(bundler);
	});
});

gulp.task('js', function() {
	var args = merge(watchify.args, { debug: true });

	var bundler = browserify(config.js.src, args)
		.transform(babelify, {presets: ['es2015', 'react']});

	bundle(bundler);
});

gulp.task('eslint', function() {
	return gulp.src(config.js.src)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('sasslint', function() {
	return gulp.src(['source/scss/**/*.scss', '!source/scss/vendor/**/*.scss'])
		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
});

gulp.task('sass-compile', function() {
	return gulp.src('source/scss/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('watch-sass', function () {
	return gulp.watch('source/scss/**/*.scss', ['sasslint' , 'sass-compile']);
});

gulp.task('sass', ['sasslint', 'sass-compile']);
