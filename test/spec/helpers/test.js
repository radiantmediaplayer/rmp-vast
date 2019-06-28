'use strict';

const { Builder, until } = require('../../../node_modules/selenium-webdriver/');
const { Options } = require('../../../node_modules/selenium-webdriver/chrome');
const TEST = {};

TEST.driverCount = 2;

TEST.pathToTest = 'http://192.168.1.98/rmp-vast/test/spec/';

TEST.getDriver = function (which) {
  var driver;
  if (which === 'chrome' || !which) {
    driver = new Builder().forBrowser('chrome').build();
  } else if (which === 'firefox') {
    driver = new Builder().forBrowser('firefox').build();
  } else if (which === 'internet explorer') {
    driver = new Builder().forBrowser('internet explorer').build();
  } else if (which === 'android') {
    driver = new Builder().
      forBrowser('chrome').
      setChromeOptions(new Options().androidChrome()).
      build(); 
  } else if (which === 'safari') {
    driver = new Builder().forBrowser('safari').build();
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
