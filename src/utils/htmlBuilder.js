const handlebars = require('handlebars')
const inlineCSS = require('inline-css')

function composeHTML(htmlSource, context) {
  const result = handlebars.compile(htmlSource)(context)

  return result
}

const setInlineCSS = async htmlSource => {
  const inlineOptions = {
    applyStyleTags: true,
    url: 'fake-url',
  }

  return inlineCSS(htmlSource, inlineOptions)
}

module.exports = {
  composeHTML,
  setInlineCSS,
}
