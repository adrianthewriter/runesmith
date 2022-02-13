/**
 * Dependenies
 */
export { createRequire } from "https://deno.land/std/node/module.ts"

// CLI related packages
export * as Line from "https://denopkg.com/drashland/line@v1.0.0/mod.ts" // CLI framework

// Server related packages
export * as Drash from "https://denopkg.com/drashland/drash@v2.5.1/mod.ts" // HTTP server framework
export * as Eta from "https://deno.land/x/eta@v1.12.3/mod.ts" // Templating engine
export { refresh } from "https://deno.land/x/refresh@1.0.0/mod.ts" // Reloads browser on file change

// React related packages
export { default as React } from "https://esm.sh/react@17?target=es2021"
export { default as ReactDOM } from "https://esm.sh/react-dom@17?target=es2021"
export { default as ReactDOMServer } from "https://esm.sh/react-dom@17/server?target=es2021"
export { default as PropTypes } from "https://esm.sh/prop-types@15.6?target=es2021"

// Stylesheet related packages
export { default as postcss } from "https://esm.sh/postcss?target=es2021"
export { default as autoprefixer } from "https://esm.sh/autoprefixer?target=es2021"
