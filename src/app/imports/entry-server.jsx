import React from "react"
import ReactDOMServer from "react-dom/server"

import { SheetLayout, RollTemplates, Sheetworkers } from "./manifest.js"

export function render(type) {
  return false
  switch (type) {
    case "sheet-layout":
      return ReactDOMServer.renderToString(<SheetLayout />)
      break
    case "roll-templates":
      const Rolls = Object.values(RollTemplates).map(function TemplateWrapper( // Add the templates
        Template,
        key
      ) {
        return (
          <div
            key={`rolltemplate-${key.toString()}`}
            className={"message general you"}
          >
            <Template />
          </div>
        )
      })

      ReactDOMServer.renderToString(
        <>
          <div className='message system'>
            <div className='spacer'></div>
            <h1 style={{ fontSize: "1.2em" }}>Roll20 Runesmith</h1>
            <p>
              Your custom <strong>character sheet</strong> is displayed to the
              left, and your custom <strong>roll templates</strong> are
              displayed below.
            </p>
          </div>

          <div className='message general you'>
            <div className='spacer'></div>
            <span className='by'>Roll Templates:</span>
          </div>

          {Rolls}

          <div className='message general'>
            <div className='spacer'></div>
            ...
          </div>
        </>
      )
      break
  }
}
