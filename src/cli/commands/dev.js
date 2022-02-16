/**
 * COMMAND: "rs dev" - start the Runesmith development server
 */

import chalk from "chalk"
import link from "terminal-link"

import { RunesmithServer } from "../../server/server.js"

export default RunCommand = ({ spinner }) => {
  const spinner = print.spin(
    `${chalk.dim.bold("[ᚱ]:")} Running the Runesmith dev server...`
  )

  try {
    const rs = await new RunesmithServer()
    rs.start()
    spinner.succeed(
      `${chalk.dim.bold("[ᚱ]:")} The Runesmith server is running on ${link(
        "http://localhost:8080"
      )}`
    )
  } catch (err) {
    spinner.fail(
      `${chalk.dim.bold("[ᚱ]:")} The Runesmith server failed to load`
    )
    console.error(err)
    process.exit(1)
  }
}
