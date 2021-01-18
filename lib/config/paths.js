const fs = require('fs')
const path = require('path')
const readPkg = require('read-pkg')

const appRoot = process.cwd()

let swordsmithPath = [
  path.resolve(appRoot, 'node_modules/@adrianthewriter/swordsmith'),
  path.resolve(appRoot, 'node_modules/swordsmith'),
]
if (fs.existsSync(swordsmithPath[0])) {
  swordsmithPath = swordsmithPath[0]
} else if (fs.existsSync(swordsmithPath[1])) {
  swordsmithPath = swordsmithPath[1]
} else {
  console.log("Swordsmith isn't installed!")
}

module.exports = {
  appName: readPkg.sync().name,
  appRoot: appRoot,
  swordsmithPath,
  htmlTemplate: {
    dev: path.join(swordsmithPath, 'lib/templates/template.dev.html'),
    prod: path.join(swordsmithPath, 'lib/templates/template.prod.html'),
  },
  // clientBundleEntry: path.join(appRoot, 'src/index.jsx'),
  outputDirectory: path.join(appRoot, 'build/'),
}
