// export * as SheetLayout from "./sheet-layout/main.jsx"
// export * as RollTemplates from "./roll-templates/main.jsx"
// export * as Sheetworkers from "./sheetworkers/main.jsx"

/**
 * Manifest for the custom sheet's files
 */
import { getComponent } from "../../utils.js"
export const SheetLayout = await getComponent("sheet-layout")
export const RollTemplates = await getComponent("roll-templates")
export const Sheetworkers = await getComponent("sheetworkers")
