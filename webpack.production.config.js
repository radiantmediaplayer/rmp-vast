const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const PACKAGE = require('./package.json');

const terserOptions = {
  compress: {
    defaults: true,
    pure_funcs: ['Logger.print', 'Logger.printVideoEvents', 'console.log']
  },
  format: {
    comments: false
  },
  module: false,
  mangle: true
};

module.exports = {
  entry: {
    'rmp-vast': [
      './src/js/index.js'
    ],
    'rmp-vast.min': [
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
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
        extractComments: false,
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
