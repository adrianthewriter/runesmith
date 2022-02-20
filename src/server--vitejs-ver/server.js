import { createServer } from "vite"
import react from "@vitejs/plugin-react"

import { paths, resolve } from "../utils.js"
import plugins from "./plugins.js"
import injectComponents from "./inject-clientjs-plugin.js"

export class RunesmithServer {
  #server
  #config

  constructor(options = null) {
    const defaultConfig = {
      configFile: false,
      root: resolve(paths.app_path),
      publicDir: "assets",
      server: {
        host: "localhost",
        port: 8080,
        // open: true,
      },
      plugins: [react(), ...plugins],
      clearScreen: false,
      // logLevel: "silent",
    }
    this.#config = { ...defaultConfig, ...options }
  }
  get root() {
    return this.#config.root
  }

  get host() {
    return this.#config.server.host
  }

  get port() {
    return this.#config.server.port
  }

  async start(config) {
    this.#server = await createServer(config ? config : this.#config)
    this.#server.listen()
  }

  async stop() {
    await this.server.close()
  }
}
