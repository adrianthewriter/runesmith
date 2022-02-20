import chalk from "chalk"
import { clear, print, prompt, link } from "./toolbox.js"

/**
 * Runesmith CLI
 */
export default class RunesmithCLI {
  static #command = process.argv.splice(2)

  /**
   * @param {string} [command] - a string of Runesmith cli commands to parse. If not provided, uses node's process.argv instead.
   */
  static async run(command) {
    command = command ? command.split(" ") : this.#command

    if (command.length === 0) {
      clear()
      print(
        `Welcome to ${chalk.bold.dim("Runesmith")}, a ${chalk.cyan.underline(
          link("Roll20", "http://roll20.net")
        )} custom character sheet development environment
        `
      )

      // Find the command to run
      const selection = await prompt({
        type: "select",
        name: "command",
        message: "Which commmand would you like to run?",
        choices: [
          {
            title: "Develop",
            description: "Start the development environment",
            value: "dev",
          },
          {
            title: "Build",
            value: "build",
            description: "Output compiled files for use in Roll20",
            disabled: true,
          },
        ],
      })
      console.log(">>> selection = ", selection)

      command = selection.command
    } else if (command.length > 0) {
      const args = command.splice(2)
      command = command[0]
    }

    // Run the called command now

    switch (command) {
      case "run":
      case "dev":
        import("./commands/dev.js").then((c) => c.default.run())
        // .catch((err) => console.trace(err))
        break

      default:
        console.log(">>>", "default command called!")
        break
    }
  }
}
