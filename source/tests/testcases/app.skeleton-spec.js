jasmine.getFixtures().fixturesPath = '/base/source/tests/testfixtures/';

/* eslint no-underscore-dangle: 0 */
describe('Karma example test', function () {
	'use strict';

	var app = window.App,
		$testFixture = null;

	beforeEach(function () {
		loadFixtures('test.html');
		$testFixture = $('#test-element');
	});

	it('Test fixture is in the DOM', function () {
		expect($testFixture).toBeInDOM();
	});

	it('Test application existence', function() {
		expect(app).not.toBe(undefined);
	});

});
