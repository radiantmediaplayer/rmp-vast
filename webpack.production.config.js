const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const PACKAGE = require('./package.json');

const terserOptions = {
  ecma: 5,
  compress: {
    defaults: true,
    pure_funcs: ['console.log', 'console.warn']
  },
  module: false,
  mangle: true,
  safari10: true
};

module.exports = {
  entry: {
    'rmp-vast': [
      'whatwg-fetch',
      './src/js/index.js'
    ],
    'rmp-vast.min': [
      'whatwg-fetch',
      './src/js/index.js'
    ]
  },
  output: {
    library: {
      name: 'RmpVast',
      type: 'window',
      export: 'default'
    },
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: ''
  },
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS to JavaScript
          'style-loader',
          // this is for IE11 support 
          { loader: 'css-loader', options: { url: false } },
          'less-loader'
        ],
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /externals/
        ],
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions,
        include: /\.min\.js$/,
      })
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new StylelintPlugin({
      files: './src/less/**/*.less'
    }),
    new webpack.DefinePlugin({
      RMP_VAST_VERSION: JSON.stringify(PACKAGE.version)
    })
  ]
};
