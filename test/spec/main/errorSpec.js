'use strict';

const TEST = require('../helpers/test');

var testUrls = [
	TEST.pathToTest + 'errorSpec/AdPodNoStandaloneSpec.html',
	TEST.pathToTest + 'errorSpec/EmptySpec.html',
	TEST.pathToTest + 'errorSpec/ErrorMediaSpec.html',
	TEST.pathToTest + 'errorSpec/MalformedSpec.html',
	TEST.pathToTest + 'errorSpec/no-impression-tag.html',
	TEST.pathToTest + 'errorSpec/VMAPSpec.html'
];

var intialTime = TEST.getTime();
var index = 0;
var driver = TEST.getDriver('chrome');
let count = 0;

var _run = function () {
	console.log('Run HTML spec ' + testUrls[index] + ' at: ' +
		(TEST.getTime() - intialTime) + 'ms');
	var p = TEST.loadHTMLSpec(driver, testUrls[index]);
	p.then(() => {
		if (index === testUrls.length - 1) {
			driver.quit();
			if (count === TEST.driverCount - 1) {
			} else {
				if (count === 0) {
					driver = TEST.getDriver('firefox');
					index = 0;
					count++;
					_run();
				} else if (count === 1) {
					driver = TEST.getDriver('MicrosoftEdge');
					index = 0;
					count++;
					_run();
				}
			}
			return;
		}
		index++;
		_run();
	}).catch(() => {
		driver.quit();
	});
};

_run();