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
  }
};