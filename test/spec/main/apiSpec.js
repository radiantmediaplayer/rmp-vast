'use strict';

const TEST = require('../helpers/test');

var testUrls = [
	TEST.pathToTest + 'apiSpec/ThreeConsecutiveWithErrorLinearSpec.html',
	TEST.pathToTest + 'apiSpec/TwoConsecutiveLinearSpec.html'
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