const faker = require('faker');
const { expect } = require('chai');
const method = require('./cacheControlMiddleware');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('sets header in case of Trident or Edge', async function func() {
    const agent = faker.random.arrayElement(['Trident', 'Edge']);
    const res = this.custom.res;
    const next = this.sandbox.spy();
    res.header = this.sandbox.spy();
    const req = {
      headers: {
        'user-agent': agent
      }
    };

    method(req, res, next);

    expect(res.header).calledOnce;
    expect(next).calledOnce;
  });
  it('not sets header in other case', async function func() {
    const agent = faker.lorem.words();
    const res = this.custom.res;
    const next = this.sandbox.spy();
    res.header = this.sandbox.spy();
    const req = {
      headers: {
        'user-agent': agent
      }
    };

    method(req, res, next);

    expect(res.header).not.called;
    expect(next).calledOnce;
  });
});
