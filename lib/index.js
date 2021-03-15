import React from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'

import DefaultLayout from '@layout'
import * as DefaultTemplates from '@templates'
import RunesmithSheetWorkers from './util/runesmith-helper'

export const Runesmith = {
  render: (Sheet = DefaultLayout, Templates = DefaultTemplates) => {
    if (process.env.NODE_ENV !== 'production') {
      const frame = document.querySelector('.characterdialog iframe')
      const frameDoc = frame.contentDocument
        ? frame.contentDocument
        : frame.contentWindow.document

      frameDoc.addEventListener('DOMContentLoaded', function FrameDocLoaded() {
        ReactDOM.render(
          React.createElement(Sheet, null, null),
          frameDoc.querySelector('.charactersheet')
        )
      })

      ReactDOM.render(
        React.createElement(React.Fragment, null, [
          React.createElement(
            'div',
            { key: 'header', className: 'message system' },

            React.createElement('div', { className: 'spacer' }, null),
            React.createElement(
              'h1',
              { style: { fontSize: '1.2em' } },
              'Roll20 Runesmith'
            ),
            React.createElement(
              'p',
              null,
              'Your custom ',
              React.createElement('strong', null, 'character sheet'),
              ' is displayed to the left, and your custom ',
              React.createElement('strong', null, 'roll templates'),
              ' are displayed below.'
            )
          ),

          React.createElement(
            'div',
            { key: 'first-message', className: 'message general you' },

            React.createElement('div', { className: 'spacer' }, null),
            React.createElement('span', { className: 'by' }, 'Roll Templates:')
          ),

          // Add the templates
          ...Object.values(Templates).map(function TemplateWrapper(
            Template,
            key
          ) {
            return React.createElement(
              'div',
              {
                key: `rolltemplate-${key.toString()}`,
                className: 'message general you',
              },
              React.createElement(Template, null, null)
            )
          }),
        ]),
        document.querySelector('.textchatcontainer .content')
      )
    }
  },

  renderStatic: (Sheet = DefaultLayout, Templates = DefaultTemplates) => {
    return renderToStaticMarkup(
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

if (module.hot) {
  module.hot.accept('@layout', () => Runesmith.render())
  module.hot.accept('@templates', () => Runesmith.render())
}

export default () => {
  return Runesmith.renderStatic()
}
