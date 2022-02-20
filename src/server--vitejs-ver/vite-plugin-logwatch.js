import chalk from "chalk"
import { dirname } from "path"
import { paths } from "../utils.js"

export default function logWatchPlugin() {
  return {
    name: "log-on-watch",

    handleHotUpdate({ timestamp, file, modules }) {
      if (dirname(file).includes(paths.rs_path)) return modules

      timestamp = `[${new Date(timestamp).toLocaleString()}]`
      console.log(
        `${chalk.dim(timestamp)} File ${chalk.green.dim(
          file.replace(paths.app_path, "")
        )} updated.`
      )
    },
  }
}
