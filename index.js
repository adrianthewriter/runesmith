import React from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import { appRoot } from './lib/config/paths'

import Sheet from `${appRoot}/layout`
import Templates from `${appRoot}/templates`

if (process.env.NODE_ENV !== 'production') {
  ReactDOM.render(<Sheet />, document.querySelector('.charactersheet'))
}

export default () => {
  const html = renderToStaticMarkup(
    <>
      <Sheet />
      <Templates />
    </>
  )
  return html
}
