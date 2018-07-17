'use strict';

const TEST = require('../helpers/test');

var driver;
var driverCount = 1;

var testUrls = [
  TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-1-interaction.html',
  TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-3-api.html'
];

var testUrlsChromeOnly = [
  TEST.pathToTest + 'vpaidSpec/vpaid-fails-loading-js.html',
  TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-1-interaction.html',
  TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-2.html',
  TEST.pathToTest + 'vpaidSpec/vpaid-js-linear-3-api.html'
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
          testUrls.push('http://localhost/rmp-vast/test/spec/vpaidSpec/vpaid-js-redirect.html');
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
