const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const PACKAGE = require('./package.json');

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/js/index.js'
  ],
  output: {
    library: {
      name: 'RmpVast',
      type: 'window',
      export: 'default'
    },
    filename: 'rmp-vast.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  mode: 'development',
  devServer: {
    port: 9000,
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    devMiddleware: {
      index: 'index.html',
      writeToDisk: true
    }
  },
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
        test: /\.hbs$/,
        use: [
          'handlebars-loader'
        ]
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
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'rmp-vast test',
      description: 'test page from rmp-vast',
      template: './src/templates/index.hbs',
      scriptLoading: 'blocking',
      inject: 'head'
    }),
    new ESLintPlugin({
      configType: 'flat', 
      files: './src/**/*.js'
    }),
    new StylelintPlugin({
      files: './src/less/**/*.less'
    }),
    new webpack.DefinePlugin({
      RMP_VAST_VERSION: JSON.stringify(PACKAGE.version)
    })
  ]
};
