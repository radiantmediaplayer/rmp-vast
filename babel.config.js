module.exports = function (api) {
  api.cache(true);
  const presets = [[
    "@babel/preset-env",
    {
      "debug": true,
      "bugfixes": true
    }
  ]];
  const plugins = [[
    "polyfill-corejs3",
    {
      "method": "usage-pure",
      "version": require("core-js-pure/package.json").version
    }
  ],
  [
    "@babel/plugin-transform-runtime",
    {
      "regenerator": false,
      "version": require("@babel/runtime/package.json").version
    }
  ]];

  return {
    presets,
    plugins
  };
}