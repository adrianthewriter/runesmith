// import { write } from "node-cli"
import { createRequire } from "module"
const require = createRequire(import.meta.url)

import { clear, print, prompt, jsx } from "./toolbox.js"
const { h, render, write, Text } = jsx

/**
 * Runesmith CLI
 */
export default class RunesmithCLI {
  static #command = process.argv.splice(2)

  /**
   * @param {string} [command] - a string of Runesmith cli commands to parse. If not provided, uses node's process.argv instead.
   */
  static run(command) {
    command = command ? command.split(" ") : this.#command

    if (!command.length) {
      write(
        <p>
          <strong>ᚱunesmith</strong>, a <a href='http://roll20.net'>Roll20</a>{" "}
          custom character sheet development environment
        </p>
      )
    } else {
      switch (command[0]) {
        case "dev":
          require("./commands/dev.js")(...command.splice(2))
      }
    }
  }
}
