import fs from "fs"
import path from "path"
import express from "express"
import { createServer as createViteServer } from "vite"
import react from "@vitejs/plugin-react"
import logwatch from "./vite-plugin-logwatch.js"

import { paths, resolve } from "../utils.js"
import { clear, print, prompt, link, spinner } from "../cli/toolbox.js"

export class RunesmithServer {
  #vite
  #server
  #config

  constructor(options = null) {
    const defaultConfig = {
      root: resolve(paths.rs_path, "server"),
      publicDir: "assets",
      server: {
        host: "localhost",
        port: 8080,
      },
    }
    this.#config = { ...defaultConfig, ...options }
  }

  async #createServer(config) {
    // set up vite
    const vite = await createViteServer({
      configFile: false,
      middlewareMode: "ssr",
      // root: resolve(paths.rs_path, "server"),

      plugins: [react(), logwatch()],
      clearScreen: false,
      // logLevel: "silent",
    })

    // Set up express
    const app = express()
    app.use(vite.middlewares)

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl

      console.log(">>> url:", url)

      try {
        // 1. Read 'outer' template
        let template = fs.readFileSync(
          path.resolve(paths.rs_path, "./outer-template.html"),
          "utf-8"
        )

        // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
        //    also applies HTML transforms from Vite plugins, e.g. global preambles
        //    from @vitejs/plugin-react
        template = await vite.transformIndexHtml(url, template)

        // 3. Load the server entry. vite.ssrLoadModule automatically transforms
        //    your ESM source code to be usable in Node.js! There is no bundling
        //    required, and provides efficient invalidation similar to HMR.
        const { renderStatic } = await vite.ssrLoadModule("/entry.jsx")

        // 4. render the app HTML. This assumes entry-server.js's exported `render`
        //    function calls appropriate framework SSR APIs,
        //    e.g. ReactDOMServer.renderToString()
        const sheetLayoutHtml = await renderStatic("sheet-layout")
        const rollTemplatesHtml = await renderStatic("roll-templates")

        // 5. Inject the app-rendered HTML into the template.
        const html = template.replace(
          `<!--roll-templates-->`,
          rollTemplatesHtml
        )

        // 6. Send the rendered HTML back.
        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (e) {
        // If an error is caught, let Vite fix the stracktrace so it maps back to
        // your actual source code.
        vite && vite.ssrFixStacktrace(e)
        console.log(e.stack)
        res.status(500).end(e.stack)
      }
    })

    // app.get("/", (req, res, next) => {
    //   console.log(req)
    //   res.send("root")
    // })

    return { app, vite }
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

  async start() {
    this.#createServer().then(({ app }) => {
      spinner.succeed(
        `Serving at ${link(`http://${this.host}:${this.port}`)} \n`
      )
    })
  }

  async stop() {
    await this.#server.close()
  }
}
