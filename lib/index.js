import React from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'

import RunesmithSheetWorkers from './util/runesmith-helper'

const Runesmith = {
  render: (Sheet, Templates) => {
    if (process.env.NODE_ENV !== 'production') {
      const frame = document.querySelector('.characterdialog iframe')
      const frameDoc = frame.contentDocument
        ? frame.contentDocument
        : frame.contentWindow.document

      frameDoc.addEventListener('DOMContentLoaded', event => {
        ReactDOM.render(
          React.createElement(Sheet, null, null),

          frameDoc.querySelector('.charactersheet')
        )
      })

      ReactDOM.render(
        React.createElement(Templates, null, null),
        document.querySelector('#rolltemplates')
      )
    }
  },

  renderStatic: (Sheet, Templates) => {
    renderToStaticMarkup(
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

// Webpack Entry Point Code
const Sheet = require('@layout').default
const Templates = require('@templates').default
Runesmith.render(Sheet, Templates)

export default () => {
  Runesmith.renderStatic(Sheet, Templates)
}
