const { expect } = require('chai');
const method = require('./isApiAvailable');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('responds with status 200 and isAlive: Yep', async function func() {
    const res = this.custom.res;
    const req = {};

    method(req, res);

    expect(res.status).to.be.equal(200);
    expect(res.data).to.be.eql({ isAlive: 'Yep' });
  });
});
