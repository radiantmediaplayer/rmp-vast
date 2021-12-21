module.exports = {
  sourceHeader: {
    src: [
      'js/src/index.js'
    ],
    overwrite: true,
    replacements: [{
      from: /rmp-vast\s*\d+\.\d+\.\d+/g,
      to: 'rmp-vast <%= package.version %>'
    }]
  },
  omidPartnerVersion: {
    src: [
      'js/src/utils/helpers.js'
    ],
    overwrite: true,
    replacements: [{
      from: /partnerVersion:\s*'\d+\.\d+\.\d+'/g,
      to: 'partnerVersion: \'<%= package.version %>\''
    }]
  }
};
