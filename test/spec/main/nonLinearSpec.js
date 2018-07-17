'use strict';

const TEST = require('../helpers/test');

var driver;
var driverCount = 1;

var testUrls = [
  TEST.pathToTest + 'nonLinearSpec/NonLinearSpecIABVAST3Spec.html'
];

var testUrlsChromeOnly = [
  TEST.pathToTest + 'nonLinearSpec/NonLinearSpec.html',
  TEST.pathToTest + 'nonLinearSpec/NonLinearSpecIABVAST2Spec.html',
  TEST.pathToTest + 'nonLinearSpec/NonLinearSpecIABVAST3Spec.html'
];

const args = process.argv;
if (args[2] === 'android') {
  driver = TEST.getDriver('android');
} else if (args[2] === 'safari') {
  driver = TEST.getDriver('safari');
} else if (args[2] === 'chrome') {
  testUrls = testUrlsChromeOnly;
  driver = TEST.getDriver('chrome');
} else {
  driverCount = TEST.driverCount;
  driver = TEST.getDriver('firefox');
}

var intialTime = TEST.getTime();
var index = 0;
var count = 0;

var _run = function () {
  console.log('Run HTML spec ' + testUrls[index] + ' at: ' + (TEST.getTime() - intialTime) + 'ms');
  var p = TEST.loadHTMLSpec(driver, testUrls[index]);
  p.then(() => {
    if (index === testUrls.length - 1) {
      driver.quit();
      if (count !== driverCount - 1) {
        if (count === 0) {
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
