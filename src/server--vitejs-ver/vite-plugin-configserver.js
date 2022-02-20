import chalk from "chalk"
import { dirname } from "path"
import { paths } from "../utils.js"

export default function configureServerPlugin() {
  let server
  return {
    name: "configure-server",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // custom handle request...
        console.log(">>> REQ:", req.url)
        // console.log('>>> RES:',req)
        next()
      })
    },
  }
}
