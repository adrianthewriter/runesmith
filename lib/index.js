import React from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'

import DefaultLayout from '../../../src/layout'
import DefaultTemplates from '../../../src/Templates'
import RunesmithSheetWorkers from './util/runesmith-helper'

export const Runesmith = {
  render: (Sheet = DefaultLayout, Templates = DefaultTemplates) => {
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

  renderStatic: (Sheet = DefaultLayout, Templates = DefaultTemplates) => {
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
Runesmith.render()

export default () => {
  Runesmith.renderStatic()
}
