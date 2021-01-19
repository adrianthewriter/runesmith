const fs = require('fs')
const path = require('path')
const readPkg = require('read-pkg')

const appRoot = process.cwd()

let runesmithPath = [
  path.resolve(appRoot, 'node_modules/@adrianthewriter/runesmith'),
  path.resolve(appRoot, 'node_modules/runesmith'),
]
if (fs.existsSync(runesmithPath[0])) {
  runesmithPath = runesmithPath[0]
} else if (fs.existsSync(runesmithPath[1])) {
  runesmithPath = runesmithPath[1]
} else {
  console.log("Runesmith isn't installed!")
}

module.exports = {
  appName: readPkg.sync().name,
  appRoot: appRoot,
  runesmithPath,
  htmlTemplate: {
    dev: path.join(runesmithPath, 'lib/templates/template.dev.html'),
    prod: path.join(runesmithPath, 'lib/templates/template.prod.html'),
  },
  // clientBundleEntry: path.join(appRoot, 'src/index.jsx'),
  outputDirectory: path.join(appRoot, 'build/'),
}
