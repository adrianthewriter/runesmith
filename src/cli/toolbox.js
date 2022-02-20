import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"
import termLink from "terminal-link"

export const rs = {
  symbol: chalk.dim.bold("[ᚱ]"),
}

/**
 * Clears the terminal
 */
export const clear = () => {
  console.clear()
}

/**
 * Print to stdout
 * @param  {string} message - the message to display
 */
export const print = (message) => {
  // const message = args.length > 1 ? args[1] : args[0]
  if (!message || typeof message !== "string") {
    console.trace('print() must be called with a "message" field')
  }
  console.log(message)
}

/**
 * Prompt the user for input
 * @param {string} opts.type - either comfirm, select, or multiselect
 * @param {string} opts.message - the question or instructions for the prompt
 * @param {string[]} [opts.choices] - the choices to display for a select or multiselect
 * @returns the user's input
 */
export const prompt = (opts) => {
  if (!opts || typeof opts !== "object") {
    console.trace(
      `prompt() needs an options object. See ${link(
        "Prompts",
        "https://github.com/terkelg/prompts",
        { fallback: false }
      )} for more info.`
    )
  }
  return prompts(opts)
}

/**
 * Create a spinner using https://github.com/sindresorhus/ora
 */
export const spinner = ora({ spinner: "simpleDotsScrolling" })

/**
 * Create a link with fallbacks
 */
export const link = (url, text, opts = {}) => {
  if (!text) return chalk.cyan(url)
  return chalk.cyan(termLink(text, url, opts))
}
