import SELENIUM from '../helpers/selenium.mjs';

let driver;

let testUrls = [
  SELENIUM.pathToTest + 'outstreamSpec/linear.html'
];

const testUrlsChromeOnly = [
  SELENIUM.pathToTest + 'outstreamSpec/linear.html',
  SELENIUM.pathToTest + 'outstreamSpec/reload.html',
  SELENIUM.pathToTest + 'outstreamSpec/vpaid.html'
];

const args = process.argv;
const browser = args[2];
if (browser === 'android') {
  driver = SELENIUM.getDriver('android');
} else if (browser === 'safari') {
  driver = SELENIUM.getDriver('safari');
  driver.manage().window().setRect({ width: 1280, height: 960 });
} else if (browser === 'chrome') {
  testUrls = testUrlsChromeOnly;
  driver = SELENIUM.getDriver('chrome');
} else {
  driver = SELENIUM.getDriver('firefox');
}

const intialTime = Date.now();
let index = 0;

const _run = function () {
  console.log(`Run HTML spec ${testUrls[index]} at ${(Date.now() - intialTime)} ms on ${browser}`);
  const p = SELENIUM.loadHTMLSpec(driver, testUrls[index], browser);
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
