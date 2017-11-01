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
      'node test/spec/main/apiSpec.js',
      'node test/spec/main/errorSpec.js',
      'node test/spec/main/inlineLinearSpec.js',
      'node test/spec/main/nonLinearSpec.js',
      'node test/spec/main/redirectSpec.js',
      'node test/spec/main/vpaidSpec.js'
    ].join('&&')
  }
};