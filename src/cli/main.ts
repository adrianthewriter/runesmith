import { Line } from "../deps.ts"
import { RunesmithRunCommand } from "./commands/index.ts"

// Create your main command

class RunesmithMainCommand extends Line.MainCommand {
  public signature = "runesmith"

  public subcommands = [RunesmithRunCommand]
}

// Construct your Line.CLI object and plug in your main command

const cli = new Line.CLI({
  name: "Runesmith", // Required config
  description: "A CLI tool for building Roll20.com charactersheets using React", // Required config
  version: "v0.2.0", // Required config
  command: RunesmithMainCommand, // Required config
})

// Run your CLI
export default cli
// cli.run()
