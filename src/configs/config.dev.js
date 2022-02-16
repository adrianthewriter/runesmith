const path = require('path')
const { appName, appRoot, libRoot, outputPath } = require('./globals.js')
let config = require('./config.common.js')

// Include Plugins
const CopyAssetsPlugin = require('copy-webpack-plugin')
const ExtractCssPlugin = require('mini-css-extract-plugin')
// const RenderHtmlPlugin = require('../plugins/render-html-plugin')
// const DisableWebpackOutputPlugin = require('../plugins/disable-webpack-output')

// The Config
module.exports = Object.assign(config, {
  devServer: {
    noInfo: true,
    historyApiFallback: true,
    contentBase: outputPath,
    inline: true,
    hot: true,
    liveReload: false,
    host: 'localhost',
    port: 8080,
  },
})
