const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

class RenderHtmlPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('RenderHtmlPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'RenderHtmlPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Remove the outer html
          let match = data.html.match(/<body>(.*)<\/body>/)
          let innerHtml = match ? match[1] : ''

          // Add the sheetworker scripts
          let scripts = compilation
            .getAssets()
            .find(asset => asset.name === 'scripts.js').source._value

          innerHtml += `\n<script type="text/worker">${scripts}</script>`

          // Set data.html with new value
          data.html = innerHtml

          // Tell webpack to move on
          cb(null, data)
        }
      )
    })
  }
}

module.exports = RenderHtmlPlugin
