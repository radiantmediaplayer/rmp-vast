'use strict';

const { Builder, until } = require('../../../node_modules/selenium-webdriver/');
const TEST = {};

TEST.driverCount = 3;

TEST.pathToTest = 'http://localhost/rmp-vast/test/spec/';

TEST.getDriver = function (which) {
  let driver;
  if (which === 'chrome' || !which) {
    driver = new Builder().forBrowser('chrome').build();
  } else if (which === 'firefox') {
    driver = new Builder().forBrowser('firefox').build();
  } else if (which === 'MicrosoftEdge') {
    driver = new Builder().forBrowser('MicrosoftEdge').build();
  }
  return driver;
};

TEST.getTime = function () {
  return Date.now();
};

TEST.loadHTMLSpec = function (driver, url) {
  return new Promise((resolve, reject) => {
    driver.get(url).then(() => {
      driver.wait(until.titleIs('Test completed')).then(() => {
        console.log('Testing result for ' + url + ': SUCCESS');
        resolve();
      }).catch(() => {
        console.log('Testing result for ' + url + ': FAILURE');
        reject();
      });
    }).catch(() => {
      console.log('Could not get URL ' + url);
      reject();
    });
  });
};

module.exports = TEST;