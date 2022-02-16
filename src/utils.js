import path from "path"
import { fileURLToPath } from "url"

/**
 * Resolve common paths`
 */
export const paths = {
  app_path: process.cwd(),
  rs_path: path.normalize(`${fileURLToPath(new URL(import.meta.url))}/..`),
}
