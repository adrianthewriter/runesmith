// Compiles the RUNESMITH library and binary files
//
// Note: Doesn't use ES modules Import/Export syntax
// because this file is what transpiles the rest of
// the library to node compatable code.

//
// IMPORTS
const path = require('path')
const webpack = require('webpack')

// Webpack Plugins
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

//
// GLOBAL VARIABLES
const LIB_ROOT = process.cwd()

//
// EXPORT
module.exports = {
  mode: 'development',
  context: path.resolve(LIB_ROOT),
  entry: {
    // lib: {
    //   import: './src/api/index.js',
    //   filename: 'lib/index.js',
    // },
    bin: {
      import: './src/cli/index.js',
      filename: 'bin/runesmith.js',
    },
  },
  watchOptions: {
    ignored: /(node_modules|bin|lib)/,
  },

  //
  // CONFIGURE OUTPUT
  output: {
    path: path.resolve(LIB_ROOT),
    clean: {
      keep: asset => asset.search(/^(bin|lib|.log)\//) < 0,
    },
  },
  target: 'node',
  stats: 'minimal',
  devtool: 'eval-source-map',

  //
  // CONFIGURE PLUGINS
  plugins: [
    new FriendlyErrorsPlugin(),
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      test: 'bin/runesmith.js',
    }),
  ],

  //
  // CONFIGURE LOADERS
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        type: 'javascript/auto',
        use: [
          {
            loader: require.resolve('shebang-loader'),
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  require.resolve('@babel/preset-env'),
                  { targets: { node: true } },
                ],
                [
                  require.resolve('@babel/preset-react'),
                  { runtime: 'automatic' },
                ],
              ],
              plugins: [],
            },
          },
        ],
      },
    ],
  },
}
