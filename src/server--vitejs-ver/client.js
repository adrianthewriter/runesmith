import { SheetLayout, RollTemplates, Sheetworkers } from "@runesmith-components"

if (process.env.NODE_ENV !== "production") {
  const frame = document.querySelector(".characterdialog iframe")
  const frameDoc = frame.contentDocument
    ? frame.contentDocument
    : frame.contentWindow.document

  frameDoc.addEventListener("DOMContentLoaded", function FrameDocLoaded() {
    ReactDOM.render(
      React.createElement(SheetLayout, null, null),
      frameDoc.querySelector(".charactersheet")
    )
  })

  ReactDOM.render(
    React.createElement(React.Fragment, null, [
      React.createElement(
        "div",
        { key: "header", className: "message system" },

        React.createElement("div", { className: "spacer" }, null),
        React.createElement(
          "h1",
          { style: { fontSize: "1.2em" } },
          "Roll20 Runesmith"
        ),
        React.createElement(
          "p",
          null,
          "Your custom ",
          React.createElement("strong", null, "character sheet"),
          " is displayed to the left, and your custom ",
          React.createElement("strong", null, "roll templates"),
          " are displayed below."
        )
      ),

      React.createElement(
        "div",
        { key: "first-message", className: "message general you" },

        React.createElement("div", { className: "spacer" }, null),
        React.createElement("span", { className: "by" }, "Roll Templates:")
      ),

      // Add the templates
      ...Object.values(RollTemplates).map(function TemplateWrapper(
        Template,
        key
      ) {
        return React.createElement(
          "div",
          {
            key: `rolltemplate-${key.toString()}`,
            className: "message general you",
          },
          React.createElement(Template, null, null)
        )
      }),
    ]),
    document.querySelector(".textchatcontainer .content")
  )
}

// export function renderStatic(type) {
//   switch (type) {
//     case "sheet-layout":
//       return ReactDOMServer.renderToString(<SheetLayout />)
//       break
//     case "roll-templates":
//       const rolls = Object.values(RollTemplates).map(function TemplateWrapper( // Add the templates
//         Template,
//         key
//       ) {
//         return React.createElement(
//           <div
//             key={`rolltemplate-${key.toString()}`}
//             className={"message general you"}
//           >
//             <Template />
//           </div>
//         )
//       })
//       return ReactDOMServer.renderToString(<SheetLayout />)
//       break
//   }
// }

// function build() {
//   return renderToStaticMarkup(
//     React.createElement(
//       React.Fragment,
//       null,
//       React.createElement(SheetLayout, null, null),
//       React.createElement(RollTemplates, null, null)
//     )
//   )
// }
