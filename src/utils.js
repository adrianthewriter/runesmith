import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { cosmiconfigSync } from "cosmiconfig"
import { noCase, titleCase, paramCase as slugify } from "change-case-all"

import React from "react"

/**
 * Resolve common paths`
 */
export const paths = {
  app_path: process.cwd(),
  rs_path: path.normalize(
    path.dirname(fileURLToPath(new URL(import.meta.url)))
  ),
}

export const getConfig = () => {
  const cc = cosmiconfigSync("runesmith", { stopDir: process.cwd() })

  const config = {}
  const result = cc.search()

  if (!result || result.isEmpty) {
    const basename = path.basename(paths.app_path)
    config.slug = slugify(basename)
    config.name = titleCase(noCase(basename))
  }

  // Return the config
  return { ...config, ...result }
}

export const projectName = getConfig().name
export const projectSlug = getConfig().slug

export const resolve = (...pathSegments) => path.resolve(...pathSegments)

export const getComponent = async (dir) => {
  const relativePath = path.relative(
    paths.rs_path,
    `${paths.app_path}/src/${dir}/main.jsx`
  )
  let Component = await import(relativePath)
  Component = Object.values(Component)
  if (Component.length === 1) Component = Component.pop()

  // console.log("COMP >>>", Component)
  return Component
}
