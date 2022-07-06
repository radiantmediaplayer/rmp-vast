const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const PACKAGE = require('./package.json');
const fs = require('fs');
const { minify } = require('terser');

const terserOptions = {
  ecma: 5,
  compress: {
    defaults: true,
    pure_funcs: ['console.log', 'console.dir', 'console.warn']
  },
  module: false,
  mangle: true,
  safari10: true
};

module.exports = {
  entry: {
    'rmp-vast': ['whatwg-fetch', 'promise-polyfill/src/polyfill', './src/js/index.js'],
    'rmp-vast.min': ['whatwg-fetch', 'promise-polyfill/src/polyfill', './src/js/index.js']
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
        test: /omid-session-client-v1\.js/,
        type: 'asset/source',
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
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', async () => {
          const result = await minify(
            fs.readFileSync('./externals/omid/omid-session-client-v1.js', 'utf8'),
            terserOptions
          );
          fs.writeFileSync('./externals/omid/omid-session-client-v1.min.js', result.code, 'utf8');
        });
      }
    }
  ]
};
