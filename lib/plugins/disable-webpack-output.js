const path = require('path')
const pkg = require(path.resolve(process.cwd(), 'package.json'))

module.exports = class DisableWebpackOutputPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'DisableWebpackOutputPlugin',
      (compilation, callback) => {
        // Stop file output in production
        let assets = compilation.getAssets()
        Object.keys(assets)
          .filter(i => !assets[i].name.includes(pkg.name))
          .forEach(i => {
            console.log(assets[i].name)
            delete compilation.deleteAsset(assets[i].name)
          })

        callback()
      }
    )
  }
}
