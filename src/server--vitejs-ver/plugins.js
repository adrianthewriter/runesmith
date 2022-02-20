import fs from "fs"
import { paths, projectName, resolve } from "../utils.js"

export default [
  {
    name: "inner-transform",
    transformIndexHtml(html, ctx) {
      if (ctx.server && ctx.path === "/inner.html") {
      }
    },
  },
  {
    name: "index-title-transform",
    enforce: "post",
    load(html, ctx) {
      if (ctx.server && ctx.path === "/index.html") {
        // Change the <title/> to include the project name
        return html.replace("<!--project-title-->", projectName)
      }
    },
  },
  {
    name: "index-inject",
    enforce: "pre",
    buildStart() {
      const templatePath = resolve(paths.rs_path, "server/outer.html")
      console.log("template >>>", templatePath)
      this.emitFile({
        type: "asset",
        fileName: "index.html",
        source: fs.readFileSync(templatePath, {
          encoding: "utf-8",
        }),
      })
    },
  },
]
