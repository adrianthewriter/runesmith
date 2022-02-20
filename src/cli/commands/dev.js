/**
 * COMMAND: "rs dev" - start the Runesmith development server
 */
import chalk from "chalk"
import { clear, print, prompt, link, spinner } from "../toolbox.js"
import RunesmithServer from "../../app/serve.js"

export default class DevCommand {
  static run() {
    print(`Starting the Runesmith development environment...`)
    try {
      const rs = new RunesmithServer()
      rs.start()
      spinner.succeed(`Serving at ${link(`http://${rs.host}:${rs.port}`)} \n`)
    } catch (err) {
      spinner.fail(`The Runesmith server failed to load`)
      console.trace(err)
      process.exit(1)
    }
  }
}
