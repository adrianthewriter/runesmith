/**
 * Common Utilities
 */

import {
  basename,
  dirname,
  normalize,
  fromFileUrl,
} from "https://deno.land/std@0.125.0/path/mod.ts"

/**
 * Resolve common paths`
 */
export const paths = {
  app_path: Deno.cwd(),
  rs_path: normalize(`${dirname(fromFileUrl(import.meta.url))}/../`),
}

export const normalizePath = (path: string): string => normalize(path)
export const getProjectName = (): string => basename(dirname(Deno.cwd()))
