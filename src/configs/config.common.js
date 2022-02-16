const path = require('path')
const { appName, appRoot, libRoot, outputPath } = require('./globals.js')

// Include Plugins
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyAssetsPlugin = require('copy-webpack-plugin')
const ExtractCssPlugin = require('mini-css-extract-plugin')
// const RenderHtmlPlugin = require('../plugins/render-html-plugin')
// const DisableWebpackOutputPlugin = require('../plugins/disable-webpack-output')

// The Config
module.exports = {
  mode: 'production',

  context: path.resolve(libRoot),

  entry: {
    layout: {
      import: path.resolve(appRoot, 'src/layout'),
      filename: `layout.bundle.js`,
      dependOn: 'react',
    },
    templates: {
      import: path.resolve(appRoot, 'src/templates'),
      filename: `templates.bundle.js`,
      dependOn: 'react',
    },
    scripts: {
      import: path.resolve(appRoot, 'src/scripts'),
      filename: `scripts.bundle.js`,
    },
    react: [
      require.resolve('react'),
      require.resolve('react-dom'),
      require.resolve('prop-types'),
    ],
  },

  output: {
    path: outputPath,
    clean: true,
  },

  resolve: {
    // enforceExtension: true,
    alias: {
      ['@assets']: path.resolve(`${appRoot}/assets/`),
      ['@components']: path.resolve(`${appRoot}/layout/components/`),
      [' @layout']: path.resolve(`${appRoot}/layout/`),
      ['@scripts']: path.resolve(`${appRoot}/scripts/`),
      ['@templates']: path.resolve(`${appRoot}/templates/`),
    },
    modules: [`${libRoot}/node_modules`, 'node_modules'],
    roots: [appRoot, libRoot],
  },

  resolveLoader: {
    modules: [
      `${libRoot}/lib/loaders`,
      `${libRoot}/node_modules`,
      'node_modules',
    ],
  },

  // Plugins Start Here:
  plugins: [
    new FriendlyErrorsPlugin(),
    new CopyAssetsPlugin({
      patterns: [
        {
          noErrorOnMissing: true,
          from: path.join(appRoot, 'src/assets'),
          to: 'assets/',
        },
      ],
    }),
    new ExtractCssPlugin({
      filename: `${appName}.css`,
      chunkFilename: `${appName}.css`,
    }),
    // new RenderHtmlPlugin(),
  ],

  // Rules Start Here:
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                [
                  require.resolve('@babel/preset-react'),
                  {
                    runtime: 'automatic',
                  },
                ],
              ],
              plugins: [
                // require.resolve('@babel/plugin-transform-runtime'),
                // require.resolve('react-refresh/babel'),
              ],
            },
          },
          // {
          //   rules: {
          //     include: [
          //       path.resolve(appRoot, 'src/layout'),
          //       path.resolve(appRoot, 'src/template'),
          //     ],
          //     use: 'react-loader',
          //   },
          // },
        ],
      },

      {
        test: /.css$/,
        include: [path.join(appRoot, 'src')],
        use: [
          {
            loader: ExtractCssPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          {
            loader: 'css-loader',
            options: {
              import: false, // Keeps quotes around @import url("...")
              modules: {
                // getLocalIdent: require('../plugins/get-local-ident'),
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
}
