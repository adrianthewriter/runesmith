#!/usr/bin/env node
const path = require('path')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

// Create a logger interface
const chalk = require('chalk')
const logger = (level = 'log', header, messages) => {
  console[level]('\n', header, messages.join(' '))
}

const runesmith = {
  clear: () => console.clear(),
  log: (...messages) => {
    logger('log', `${chalk.grey('[Runesmith]')} `, messages)
  },
  warn: (...messages) => {
    logger('warn', `${chalk.yellow('[Runesmith Warning]')} `, messages)
  },
  error: (...messages) => {
    logger('error', `${chalk.red('[Runesmith Error]')} `, messages)
  },
}

// Parse the command
const [task] = process.argv.slice(2)
const devConfig = require(path.resolve(
  __dirname,
  '../lib/config/config.dev.js'
))
const prodConfig = require(path.resolve(
  __dirname,
  '../lib/config/config.prod.js'
))
let compiler, server, mode, ready, commandError, configError

// Configure webpack log/error handling
const handleLogging = stats => {
  const info = stats.toJson('verbose')

  if (stats.hasErrors()) {
    runesmith.error(info.errors)
  }

  if (stats.hasWarnings()) {
    runesmith.warn(info.warnings)
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
    runesmith.log(
      `Compiling changes from: ${changedSource}`,
      chalk.grey(`(${buildData.time}ms)`)
    )
  }
}

// Prepare webpack interface
switch (task) {
  case 'start':
  case 'watch':
  case 'run':
  case 'dev':
  case 'develop':
  case 'development':
    if (!devConfig) configError = 'development'
    webpackDevServer.addDevServerEntrypoints(devConfig, {})
    compiler = devConfig && webpack(devConfig)
    compiler.hooks.done.tap('done', stats => handleLogging(stats))
    server = new webpackDevServer(compiler, devConfig.devServer)
    mode = 'development'
    break

  case 'build':
  case 'bundle':
  case 'compile':
  case 'prod':
  case 'production':
    if (!prodConfig) configError = 'production'
    compiler = prodConfig && webpack(prodConfig)
    compiler.hooks.done.tap('done', stats => handleLogging(stats))
    server = false
    mode = 'production'
    break

  default:
    compiler = false
    commandError = true
    break
}

// Runesmith configured correctly
if (compiler) {
  // Clear the console
  runesmith.clear()

  // Run webpack
  if (server && mode === 'development')
    server.listen(8080, '127.0.0.1', () => {
      if (!ready) {
        runesmith.clear()
        runesmith.log(`Listening on: ${chalk.cyan('http://127.0.0.1:8080')}`)
        ready = true
      }
    })
  if (mode === 'production')
    compiler.run(() => {
      if (!ready) {
        runesmith.clear()
        runesmith.log(
          `Build finished in: ${chalk.green(prodConfig.output.path)}`
        )
      }
    })
} else {
  // Runesmith can't run
  if (commandError) {
    runesmith.error(`Unknown command: "runesmith ${task}"`)
    process.exit(1)
  }

  if (configError) {
    runesmith.error(`Unable to load ${configError} configuration.`)
  }

  process.exit(1)
}
