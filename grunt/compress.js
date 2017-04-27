module.exports = {
  main: {
    options: {
      archive: '../backup/rmp-vast/rmp-vast-<%= package.version %>.zip'
    },
    files: [{
      expand: true,
      src: [
        'app/**',
        'css/**',
        'grunt/**',
        'js/**',
        'test/**',
        '.*',
        '*.js',
        'LICENSE',
        '*.json',
        '*.html'
      ]
    }]
  }
};