#!/usr/bin/env node
const path = require('path')
const runCommand = require('yarpm')

const [task] = process.argv.slice(2)
const devConfig = path.resolve(__dirname, '../lib/config/config.dev.js')
const prodConfig = path.resolve(__dirname, '../lib/config/config.prod.js')

let result
switch (task) {
  case 'start': {
    result = runCommand(`run webpack serve --config ${devConfig} --progress`, {
      stdout: process.stdout,
    })
    break
  }
  case 'build': {
    result = runCommand(`run webpack --config ${prodConfig} --progress`, {
      stdout: process.stdout,
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
