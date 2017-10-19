'use strict';

const { Builder, until } = require('../../../node_modules/selenium-webdriver/');
const TEST = {};
const driver = new Builder()
  .forBrowser('chrome')
  .build();

TEST.pathToTest = 'http://localhost/rmp-vast/test/spec/';

TEST.getDriver = function () {
  return driver;
};

TEST.getTime = function () {
  return Date.now();
};

TEST.loadHTMLSpec = function (url) {
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