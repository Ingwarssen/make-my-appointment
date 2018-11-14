const faker = require('faker');
const { expect } = require('chai');
const method = require('./loginFromCms');
const UserModel = require('../../user/model');
const responseSender = require('../../../utils/responseSender');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('not passes validation', async function test() {
    const getOneAdminSpy = this.sandbox.spy(UserModel, 'getOne');
    const validationErrorSpy = this.sandbox.stub(responseSender, 'validationError');
    const next = this.custom.noop;
    const res = this.custom.res;
    const req = {
      body: {
        email   : faker.lorem.word(), // invalid email
        password: faker.lorem.word()
      }
    };

    await method(req, res, next);

    expect(validationErrorSpy).calledOnce;
    expect(getOneAdminSpy).not.calledOnce;
  });
});
