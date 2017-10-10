'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

const { Builder, By, until } = require('../../../node_modules/selenium-webdriver/');
const WAITTIMEOUT = 120000;
const pathToTest = 'http://localhost/rmp-vast/test/';

var testUrls = [
	pathToTest + 'AdPodNoStandaloneSpec.html',
	pathToTest + 'AdPodWithStandaloneSpec.html',
	pathToTest + 'EmptySpec.html',
	pathToTest + 'ErrorMediaSpec.html',
	pathToTest + 'IABVAST2Spec.html',
	pathToTest + 'IABVAST3RedirectSpec.html',
	pathToTest + 'IABVAST3Spec.html',
	pathToTest + 'ImaInlineLinearSpec.html',
	pathToTest + 'ImaRedirectLinearSpec.html',
	pathToTest + 'LinearMutedAutoplaySpec.html',
	pathToTest + 'LinearSpec.html',
	pathToTest + 'LinearVAST2Spec.html',
	pathToTest + 'MalformedSpec.html',
	pathToTest + 'MaximumRedirectSpec.html',
	pathToTest + 'NonLinearSpec.html',
	pathToTest + 'NonLinearSpecIABVAST2Spec.html',
	pathToTest + 'NonLinearSpecIABVAST3Spec.html',
	pathToTest + 'RedirectRedirectSpec.html',
	pathToTest + 'RedirectSpec.html',
	pathToTest + 'SkippableSpec.html',
	pathToTest + 'SmartAdServerSpec.html',
	pathToTest + 'ThreeConsecutiveWithErrorLinearSpec.html',
	pathToTest + 'TwoConsecutiveLinearSpec.html',
	pathToTest + 'VPAIDSpec.html'
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