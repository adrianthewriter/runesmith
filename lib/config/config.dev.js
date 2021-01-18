const path = require('path')
const webpack = require('webpack')
const { capitalCase } = require('change-case')

const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  appName,
  appRoot,
  swordsmithPath,
  htmlTemplate,
  outputDirectory,
} = require('./paths.js')

module.exports = {
  mode: 'development',

  entry: {
    layout: path.resolve(appRoot, 'src/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: outputDirectory,
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.ProgressPlugin(),

    new HtmlWebpackPlugin({
      title: capitalCase(appName),
      inject: true,
      template: htmlTemplate.dev,
    }),
  ],
  resolve: {
    symlinks: false,
    alias: require('alias-hq').get('webpack'),
    extensions: ['.js', '.jsx', '.css'],
    modules: ['node_modules', `${swordsmithPath}/node_modules`],
  },

  resolveLoader: {
    modules: ['node_modules', `${swordsmithPath}/node_modules`],
  },

  devServer: {
    noInfo: true,
    historyApiFallback: true,
    contentBase: outputDirectory,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(appRoot, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /.css$/,

        use: [
          {
            loader: 'style-loader',
            options: {},
          },
          {
            loader: 'css-loader',

            options: {
              importLoaders: 1,
              modules: {
                getLocalIdent: require('../plugins/get-local-ident'),
              },
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',

            options: {
              postcssOptions: {
                env: {
                  stage: 3,
                  features: {
                    'nesting-rules': true,
                  },
                },
                plugins: [
                  new require('precss'),
                  new require('autoprefixer'),
                  new require('cssnano')({
                    preset: [
                      'default',
                      {
                        discardComments: { removeAll: true },
                        minifyFontValues: { removeQuotes: false },
                      },
                    ],
                  }),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },
}
