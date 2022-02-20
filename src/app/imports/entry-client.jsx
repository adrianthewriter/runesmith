import React from "https://esm.sh/react@17?dev"
import ReactDOM from "https://esm.sh/react-dom@17?dev"

import { SheetLayout } from "/sheet-layout/main.jsx"
import * as RollTemplates from "/roll-templates/main.jsx"

const frame = document.querySelector(".characterdialog iframe")

const frameDoc = frame.contentDocument
  ? frame.contentDocument
  : frame.contentWindow.document

ReactDOM.render(<SheetLayout />, frameDoc.querySelector(".charactersheet"))

// frameDoc.addEventListener("DOMContentLoaded", function FrameDocLoaded() {
//   ReactDOM.render(<SheetLayout />, frameDoc.querySelector(".charactersheet"))
// })

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

ReactDOM.render(
  <>
    <div className='message system'>
      <div className='spacer'></div>
      <h1 style={{ fontSize: "1.2em" }}>Roll20 Runesmith</h1>
      <p>
        Your custom <strong>character sheet</strong> is displayed to the left,
        and your custom <strong>roll templates</strong> are displayed below.
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
  </>,
  document.querySelector(".textchatcontainer .content")
)
