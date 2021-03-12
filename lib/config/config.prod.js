const path = require('path')
const webpack = require('webpack')
const changeCase = require('change-case')

const {
  appName,
  appRoot,
  runesmithPath,
  htmlTemplate,
  outputDirectory,
} = require('./paths')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DisableWebpackOutputPlugin = require('../plugins/disable-webpack-output')
const RenderHtmlOutputPlugin = require('../plugins/render-html-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',

  entry: {
    main: path.resolve(runesmithPath, 'lib/index.js'),
    scripts: path.resolve(appRoot, 'src/scripts/index.js'),
  },

  output: {
    path: outputDirectory,
  },

  target: 'web',

  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `${appName}.css`,
      chunkFilename: `${appName}.css`,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: `${appName}.html`,
      chunks: ['main', 'scripts'],
      template: `!!prerender-loader?string&entry=node_modules/runesmith/lib/index.js!${htmlTemplate.prod}`,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: false,
      },
    }),
    new RenderHtmlOutputPlugin(),
    new DisableWebpackOutputPlugin(),
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

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.join(appRoot, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /.css$/,
        include: [path.join(appRoot, 'src')],
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
              import: false, // Keeps quotes around @import url("...")
              modules: {
                getLocalIdent: require('../plugins/get-local-ident'),
              },
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
                  new require('postcss-prefix-selector')({
                    prefix: `.sheet-${appName.replace(/-/g, '')}`,
                    transform: (prefix, selector, prefixedSelector) => {
                      if (selector === ':root') {
                        return prefix
                      } else if (selector === '.root') {
                        return prefix
                      } else if (selector.includes('.root')) {
                        return selector.replace('.root', prefix)
                      } else if (selector.includes('rolltemplate')) {
                        return selector
                      } else {
                        return prefixedSelector
                      }
                    },
                  }),
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
