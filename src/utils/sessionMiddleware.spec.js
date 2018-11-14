const { expect } = require('chai');

const method = require('./sessionMiddleware');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('session.connect configures session', async function func() {
    expect(method.connect).to.be.an('function');
  });
});
