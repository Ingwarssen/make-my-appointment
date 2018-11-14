const RESPONSES = require('./../constants/responses');
const { expect } = require('chai');

const method = require('./pageNotFoundHandler');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('returns html', async function func() {
    const res = this.custom.res;
    const next = this.custom.noop;
    const req = {
      accepts(data) {
        return data === 'html';
      }
    };

    method(req, res, next);

    expect(res.data).to.be.equal(RESPONSES.PAGE_NOT_FOUND);
    expect(res.status).to.be.equal(404);
  });
  it('returns json', async function func() {
    const res = this.custom.res;
    const next = this.custom.noop;
    const req = {
      accepts(data) {
        return data === 'json';
      }
    };

    method(req, res, next);

    expect(res.data.error).to.be.equal(RESPONSES.PAGE_NOT_FOUND);
    expect(res.status).to.be.equal(404);
  });
  it('returns text', async function func() {
    const res = this.custom.res;
    const next = this.custom.noop;
    const req = {
      accepts() {
        return false;
      }
    };

    method(req, res, next);

    expect(res.data).to.be.equal(RESPONSES.PAGE_NOT_FOUND);
    expect(res.status).to.be.equal(404);
    expect(res.type).to.be.equal('txt');
  });
});
