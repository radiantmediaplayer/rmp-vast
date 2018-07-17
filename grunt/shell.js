module.exports = {
  eslintSrc: {
    command: 'eslint --config .eslintrc-es2015.json --ignore-path .es2015.eslintignore js/src/.'
  },
  eslintModule: {
    command: 'eslint --config .eslintrc-es2015.json js/src/module.js'
  },
  eslintES5: {
    command: 'eslint --config .eslintrc-es5.json --ignore-path .es5.eslintignore test/spec/. app/js/.'
  },
  eslintNode: {
    command: 'eslint --config .eslintrc-node.json test/spec/main/. test/spec/helpers/. Gruntfile.js grunt/'
  },
  browserify: {
    command: 'browserify js/src/main.js -o js/dist/rmp-vast.js -t [ babelify ] -v'
  },
  watchify: {
    command: 'watchify js/src/main.js -o js/dist/rmp-vast.js -t [ babelify ] -v'
  },
  uglify: {
    command: 'uglifyjs js/dist/rmp-vast.js --compress --define DEBUG=false --mangle --screw-ie8 --comments -o js/dist/rmp-vast.min.js'
  },
  jsbeautify: {
    command: 'js-beautify -f js/src/module.js -o js/src/module.js'
  },
  stylelint: {
    command: 'stylelint "css/*.less" "css/import-less/*.less" "app/css/*.css"'
  },
  test: {
    command: [
      'node test/spec/main/adPodSpec.js',
      'node test/spec/main/adPodSpec.js chrome',
      'node test/spec/main/apiSpec.js',
      'node test/spec/main/apiSpec.js chrome',
      'node test/spec/main/errorSpec.js',
      'node test/spec/main/errorSpec.js chrome',
      'node test/spec/main/inlineLinearSpec.js',
      'node test/spec/main/inlineLinearSpec.js chrome',
      'node test/spec/main/nonLinearSpec.js',
      'node test/spec/main/nonLinearSpec.js chrome',
      'node test/spec/main/outstreamSpec.js',
      'node test/spec/main/outstreamSpec.js chrome',
      'node test/spec/main/redirectSpec.js',
      'node test/spec/main/redirectSpec.js chrome',
      'node test/spec/main/vast4Spec.js',
      'node test/spec/main/vast4Spec.js chrome',
      'node test/spec/main/vpaidSpec.js',
      'node test/spec/main/vpaidSpec.js chrome'
    ].join('&&')
  },
  testAndroid: {
    command: [
      'node test/spec/main/adPodSpec.js android',
      'node test/spec/main/apiSpec.js android',
      'node test/spec/main/errorSpec.js android',
      'node test/spec/main/inlineLinearSpec.js android',
      'node test/spec/main/nonLinearSpec.js android',
      'node test/spec/main/outstreamSpec.js android',
      'node test/spec/main/redirectSpec.js android',
      'node test/spec/main/vast4Spec.js android',
      'node test/spec/main/vpaidSpec.js android'
    ].join('&&')
  },
  testSafari: {
    command: [
      'node test/spec/main/adPodSpec.js safari',
      'node test/spec/main/apiSpec.js safari',
      'node test/spec/main/errorSpec.js safari',
      'node test/spec/main/inlineLinearSpec.js safari',
      'node test/spec/main/nonLinearSpec.js safari',
      'node test/spec/main/outstreamSpec.js safari',
      'node test/spec/main/redirectSpec.js safari',
      'node test/spec/main/vast4Spec.js safari',
      'node test/spec/main/vpaidSpec.js safari'
    ].join('&&')
  }
};
