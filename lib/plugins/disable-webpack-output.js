const { appName } = require('../config/paths')

module.exports = class DisableWebpackOutputPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('DisableWebpackOutputPlugin', compilation => {
      let assets = compilation.getAssets()
      Object.keys(assets)
        .filter(i => !assets[i].name.includes(appName))
        .forEach(i => {
          console.log(assets[i].name)
          delete compilation.deleteAsset(assets[i].name)
        })
    })
  }
}
