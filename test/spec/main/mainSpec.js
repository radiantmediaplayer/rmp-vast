'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

const { Builder, By, until } = require('../../../node_modules/selenium-webdriver/');
const WAITTIMEOUT = 120000;

var testUrls = [
	'http://localhost/rmp-vast/test/AdPodNoStandaloneSpec.html',
	'http://localhost/rmp-vast/test/AdPodWithStandaloneSpec.html',
	'http://localhost/rmp-vast/test/EmptySpec.html',
	'http://localhost/rmp-vast/test/LinearMutedAutoplaySpec.html',
	'http://localhost/rmp-vast/test/LinearSpec.html',
	'http://localhost/rmp-vast/test/LinearVAST2Spec.html',
	'http://localhost/rmp-vast/test/MalformedSpec.html',
	'http://localhost/rmp-vast/test/MaximumRedirectSpec.html',
	'http://localhost/rmp-vast/test/NonLinearSpec.html',
	'http://localhost/rmp-vast/test/RedirectRedirectSpec.html',
	'http://localhost/rmp-vast/test/RedirectSpec.html',
	'http://localhost/rmp-vast/test/SkippableSpec.html',
	'http://localhost/rmp-vast/test/SmartAdServerSpec.html',
	'http://localhost/rmp-vast/test/TwoLinearSpec.html',
	'http://localhost/rmp-vast/test/VPAIDSpec.html'
];

var driver = new Builder()
	.forBrowser('chrome')
	.build();

var _runNewTestUrl = function (index) {
	it('should run test ' + index, (done) => {
		console.log('\n-----------------------');
		console.log('Now running test ' + index);
		console.log('Requesting test URL ' + testUrls[index]);
		driver.get(testUrls[index]).then(() => {
			driver.wait(until.elementIsVisible(driver.findElement(By.id('test-results'))), WAITTIMEOUT)
				.then(() => {
					console.log('Testing result for ' + testUrls[index] + ': SUCCESS');
					if (index === testUrls.length - 1) {
						driver.quit();
					}
					done();
				})
				.catch(() => {
					if (index === testUrls.length - 1) {
						driver.quit();
					}
					done.fail();
				});
		});
	});
};

describe('Start selenium testing and report', () => {
	for (let i = 0, len = testUrls.length; i < len; i++) {
		_runNewTestUrl(i);
	}
});