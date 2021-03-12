const { appName } = require('../config/paths')
const { sources } = require('webpack')

module.exports = class RenderHtmlOutputPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('RenderHtmlOutputPlugin', compilation => {
      // Remove the outer html
      let html = compilation.getAsset(`${appName}.html`).source.source()
      let match = html.match(/<body>(.*)<\/body>/)
      let innerHtml = match ? match[1] : ''

      // Add the sheetworker scripts
      let scripts = compilation
        .getAsset('scripts.js')
        .source.source()
        .replace(
          '/*! For license information please see scripts.js.LICENSE.txt */',
          ''
        )
      innerHtml += `\n<script type="text/worker">${scripts}</script>`

      // Save the new data
      compilation.updateAsset(
        `${appName}.html`,
        new sources.RawSource(innerHtml)
      )
    })
  }
}
