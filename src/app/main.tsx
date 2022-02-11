// NOTE: this doesn't work -- moving to server.tsx...

import { React, ReactDOM, ReactDOMServer } from "../deps.ts"
import { paths } from "../utils.ts"

// import DefaultLayout from "@layout"
// import * as DefaultTemplates from "@templates"
// import RunesmithSheetWorkers from "./util/runesmith-helper"

// frontend/components/App.tsx

const DefaultLayout = () => <h1> This is the sheet!</h1>
const DefaultRollTemplates = () => <h1> This is the roll templates!</h1>

export const Runesmith = {
  render: (Sheet = DefaultLayout, Templates = DefaultRollTemplates) => {
    const frame = deno.querySelector(".characterdialog iframe")
    const frameDoc = frame.contentDocument
      ? frame.contentDocument
      : frame.contentWindow.document

    frameDoc.addEventListener("DOMContentLoaded", function FrameDocLoaded() {
      ReactDOM.render(<Sheet />, frameDoc.querySelector(".charactersheet"))
    })

    ReactDOM.render(
      <>
        <div key='header' className='message system'>
          <div className='spacer' />
          <h1 style={{ fontSize: "1.2em" }}>Roll20 Runesmith</h1>
          <p>
            Your custom <strong>character sheet</strong> template is displayed
            to the left, and your custom roll templates are displayed below.
          </p>
        </div>

        <div key='first-message' className='message general you'>
          <div className='spacer' />
          <span className='by'>Roll Templates:</span>
        </div>
      </>,

      deno.querySelector(".textchatcontainer .content")
    )
  },

  renderStatic: (Sheet = DefaultLayout, Templates = DefaultTemplates) => {
    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Sheet, null, null),
        React.createElement(Templates, null, null)
      )
    )
  },

  SheetWorkers: RunesmithSheetWorkers,
}

Runesmith.render()

if (module.hot) {
  module.hot.accept("@layout", () => Runesmith.render())
  module.hot.accept("@templates", () => Runesmith.render())
}

export default () => {
  return Runesmith.renderStatic()
}
