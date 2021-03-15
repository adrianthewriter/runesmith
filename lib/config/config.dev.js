const path = require('path')
const webpack = require('webpack')
const { capitalCase } = require('change-case')

const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

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
    layout: [
      // require.resolve('webpack-dev-server/client'), // WebpackDevServer host and port
      // require.resolve('webpack/hot/only-dev-server'), // "only" prevents reload on syntax errors
      path.resolve(runesmithPath, 'lib/index.js'),
    ],
    vendors: [
      require.resolve('react'),
      require.resolve('react-dom'),
      require.resolve('react-refresh/runtime'),
    ],
  },

  output: {
    filename: '[name].bundle.js',
    path: outputDirectory,
    publicPath: '/',
    libraryTarget: 'umd',
    clean: true,
  },

  target: 'web',

  plugins: [
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
      inject: false,
      template: htmlTemplate.devInner,
    }),

    // new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin({
      // overlay: true,
      // overlay: { sockPort: 8080 },
    }),
  ],

  // watch: true, // needed for WebpackPluginServe!

  resolve: {
    symlinks: false,
    alias: require('alias-hq').get('webpack'),
    extensions: ['.js', '.jsx', '.css'],
    modules: [
      `${appRoot}`,
      'node_modules',
      `${appRoot}/node_modules`,
      `${runesmithPath}/node_modules`,
    ],
  },

  resolveLoader: {
    modules: [`${runesmithPath}/node_modules`, `${appRoot}/node_modules`],
  },

  devServer: {
    noInfo: true,
    historyApiFallback: true,
    contentBase: outputDirectory,
    inline: true,
    hot: true,
    liveReload: false,
    host: 'localhost',
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(appRoot, 'src')],
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            sourceType: 'unambiguous',
            presets: [
              require.resolve('@babel/preset-env'),
              require.resolve('@babel/preset-react'),
            ],
            plugins: [
              require.resolve('@babel/plugin-transform-runtime'),
              require.resolve('react-refresh/babel'),
            ],
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
            loader: require.resolve('css-loader'),

            options: {
              importLoaders: 1,
              modules: {
                getLocalIdent: require('../plugins/get-local-ident'),
              },
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),

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
    runtimeChunk: 'single',

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
