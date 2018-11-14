const { expect } = require('chai');

const method = require('./setIsMobileMiddleware');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('sets isMobile and runs next', async function func() {
    const req = {};
    const res = this.custom.res;
    const next = this.sandbox.spy();

    method(req, res, next);

    expect(req.isMobile).to.be.equal(true);
    expect(next).calledOnce;
  });
});
