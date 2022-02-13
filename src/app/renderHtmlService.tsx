import { Drash, Eta, React, ReactDOMServer } from "../deps.ts"
import { paths, normalizePath, getRequestPath } from "../utils.ts"
import { DefaultSheetLayout, DefaultRollTemplates } from "../lib/index.ts"
// import { SheetLayout, RollTemplates } from "app/index.js"

interface IOptions {
  views_path?: string
  sheetlayout_component?: React.ComponentType
  rolltemplates_component?: React.ComponentType
}

export class RenderHtmlService extends Drash.Service {
  readonly #options: IOptions

  // HTML templates
  #template_engine = Eta
  #views_path: string

  // React
  #jsxClient_engine = React
  #jsxServer_engine = ReactDOMServer
  SheetLayout: React.ComponentType
  RollTemplates: React.ComponentType

  constructor(options?: IOptions) {
    super()
    this.#options = options || {}
    this.#views_path =
      options?.views_path || `${paths.rs_path}/src/app/templates`

    this.SheetLayout = () => {
      // if (SheetLayout) return <SheetLayout />
      return <DefaultSheetLayout />
    }
    this.RollTemplates = () => {
      // if (RollTemplates) return <RollTemplates />
      return <DefaultRollTemplates />
    }
  }

  /**
   * Run this service before the resource's HTTP method.
   */
  public runBeforeResource(
    request: Drash.Request,
    response: Drash.Response
  ): void {
    // console.log(this.#views_path)
    response.headers.set("Content-Type", "text/html")
    response.render = (
      filepath: string,
      data: Record<string, unknown>
    ): string | boolean => {
      const requestPath = getRequestPath(request.url)

      // If this is the inner frame, add the <sheetlayout/> to data
      if (requestPath === "/sheet") {
        data.sheet = ReactDOMServer.renderToString(<this.SheetLayout />)
      }

      // Otherwise, add the <rolltemplates/> to data
      else if (requestPath === "/") {
        data.rolls = ReactDOMServer.renderToString(<this.RollTemplates />)
      }

      // Render html from template
      const templatePath = normalizePath(`${this.#views_path}/${filepath}`)
      const template = Deno.readTextFileSync(templatePath)
      const html = this.#template_engine.render(template, data)

      if (typeof html === "string") {
        return html
      }
      return false
    }
  }

  /**
   * Run this service after the resource's HTTP method.
   */
  // public runAfterResource(
  //   request: Drash.Request,
  //   response: Drash.Response
  // ): void {
  //   // Some code here
  // }
}
