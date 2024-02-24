const child_process = require('child_process');

// these ones require manual testing
/*const manualTestList = [
  'node test/spec/main/adBlockerSpec.js chrome',
];*/

const desktopTestList = [
  'node test/spec/main/adPodSpec.js',
  'node test/spec/main/adPodSpec.js chrome',
  'node test/spec/main/apiSpec.js chrome',
  'node test/spec/main/companionSpec.js chrome',
  'node test/spec/main/errorSpec.js',
  'node test/spec/main/errorSpec.js chrome',
  'node test/spec/main/iconsSpec.js chrome',
  'node test/spec/main/inlineLinearSpec.js',
  'node test/spec/main/inlineLinearSpec.js chrome',
  'node test/spec/main/nonLinearSpec.js',
  'node test/spec/main/nonLinearSpec.js chrome',
  'node test/spec/main/omWebSpec.js chrome',
  'node test/spec/main/outstreamSpec.js',
  'node test/spec/main/outstreamSpec.js chrome',
  'node test/spec/main/redirectSpec.js',
  'node test/spec/main/redirectSpec.js chrome',
  'node test/spec/main/vast4Spec.js chrome',
  'node test/spec/main/vpaidSpec.js',
  'node test/spec/main/vpaidSpec.js chrome'
];

const androidTestList = [
  'node test/spec/main/adPodSpec.js android',
  'node test/spec/main/companionSpec.js android',
  'node test/spec/main/errorSpec.js android',
  'node test/spec/main/inlineLinearSpec.js android',
  'node test/spec/main/nonLinearSpec.js android',
  'node test/spec/main/outstreamSpec.js android',
  'node test/spec/main/redirectSpec.js android',
  'node test/spec/main/vpaidSpec.js android'
];

const safariTestList = [
  'node test/spec/main/adPodSpec.js safari',
  'node test/spec/main/companionSpec.js safari',
  'node test/spec/main/errorSpec.js safari',
  'node test/spec/main/inlineLinearSpec.js safari',
  'node test/spec/main/nonLinearSpec.js safari',
  'node test/spec/main/outstreamSpec.js safari',
  'node test/spec/main/redirectSpec.js safari',
  'node test/spec/main/vpaidSpec.js safari'
];

const argv = process.argv;
const type = argv[2];
switch (type) {
  case 'android':
    androidTestList.forEach(test => {
      try {
        const result = child_process.execSync(test).toString();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    });
    break;
  case 'safari':
    safariTestList.forEach(test => {
      try {
        const result = child_process.execSync(test).toString();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    });
    break;
  default:
    desktopTestList.forEach(test => {
      try {
        const result = child_process.execSync(test).toString();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    });
    break;
}
