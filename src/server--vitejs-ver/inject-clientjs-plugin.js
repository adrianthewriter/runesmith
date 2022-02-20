import { getComponent } from "../utils.js"

export default function injectComponentsPlugin() {
  const virtualModuleId = "@runesmith-components"
  const resolvedVirtualModuleId = "\0" + virtualModuleId

  return {
    name: "inject-components", // required, will show up in warnings and errors
    enforce: "post",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const SheetLayout = getComponent("sheet-layout")
        const RollTemplates = getComponent("roll-templates")
        const Sheetworkers = getComponent("sheetworkers")

        return `export default {
          SheetLayout: ${SheetLayout},
          RollTemplates: ${RollTemplates},
          Sheetworkers: ${Sheetworkers}
        }`
      }
    },
  }
}
