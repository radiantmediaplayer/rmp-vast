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