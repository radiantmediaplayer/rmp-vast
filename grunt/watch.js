module.exports = {
  es6: {
    files: [
      'Gruntfile.js',
      'grunt/*',
      'app/css/*.css',
      'app/js/*.js',
      'test/spec/*.js',
      'css/*.less',
      'css/**/*.less',
      'js/src/*.js',
      'js/src/**/*.js'
    ],
    tasks: [
      'shell:eslintSrc',
      'less'
    ]
  }
};