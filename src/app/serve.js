import path from "path"
import { createServer } from "vite"
import react from "@vitejs/plugin-react"

import { paths, getConfig } from "../utils.js"
import runesmith from "./plugins/vite-plugin-runesmith.js"

export default class RunesmithServer {
  #server
  #config = {}
  #host = "localhost"
  #port = 8080

  constructor() {
    const defaultConfig = {
      configFile: false,
      root: path.resolve(paths.app_path, "src"),
      optimizeDeps: {
        entries: [
          "./sheet-layout/**/*.{js,jsx}",
          "./roll-templates/**/*.{js,jsx}",
          "./sheetworkers/**/*.{js,jsx}",
        ],
      },
      // resolve: {
      //   alias: {
      //     react: path.resolve(paths.rs_path, "../node_modules/react"),
      //     "react-dom": path.resolve(paths.rs_path, "../node_modules/react-dom"),
      //   },
      // },
      // resolve: {
      //   alias: {
      //     "@rs": path.resolve(paths.rs_path, "app/imports"),
      //     "@assets": path.resolve(paths.app_path, "assets"),
      //     "@sheet-layout": path.resolve(paths.app_path, "sheet-layout"),
      //     "@roll-templates": path.resolve(paths.app_path, "roll-templates"),
      //     "@sheetworkers": path.resolve(paths.app_path, "sheetworkers"),
      //   },
      // },
      publicDir: "assets",
      server: {
        host: this.#host,
        port: this.#port,
      },
      clearScreen: false,
      // logLevel: "silent",
    }

    let customViteDevPlugins = []
    const customViteDevConfig = getConfig().customViteDevConfig || {}
    if (customViteDevConfig.plugins) {
      customViteDevPlugins = customViteDevConfig.plugins
      delete customViteDevConfig.plugins
    }

    this.#config = {
      ...defaultConfig,
      ...customViteDevConfig,
    }

    this.#config.plugins = [react(), runesmith(), ...customViteDevPlugins]
  }

  get host() {
    return this.#host
  }

  get port() {
    return this.#port
  }

  get server() {
    return this.#server
  }

  async start() {
    this.#server = await createServer(this.#config)
    this.#server.listen()
  }

  async close() {
    await this.#server.close()
  }
}
