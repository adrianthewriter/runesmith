// The RUNESMITH command line interface (CLI)
//

//
// IMPORTS
import path from 'path'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import runesmithOutput from './output/output.jsx'

//
// GLOBAL VARIABLES
const {
  appName,
  appRoot,
  libRoot,
  outputPath,
} = require('../../src/configs/globals.js')

//
// LOGIC

// Configure webpack log/error handling
const handleLogging = stats => {
  const info = stats.toJson('verbose')
  let error, warn, log

  if (stats.hasErrors()) {
    error = info.errors
  }

  if (stats.hasWarnings()) {
    warn = info.warnings
  }

  // Get a list of changed source files
  const buildData = {}
  const changedSource = info.chunks
    .map(chunk =>
      chunk.modules
        .filter(
          x => x.name.includes('./src') && !x.name.includes('node_modules')
        )
        .map(x => {
          buildData.assets = x.assets
            .map(asset => {
              return asset.emitted
                ? {
                    name: asset.name,
                    size: asset.size,
                    hot: asset.info.hotModuleReplacement,
                  }
                : null
            })
            .filter(x => x)
          return x.built ? chalk.green(x.name) : null
        })
    )
    .flat()
    .filter(x => x)
    .join(', ')

  buildData.time = info.time

  // Log the changed files
  if (changedSource) {
    log = `Compiling changes from: ${changedSource}`
  }

  return { error, warn, log }, stats
}

// Parse the command
const [task] = process.argv.slice(2)
console.clear()
let compiler, server, mode, ready

switch (task) {
  case 'start':
  case 'watch':
  case 'run':
  case 'dev':
  case 'develop':
  case 'development':
    const devConfig = require('../configs/config.dev.js')
    webpackDevServer.addDevServerEntrypoints(devConfig, {})
    compiler = devConfig && webpack(devConfig)
    compiler.hooks.done.tap('done', stats => handleLogging(stats))
    server = new webpackDevServer(compiler, config.devServer)
    mode = 'development'

    // Dev Mode
    if (compiler && server && mode === 'development') {
      server.listen(8080, '127.0.0.1', () => {
        if (!ready) {
          runesmithOutput(mode, {
            run: cb =>
              cb(`Listening on: ${chalk.cyan('http://127.0.0.1:8080')}`),
          })
        }
        ready = true
      })
    }
    break

  case 'build':
  case 'bundle':
  case 'compile':
  case 'prod':
  case 'production':
    const prodConfig = require('../configs/config.common.js')
    compiler = prodConfig && webpack(prodConfig)
    compiler.hooks.done.tap('done', stats => handleLogging(stats))
    server = false
    mode = 'production'

    // Production Mode
    if (compiler && mode === 'production') {
      compiler.run(() => {
        if (!ready) {
          runesmithOutput({
            run: cb =>
              cb(`Build finished in: ${chalk.green(prodConfig.output.path)}`),
          })
        }
      })
    }
    break

  default:
    // Error Mode
    break
}
