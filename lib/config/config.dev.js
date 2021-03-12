const path = require('path')
const webpack = require('webpack')
const { capitalCase } = require('change-case')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  appName,
  appRoot,
  runesmithPath,
  htmlTemplate,
  outputDirectory,
} = require('./paths.js')

module.exports = {
  mode: 'development',

  entry: {
    layout: path.resolve(runesmithPath, 'lib/index.js'),
  },

  output: {
    filename: '[name].bundle.js',
    path: outputDirectory,
    libraryTarget: 'umd',
  },

  target: 'web',

  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].bundle.css`,
      chunkFilename: `[name].bundle.css`,
    }),

    new HtmlWebpackPlugin({
      title: capitalCase(appName),
      inject: true,
      template: htmlTemplate.devWrapper,
    }),

    new HtmlWebpackPlugin({
      filename: '[name].bundle.html',
      title: capitalCase(appName),
      inject: true,
      template: htmlTemplate.devInner,
    }),
  ],

  resolve: {
    symlinks: false,
    alias: require('alias-hq').get('webpack'),
    extensions: ['.js', '.jsx', '.css'],
    modules: ['node_modules', `${runesmithPath}/node_modules`],
  },

  resolveLoader: {
    modules: ['node_modules', `${runesmithPath}/node_modules`],
  },

  devServer: {
    noInfo: true,
    historyApiFallback: true,
    contentBase: outputDirectory,
    open: false,
    compress: true,
    // hot: true,
    liveReload: true,
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
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /.css$/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
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
                  new require('postcss-prefix-selector')({
                    prefix: `.${appName}`,
                    transform: (prefix, selector, prefixedSelector) => {
                      if (selector === ':root') {
                        return '.root'
                      } else if (selector === '.root') {
                        return selector
                      } else if (selector.includes('.root')) {
                        return `.charsheet ${prefixedSelector}`
                      } else if (selector.includes('rolltemplate')) {
                        return selector
                      } else {
                        return prefixedSelector
                      }
                    },
                  }),
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
        default: false,

        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
        },

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
