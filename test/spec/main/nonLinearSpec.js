'use strict';

const TEST = require('../helpers/test');

let driver;

let testUrls = [
  TEST.pathToTest + 'nonLinearSpec/NonLinearSpecIABVAST3Spec.html'
];

const testUrlsChromeOnly = [
  TEST.pathToTest + 'nonLinearSpec/non-linear-iframe.html',
  TEST.pathToTest + 'nonLinearSpec/non-linear-html.html',
  TEST.pathToTest + 'nonLinearSpec/non-linear-image.html',
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
  driver = TEST.getDriver('firefox');
}

const intialTime = Date.now();
let index = 0;

const _run = function () {
  console.log('Run HTML spec ' + testUrls[index] + ' at: ' + (Date.now() - intialTime) + 'ms');
  const p = TEST.loadHTMLSpec(driver, testUrls[index]);
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
