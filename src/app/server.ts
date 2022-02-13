import { Drash } from "../deps.ts"
import { emit, paths, getProjectName } from "../utils.ts"

import { RenderHtmlService } from "./renderHtmlService.tsx"

// Compile the client.js file
const files = await emit(`${paths.rs_path}/src/app/client.tsx`)

// Create the resources

class WrapperResource extends Drash.Resource {
  public paths = ["/"]

  public GET(_request: Drash.Request, response: Drash.Response): void {
    const html = response.render("./wrapper.template.eta", {
      title: (getProjectName() as string) || "sheet goes here!",
    }) as string

    response.html(html)
  }
}

class SheetResource extends Drash.Resource {
  public paths = ["/sheet"]

  public GET(_request: Drash.Request, response: Drash.Response): void {
    const html = response.render("./dev.template.eta", {
      sheet: "sheet goes here!",
    }) as string

    response.html(html)
  }
}

class ClientResource extends Drash.Resource {
  paths = ["/rs-bundle.js"]

  public GET(_request: Drash.Request, response: Drash.Response): void {
    response.send("application/javascript", files["deno:///bundle.js"])
  }
}

class FileResource extends Drash.Resource {
  paths = ["/favicon.ico", "/public/.*.(jpg|png|svg|css|js)"]

  public GET(request: Drash.Request, response: Drash.Response): void {
    const path = new URL(request.url).pathname
    return response.file(`.${path}`)
  }
}

// Create and run the server

const server = new Drash.Server({
  hostname: "localhost",
  port: 8080,
  protocol: "http",
  resources: [WrapperResource, SheetResource, ClientResource, FileResource],
  services: [new RenderHtmlService()],
})

export const RunesmithServer = server

// server.run()

// await Deno.stdout.write(
//   new TextEncoder().encode(`Server running at ${server.address}.`)
// )
// console.log(`Server running at ${server.address}.`)
