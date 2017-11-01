'use strict';

const TEST = require('../helpers/test');

var testUrls = [
	TEST.pathToTest + 'vpaidSpec/vpaid-fails-loading-js.html',
	TEST.pathToTest + 'vpaidSpec/vpaid-flash.html',
	TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-1-interaction.html',
	TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-1.html',
	TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-2.html',
	TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-3-api.html',
	TEST.pathToTest + 'vpaidSpec/vpaid-js-redirect.html'
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