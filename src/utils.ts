/**
 * Common Utilities
 */

import * as path from "https://deno.land/std@0.125.0/path/mod.ts"

/**
 * Resolve common paths`
 */
export const paths = {
  app_path: Deno.cwd(),
  rs_path: path.normalize(
    `${path.dirname(path.fromFileUrl(import.meta.url))}/../`
  ),
}
export const join = (...args: string[]): string => path.join(...args)
export const normalizePath = (p: string): string => path.normalize(p)
export const getProjectName = (): string =>
  path.basename(path.dirname(Deno.cwd()))
export const getRequestPath = (path: string) => {
  const url = path
  const regex = /\/\/.+(\/.*$)/
  const match = url.match(regex)
  if (match) return match[1]
}

// Emit

export const emit = async (path: string): Promise<any> => {
  return await Deno.emit(path, {
    check: false,
    bundle: "module",
    target: "es6",

    compilerOptions: {
      lib: ["deno.ns", "dom", "esnext"],
      strict: true /* Enable all strict type-checking options. */,
      esModuleInterop:
        true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
      skipLibCheck: true /* Skip type checking of declaration files. */,
      forceConsistentCasingInFileNames:
        true /* Disallow inconsistently-cased references to the same file. */,
    },
  })
}
