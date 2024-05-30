import open from 'open';
import { exec } from 'node:child_process';
import fs from 'fs';
import SELENIUM from './spec/helpers/selenium.mjs';
import TEST_LISTS from './spec/helpers/test-lists.mjs';


const _openReport = async function () {
  await open(`http://localhost/rmp-vast/test/report/report.html`);
};

const _runPatchTests = function (browser, type) {
  const ctrfDefault = {
    results: {
      tool: {
        name: 'selenium'
      },
      summary: {
        tests: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        skipped: 0,
        other: 0
      },
      tests: []
    }
  };
  const pathToCtrfFile = SELENIUM.getPathToCtrfFile(browser);
  try {
    const ctrfJsonExists = fs.existsSync(pathToCtrfFile);
    if (ctrfJsonExists) {
      fs.unlinkSync(pathToCtrfFile);
    }
    ctrfDefault.results.summary.start = Date.now();
    const data = JSON.stringify(ctrfDefault);
    fs.writeFileSync(pathToCtrfFile, data);
  } catch (error) {
    console.log(error);
  }

  let nbTestsRan = 0;
  const testList = TEST_LISTS[type];
  const testListength = testList.length;

  testList.forEach(test => {
    console.log(test);
    exec(test, (error, stdout, stderr) => {
      nbTestsRan++;
      console.log(nbTestsRan);
      console.log(testListength);
      if (nbTestsRan === testListength) {
        const crtfData = fs.readFileSync(pathToCtrfFile);
        const ctrfObject = JSON.parse(crtfData);
        ctrfObject.results.summary.stop = Date.now();
        const updatedCrtfData = JSON.stringify(ctrfObject);
        fs.writeFileSync(pathToCtrfFile, updatedCrtfData);
        _openReport();
      }
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stdout) {
        console.log(`stdout: ${stdout}`);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });
  });


};

const argv = process.argv;
const type = argv[2];
switch (type) {
  case 'android':
    TEST_LISTS[type].forEach(test => {
      exec(test, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    });
    break;
  case 'safari':
    TEST_LISTS[type].forEach(test => {
      exec(test, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    });
    break;
  case 'patch':
    _runPatchTests('chrome', type);
    break;
  default:
    TEST_LISTS[type].forEach(test => {
      exec(test, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    });
    break;
}
