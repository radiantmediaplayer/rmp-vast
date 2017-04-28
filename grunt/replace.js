module.exports = {
  sourceHeader: {
    src: [
      'js/src/rmp-vast-header.js',
    ],
    overwrite: true,
    replacements: [{
      from: /rmp-vast\s*\d+\.\d+\.\d+/g,
      to: 'rmp-vast <%= package.version %>'
    }]
  },
  debugOff: {
    src: [
      'js/dist/rmp-vast.js',
    ],
    overwrite: true,
    replacements: [{
      from: /window.DEBUG\s+=\s+true;/,
      to: '/*window.DEBUG = true;*/'
    }]
  },
  debugOn: {
    src: [
      'js/dist/rmp-vast.js',
    ],
    overwrite: true,
    replacements: [{
      from: /\/\*window.DEBUG\s+=\s+true;\*\//,
      to: 'window.DEBUG = true;'
    }]
  }
};