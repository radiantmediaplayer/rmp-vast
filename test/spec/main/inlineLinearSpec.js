'use strict';

const TEST = require('../helpers/test');

var testUrls = [
	TEST.pathToTest + 'inlineLinearSpec/AdPodWithStandaloneSpec.html',
	TEST.pathToTest + 'inlineLinearSpec/IABVAST2Spec.html',
	TEST.pathToTest + 'inlineLinearSpec/IABVAST3Spec.html',
	TEST.pathToTest + 'inlineLinearSpec/ImaInlineLinearSpec.html',
	TEST.pathToTest + 'inlineLinearSpec/LinearMutedAutoplaySpec.html',
	TEST.pathToTest + 'inlineLinearSpec/SkippableSpec.html',
	TEST.pathToTest + 'inlineLinearSpec/SmartAdServerSpec.html'
];

var intialTime = TEST.getTime();
var index = 0;
var driver = TEST.getDriver();

var retry = true;

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
		if (retry) {
			retry = false;
			setTimeout(() => {
				console.log('Retry');
				_run();
			}, 1000);
			return;
		}
		driver.quit();
	});
};

_run();