const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

class AddScriptsPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('AddScriptsPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'AddScriptsPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Find the scripts data
          let scripts = compilation
            .getAssets()
            .find(asset => asset.name === 'scripts.js').source._value

          // Set data.html with new value
          data.html += `\n<script type="script/sheetworker">${scripts}</script>`

          // Tell webpack to move on
          cb(null, data)
        }
      )
    })
  }
}

module.exports = AddScriptsPlugin
