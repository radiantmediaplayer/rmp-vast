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