const faker = require('faker');
const { expect } = require('chai');
const method = require('./encrypt');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('encrypts input password', async function func() {
    const pass = faker.internet.password();
    const result = method(pass);

    expect(result).to.be.not.equal(pass);
  });
});
