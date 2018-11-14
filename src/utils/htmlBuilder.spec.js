const { expect } = require('chai');
const method = require('./htmlBuilder');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  describe('composeHTML', () => {
    it('makes handlebars composing', async function func() {
      const htmlSource = '<div> {{url}}';
      const context = { url: 'Hello' };

      const result = method.composeHTML(htmlSource, context);

      expect(result).to.be.ok;
    });
    it('return handlebars composing error', async function func() {
      const htmlSource = '<div> {{{url}} incorrect input';
      const context = { url: 'Hello' };

      try {
        method.composeHTML(htmlSource, context);
      } catch (ex) {
        expect(ex).to.be.an('error');
      }
    });
  });
  describe('setInlineCSS', () => {
    it('resolves inline-css ', async function func() {
      const htmlSource = '<div> {{url}}';
      const result = method.setInlineCSS(htmlSource);
      expect(result).to.be.an('promise');
      expect(result).to.be.resolved;
    });

    it('rejects inline-css ', async function func() {
      const htmlSource = '<div> <style> {{};}{{{url}} incorrect input';
      const result = method.setInlineCSS(htmlSource);
      expect(result).to.be.an('promise');
      expect(result).to.be.rejected;
    });
  });
});
