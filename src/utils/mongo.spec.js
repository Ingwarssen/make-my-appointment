const { expect } = require('chai');

const method = require('./mongo');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('returns connection', async function func() {
    expect(method.connect).to.be.an('function');
    expect(method.connection).to.be.an('object');
    expect(method.dropDatabase).to.be.an('function');
  });
});
