module.exports = {
  eslintSrc: {
    command: 'npx eslint --config .eslintrc-es2017.json --ignore-path .es2017.eslintignore test/spec/ js/src/ app/js/ test/spec/helpers/function.js'
  },
  eslintNode: {
    command: 'npx eslint --config .eslintrc-node.json test/spec/main/ test/spec/helpers/test.js test/spec/main/ Gruntfile.js grunt/'
  },
  stylelint: {
    command: 'npx stylelint "css/*.less" "css/import-less/*.less" "app/css/*.css"'
  },
  generatetypes: {
    command: 'npx -p typescript tsc js/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types'
  },
  test: {
    command: [
      'node test/spec/main/adPodSpec.js',
      'node test/spec/main/adPodSpec.js chrome',
      'node test/spec/main/apiSpec.js',
      'node test/spec/main/apiSpec.js chrome',
      'node test/spec/main/companionSpec.js',
      'node test/spec/main/companionSpec.js chrome',
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
      'node test/spec/main/companionSpec.js android',
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
      'node test/spec/main/companionSpec.js safari',
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
