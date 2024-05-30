import { Builder, until, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';

import fs from 'fs';
import ip from 'ip';

const SELENIUM = {};

const ipAddress = ip.address();
SELENIUM.pathToTest = `http://${ipAddress}/rmp-vast/test/spec/`;

SELENIUM.getDriver = function (which) {
  let driver;
  if (which === 'chrome' || !which) {
    driver = new Builder().forBrowser('chrome').build();
  } else if (which === 'firefox') {
    driver = new Builder().forBrowser('firefox').build();
  } else if (which === 'android') {
    driver = new Builder().forBrowser('chrome').setChromeOptions(new Options().androidChrome()).build();
  } else if (which === 'safari') {
    driver = new Builder().forBrowser('safari').build();
  } else if (which === 'ios') {
    driver = new Builder().forBrowser('safari', '15', 'IOS').build();
  }
  return driver;
};

const _updateCtrf = function (url, start, pass, browser, pathToCtrfFile, error) {
  const crtfData = fs.readFileSync(pathToCtrfFile);
  const ctrfObject = JSON.parse(crtfData);
  ctrfObject.results.summary.tests++;
  let status = 'passed';
  if (pass) {
    ctrfObject.results.summary.passed++;
  } else {
    status = 'failed';
    ctrfObject.results.summary.failed++;
  }
  const stop = Date.now();
  const name = url.split('spec/');

  const test = {
    name: name[1],
    status,
    browser,
    duration: stop - start,
    start,
    stop
  };
  if (error) {
    test.trace = error.toString();
  }
  ctrfObject.results.tests.push(test);
  const data = JSON.stringify(ctrfObject);
  fs.writeFileSync(pathToCtrfFile, data);
  console.log('Testing result for ' + url + ': ' + status);
  console.log('------------------------------------------------------------------------------------------------------');
};

SELENIUM.getPathToCtrfFile = function (browser) {
  let playerVersion = 'v0';
  const packageData = fs.readFileSync('./package.json');
  const packageObject = JSON.parse(packageData);
  playerVersion = packageObject.version;
  const folderToCtrf = `./test/report/v${playerVersion}`;
  try {
    if (!fs.existsSync(folderToCtrf)) {
      fs.mkdirSync(folderToCtrf);
    }
  } catch (err) {
    console.error(err);
  }
  return `${folderToCtrf}/ctrf-${browser}.json`;
};

SELENIUM.loadHTMLSpec = async function (driver, url, browser) {
  const timeStart = Date.now();
  const pathToCtrfFile = SELENIUM.getPathToCtrfFile(browser);

  try {
    await driver.get(url);
    await driver.wait(until.titleIs('Test finished'));
    const result = await driver.findElement(By.id('result'));
    const resultText = await result.getText();
    if (resultText === 'passed') {
      _updateCtrf(url, timeStart, true, browser, pathToCtrfFile);
    } else {
      _updateCtrf(url, timeStart, false, browser, pathToCtrfFile, 'validSteps not expected');
    }
  } catch (error) {
    console.log(error);
    _updateCtrf(url, timeStart, false, browser, pathToCtrfFile, error);
  }
};

export default SELENIUM;
