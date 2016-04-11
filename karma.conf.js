module.exports = function (config) {
	config.set({
		basePath: '',

		frameworks: ['browserify', 'jasmine'],

		files: [
			'source/tests/testlibs/jquery-2.1.4.js',
			'source/tests/testlibs/jasmine-jquery.js',
			'source/tests/testfixtures/*.html',
			'source/js/module/**/*.js',
			'source/tests/testcases/*.js'
		],

		exclude: [],

		browserify: {
			debug: true,
			transform: ['babelify', 'stringify']
		},

		preprocessors: {
			'source/js/module/**/*.js': ['browserify'],
			'source/tests/testcases/*.js': ['browserify']
		},

		reporters: ['progress'],

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		autoWatch: true,

		browsers: ['PhantomJS'],

		singleRun: false,

		concurrency: Infinity
	})
};
