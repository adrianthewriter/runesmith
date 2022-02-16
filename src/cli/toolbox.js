import prompts from "prompts"
import ora from "ora"
import link from "terminal-link"

export default Toolbox = {
  /**
   * Clears the terminal
   */
  clear: () => {
    await console.clear()
  },

  /**
   * Print to stdout
   * @param  {string|jsx} message - the message to display
   */
  print: async (message) => {
    // const message = args.length > 1 ? args[1] : args[0]
    if (!message) {
      console.error(new Error('print() must be called with a "message" field'))
    }

    if (typeof message === "string") {
      write(<Text>{message}</Text>)
    } else {
      write(message)
    }
  },

  /**
   * Prompt the user for input
   * @param {string} opts.type - either comfirm, select, or multiselect
   * @param {string} opts.message - the question or instructions for the prompt
   * @param {string[]} [opts.choices] - the choices to display for a select or multiselect
   * @returns the user's input
   */
  prompt: async (opts) => {
    if (!opts || typeof opts !== "object" || !opts.type) {
      throw new Error(
        'prompt() options object must be called with a "type" field'
      )
    }

    if (opts.type === "confirm") {
      const { message } = opts
      return await write(<YesNo question={message} />)
    }
    if (opts.type === "select") {
      const { message, choices } = opts
      return await write(<Select question={message} options={choices} />)
    } else if (opts.type === "multiselect") {
      const { message, choices } = opts
      return await write(<MultiSelect question={message} options={choices} />)
    } else {
      throw new Error(
        "prompt() type must be of type: confirm, select, or multiselect"
      )
    }
  },
}

/**
 * Loading Spinner
 */
const loadingSpinner = () => {
  return new Promise((resolve) => {
    let frame = 0
    const interval = setInterval(() => {
      frame++

      if (frame > 100) {
        clearInterval(interval)
        return resolve()
      }
      clear(1).then(() => {
        write(<Loading frame={frame}>Loadingnode-cli.</Loading>)
      })
    }, 1000 / 60)
  })
}
