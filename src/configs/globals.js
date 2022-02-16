const path = require('path')
const readPkg = require('read-pkg')

const globals = {
  appName: readPkg.sync().name,
  appRoot: process.cwd(),
  libRoot: String(__dirname),
}
globals.outputPath = path.join(globals.appRoot, 'build/')

module.exports = globals
