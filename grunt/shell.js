module.exports = {
  jshint: {
    command: 'jshint js/src/. Gruntfile.js app/js/. test/spec/.'
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
  stylelint: {
    command: 'stylelint "css/*.less" "css/import-less/*.less" "app/css/*.css"'
  },
  test: {
    command: [
      'node test/spec/main/adPodSpec.js',
      'node test/spec/main/apiSpec.js',
      'node test/spec/main/errorSpec.js',
      'node test/spec/main/inlineLinearSpec.js',
      'node test/spec/main/nonLinearSpec.js',
      'node test/spec/main/redirectSpec.js',
      'node test/spec/main/vast4Spec.js',
      'node test/spec/main/vpaidSpec.js'
    ].join('&&')
  },
  testAndroid: {
    command: [
      'node test/spec/main/adPodSpec.js android',
      'node test/spec/main/apiSpec.js android',
      'node test/spec/main/errorSpec.js android',
      'node test/spec/main/inlineLinearSpec.js android',
      'node test/spec/main/nonLinearSpec.js android',
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
      'node test/spec/main/redirectSpec.js safari',
      'node test/spec/main/vast4Spec.js safari',
      'node test/spec/main/vpaidSpec.js safari'
    ].join('&&')
  }
};