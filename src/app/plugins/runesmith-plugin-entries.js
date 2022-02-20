import fs from "fs"
import path from "path"
import { transformSync } from "esbuild"

import { paths, projectName } from "../../utils.js"

import { normalizePath, transformWithEsbuild } from "vite"

export default function runesmithEntries() {
  const entries = {
    indexPage: path.resolve(paths.rs_path, "app/templates/outer.html"),
    "/inner.html": path.resolve(paths.rs_path, "app/templates/inner.html"),
    "/rs-client.js": path.resolve(
      paths.rs_path,
      "app/imports/entry-client.jsx"
    ),
    "/manifest.js": path.resolve(paths.rs_path, "app/imports/manifest.js"),
  }

  return {
    name: "configure-entries",
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          console.log(">>>", req.url)

          // // Pre-render the jsx
          // const entryJsx = path.resolve(
          //   paths.rs_path,
          //   "app/imports/entry-server.jsx"
          // )
          // const render = (await server.ssrLoadModule(entryJsx)).render

          // Load the pages found in entries{}, and inject the rendered html...
          let code
          if (req.url === "/" || req.url.indexOf("index.html") >= 0) {
            code = (await this.load(normalizePath(entries.indexPage))) ?? ""
            code = code.replaceAll("<!--project-title-->", projectName) // replace the title tag
            // code = code.replace(
            //   "<!--roll-templates-->",
            //   render("roll-templates")
            // )
          } else if (req.url === "/inner.html") {
            code = (await this.load(normalizePath(entries[req.url]))) ?? ""
            // code = code.replace("<!--sheet-layout-->", render("sheet-layout"))
          } else if (req.url === "/rs-client.js") {
            code = (await this.load(normalizePath(entries[req.url]))) ?? ""
            code = transformSync(code, { loader: "jsx" }).code
          } else if (entries[req.url]) {
            code = (await this.load(normalizePath(entries[req.url]))) ?? ""
          } else {
            return next()
          }

          // send the result
          if (req.url.endsWith(".html")) {
            res.end(await server.transformIndexHtml(req.url, code))
          } else if (req.url.endsWith(".js") || req.url.endsWith(".jsx")) {
            res.setHeader("Content-Type", "text/javascript")
            res.end(code)
          }

          // return for further processing
          return next()
        })

        // server.middlewares.use("/sheet-layout", async (req, res, next) => {
        //   if (req.url.endsWith(".jsx")) {
        //     const resolvedPath = path.resolve(
        //       paths.app_path,
        //       "sheet-layout",
        //       req.url
        //     )
        //     const code = (await this.load(normalizePath(resolvedPath))) ?? ""
        //     res.setHeader("Content-Type", "text/javascript")
        //     res.end(code)
        //   }
        //   return next()
        // })

        // server.middlewares.use("/roll-templates", async (req, res, next) => {
        //   if (req.url.endsWith(".jsx")) {
        //     const resolvedPath = path.resolve(
        //       paths.app_path,
        //       "roll-templates",
        //       req.url
        //     )
        //     const code = (await this.load(normalizePath(resolvedPath))) ?? ""
        //     res.setHeader("Content-Type", "text/javascript")
        //     res.end(code)
        //   }
        //   return next()
        // })

        // server.middlewares.use("/sheetworkers", async (req, res, next) => {
        //   if (req.url.endsWith(".jsx")) {
        //     const resolvedPath = path.resolve(
        //       paths.app_path,
        //       "sheetworkers",
        //       req.url
        //     )
        //     const code = (await this.load(normalizePath(resolvedPath))) ?? ""
        //     res.setHeader("Content-Type", "text/javascript")
        //     res.end(code)
        //   }
        //   return next()
        // })
      }
    },
    async load(filePath, opts = {}) {
      const fileName = path.basename(filePath)
      const fileExt = path.extname(filePath).replace(".", "")
      const code = fs.existsSync(filePath) && fs.readFileSync(filePath, "utf-8")
      // const code = await transformWithEsbuild(file, fileName, {
      //   loader: fileExt,
      //   ...opts,
      // }).then(
      //   (result) => result.code,
      //   (err) => (file ? file : false)
      // )
      if (code) return code
      return null
    },
  }
}
