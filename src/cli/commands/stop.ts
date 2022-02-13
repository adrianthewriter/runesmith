import { Line } from "../../deps.ts"
import { RunesmithServer as server } from "../../app/server.ts"

// Create the command

export default class RunesmithStopCommand extends Line.Subcommand {
  public signature = "stop"
  public description = "Stop the development environment"

  public handle() {
    server.close()
    console.log(`Server stopping at ${server.address}.`)
  }

  // public handle() {
  //   try {
  //     this.#debug = this.option("--debug") as boolean // Evalutes to true if specified by the user
  //     // run the server
  //     const serverPath = `${paths.rs_path}/src/app/server.ts`
  //     const p = Deno.run({
  //       cmd: [
  //         ...`deno run --allow-all --unstable --no-check`.split(" "),
  //         serverPath,
  //       ],
  //     })

  //     console.log(`Server running at ${server.address}.`)

  //     // const { code } = await p.status()
  //     // Deno.exit(code)
  //   } catch {
  //     // borked
  //     this.#log('"run" command failed')
  //   }
  // }

  // /**
  //  * Log messages if debug is enabled.
  //  *
  //  * @param message - The message to show in the log output.
  //  */
  // #log(message: string): void {
  //   if (this.#debug) {
  //     console.log(`[DEBUG] ${message}`)
  //   }
  // }
}
