module.exports = {
  development: {
    options: {
      compress: false,
      lint: true,
      ieCompat: false
    },
    files: {
      'css/rmp-vast.css': 'css/rmp-vast.less',
    }
  },
  production: {
    options: {
      compress: true,
      lint: true,
      ieCompat: false
    },
    files: {
      'css/rmp-vast.min.css': 'css/rmp-vast.less'
    }
  }
};
