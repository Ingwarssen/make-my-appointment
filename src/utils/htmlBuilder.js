const handlebars = require('handlebars');
const inlineCSS = require('inline-css');

function composeHTML(htmlSource, context) {
  const result = handlebars.compile(htmlSource)(context);

  return result;
}

const setInlineCSS = async htmlSource => {
  const inlineOptions = {
    applyStyleTags: true,
    url           : 'fake-url'
  };

  let htmlResult;
  try {
    htmlResult = await inlineCSS(htmlSource, inlineOptions);
  } catch (ex) {
    throw ex;
  }

  return htmlResult;
};

module.exports = {
  composeHTML,
  setInlineCSS
};
