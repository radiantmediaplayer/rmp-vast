const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const PACKAGE = require('./package.json');
const fs = require('fs');
const { minify } = require('terser');
const { EOL } = require('os');

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
      'promise-polyfill/src/polyfill',
      './src/js/index.js'
    ],
    'rmp-vast.min': [
      'whatwg-fetch',
      'promise-polyfill/src/polyfill',
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
    }),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('AfterDonePlugin', async () => {
          // minify omid-session-client-v1
          const result = await minify(
            fs.readFileSync('./externals/omid/omid-session-client-v1.js', 'utf8'),
            terserOptions
          );
          fs.writeFileSync('./externals/omid/omid-session-client-v1.min.js', result.code, 'utf8');

          // merge omid-session-client-v1 in rmp-vast
          const files = [
            './dist/rmp-vast.js',
            './externals/omid/omid-session-client-v1.js'
          ];
          const output = files.map((f) => {
            return fs.readFileSync(f).toString();
          }).join(EOL);
          fs.writeFileSync('./dist/rmp-vast.js', output);

          // merge omid-session-client-v1.min in rmp-vast.min
          const minFiles = [
            './dist/rmp-vast.min.js',
            './externals/omid/omid-session-client-v1.min.js'
          ];
          const minOutput = minFiles.map((f) => {
            return fs.readFileSync(f).toString();
          }).join(EOL);
          fs.writeFileSync('./dist/rmp-vast.min.js', minOutput);

        });
      }
    }
  ]
};
