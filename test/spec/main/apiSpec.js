'use strict';

const TEST = require('../helpers/test');

let driver;

let testUrls = [
  TEST.pathToTest + 'apiSpec/pre-mid-post.html'
];

const testUrlsChromeOnly = [
  TEST.pathToTest + 'apiSpec/events.html',
  TEST.pathToTest + 'apiSpec/methods.html',
  TEST.pathToTest + 'apiSpec/initialize.html',
  TEST.pathToTest + 'apiSpec/pre-mid-post.html',
  TEST.pathToTest + 'apiSpec/stopAds-hls.html',
  TEST.pathToTest + 'apiSpec/ThreeConsecutiveWithErrorLinearSpec.html'
];

const args = process.argv;
if (args[2] === 'android') {
  driver = TEST.getDriver('android');
} else if (args[2] === 'safari') {
  driver = TEST.getDriver('safari');
  driver.manage().window().setRect({ width: 1280, height: 960 });
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
