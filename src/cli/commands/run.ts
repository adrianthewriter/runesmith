import { Line } from "../../deps.ts"
// import { paths, normalizePath } from "../../utils.ts"

import { RunesmithServer as server } from "../../app/server.ts"

// Create the command

export class RunesmithRunCommand extends Line.Subcommand {
  public signature = "run"
  public description = "Start the development environment"

  public options = {
    "--debug": "Output debug logging.",
  }

  #debug = false

  public async handle() {
    server.run()
    console.log(`Server running at ${server.address}.`)

    const watcher = Deno.watchFs(Deno.cwd())
    console.log(`Watching for changes in "${Deno.cwd()}"`)
    for await (const event of watcher) {
      console.log(">>>> event", event)
      // Example event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
      server.close()
      server.run()
    }
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
