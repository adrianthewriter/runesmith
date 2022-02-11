import { Drash } from "../deps.ts"
import { getProjectName } from "../utils.ts"

import { RenderHtmlService } from "./renderHtmlService.tsx"

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

// Create and run the server

const server = new Drash.Server({
  hostname: "localhost",
  port: 8080,
  protocol: "http",
  resources: [WrapperResource, SheetResource],
  services: [new RenderHtmlService()],
})

server.run()

console.log(`Server running at ${server.address}.`)
