'use strict';

const TEST = require('../helpers/test');

let driver;

let testUrls = [
  TEST.pathToTest + 'errorSpec/EmptySpec.html'
];

const testUrlsChromeOnly = [
  TEST.pathToTest + 'errorSpec/EmptySpec.html',
  TEST.pathToTest + 'errorSpec/ErrorMediaSpec.html',
  TEST.pathToTest + 'errorSpec/MalformedSpec.html',
  TEST.pathToTest + 'errorSpec/VMAPSpec.html'
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

const intialTime = TEST.getTime();
let index = 0;

const _run = function () {
  console.log('Run HTML spec ' + testUrls[index] + ' at: ' + (TEST.getTime() - intialTime) + 'ms');
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
