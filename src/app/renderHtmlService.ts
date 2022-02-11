import { Drash, Eta } from "../deps.ts"
import { paths, normalizePath } from "../utils.ts"

interface IOptions {
  views_path?: string
  static_mode?: boolean
}

export class RenderHtmlService extends Drash.Service {
  readonly #options: IOptions
  #template_engine = Eta
  #views_path: string

  constructor(options?: IOptions) {
    super()
    this.#options = options || {}
    this.#views_path =
      options?.views_path || `${paths.rs_path}/src/app/templates`
  }

  /**
   * Run this service before the resource's HTTP method.
   */
  public runBeforeResource(
    request: Drash.Request,
    response: Drash.Response
  ): void {
    console.log(request)

    // console.log(this.#views_path)
    response.headers.set("Content-Type", "text/html")
    response.render = (
      filepath: string,
      data: Record<string, unknown>
    ): string | boolean => {
      const templatePath = normalizePath(`${this.#views_path}/${filepath}`)
      const template = Deno.readTextFileSync(templatePath)
      const result = this.#template_engine.render(template, data)

      if (typeof result === "string") return result
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
