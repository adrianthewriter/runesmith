#!/usr/bin/env node
const path = require('path')
const { sync } = require('cross-spawn')

const [task] = process.argv.slice(2)
const devConfig = path.resolve(__dirname, '../lib/config/config.dev.js')
const prodConfig = path.resolve(__dirname, '../lib/config/config.prod.js')

let result
switch (task) {
  case 'start': {
    result = sync('npx webpack serve', ['--config', devConfig, '--progress'], {
      stdio: 'inherit',
    })
    break
  }
  case 'build': {
    result = sync('npx webpack', ['--config', prodConfig, '--progress'], {
      stdio: 'inherit',
    })
    break
  }
  default:
    console.log(`Unknown script "${task}".`)
}

if (result.signal) {
  console.log('signal:', result.signal)
  process.exit(1)
}

process.exit(result.status)
