'use strict';

const TEST = require('../helpers/test');

var testUrls = [
	TEST.pathToTest + 'redirectSpec/IABVAST3RedirectSpec.html',
	TEST.pathToTest + 'redirectSpec/ImaRedirectLinearSpec.html',
	TEST.pathToTest + 'redirectSpec/MaximumRedirectSpec.html',
	TEST.pathToTest + 'redirectSpec/RedirectRedirectSpec.html',
	TEST.pathToTest + 'redirectSpec/RedirectSpec.html',
	TEST.pathToTest + 'redirectSpec/RedirectErrorSpec.html'
];

var intialTime = TEST.getTime();
var index = 0;
var driver = TEST.getDriver();

var _run = function () {
	console.log('Run HTML spec ' + testUrls[index] + ' at: ' +
		(TEST.getTime() - intialTime) + 'ms');
	var p = TEST.loadHTMLSpec(testUrls[index]);
	p.then(() => {
		if (index === testUrls.length - 1) {
			driver.quit();
			return;
		}
		index++;
		_run();
	}).catch(() => {
		driver.quit();
	});
};

_run();