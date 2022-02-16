// const {createServer} = require('vite')
//
// const server = await createServer({
//   // any valid user config options, plus `mode` and `configFile`
//   configFile: false,
//   root: __dirname,
//   server: {
//     port: 1337
//   }
// })
// await server.listen()
//
// server.printUrls()

import { createServer } from "vite"
import react from "@vitejs/plugin-react"

import { paths } from "../utils.js"

export class RunesmithServer {
  #server
  #config

  constructor(options = null) {
    const defaultConfig = {
      configFile: false,
      root: paths.app_path,
      publicDir: "assets",
      server: {
        host: "localhost",
        port: 8080,
      },
      plugins: [react()],
    }
    this.#config = { ...defaultConfig, ...options }
  }

  async start() {
    this.#server = await createServer(this.#config)
    await this.#server.listen()
  }

  async stop() {
    await this.server.close()
  }
}
