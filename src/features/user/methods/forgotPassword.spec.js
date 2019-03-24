const faker = require('faker');
const { expect } = require('chai');
const UserModel = require('../../../features/user/model');
const TokenModel = require('../../../features/token/model');
const method = require('./forgotPassword');
const ObjectId = require('mongoose').Types.ObjectId;
const {
  responseSender
} = require('../../../utils');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  const userData = {
    email      : faker.internet.email(),
    supervisor : ObjectId(),
    accessRole : ObjectId(),
    createdUser: {
      _id: ObjectId()
    }
  };
  const validReq = {
    body: {
      email: faker.internet.email()
    }
  };
  const notValidReq = {
    body: {
      email: faker.lorem.word()
    }
  };

  describe('validation', () => {
    it('returns validation error', async function func() {
      const getOneSpy = this.sandbox.spy(UserModel, 'getOne');
      const okSpy = this.sandbox.spy(responseSender, 'ok');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = notValidReq;

      await method(req, res, noop);

      expect(getOneSpy).not.called;
      expect(okSpy).not.called;
      expect(validationErrorSpy).called;
    });

    it('succeeds validation', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const okSpy = this.sandbox.spy(responseSender, 'ok');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(getOneStub).called;
      expect(okSpy).called;
      expect(validationErrorSpy).not.called;
    });
  });

  describe('user getOne', () => {
    it('finds User on getOne', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const okSpy = this.sandbox.spy(responseSender, 'ok');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(getOneStub).called;
      expect(errorSpy).not.called;
      expect(okSpy).called;
    });

    it('not finds user on getOne', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const okSpy = this.sandbox.spy(responseSender, 'ok');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(getOneStub).called;
      expect(errorSpy).not.called;
      expect(okSpy).called;
    });

    it('returns error getOne', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithReject(new Error('Custom error getOne'));
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const okSpy = this.sandbox.spy(responseSender, 'ok');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(getOneStub).called;
      expect(errorSpy).called;
      expect(okSpy).not.called;
    });
  });

  describe('token update', () => {
    /* eslint-disable no-unused-vars */
    it('updates token successfully', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const updateTokenStub = this.sandbox.stub(TokenModel, 'updateOne').returnsWithResolve();
      const okSpy = this.sandbox.spy(responseSender, 'ok');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(updateTokenStub).called;
      expect(errorSpy).not.called;
      expect(okSpy).called;
    });

    it('returns error on updateOne', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const updateTokenStub = this.sandbox.stub(TokenModel, 'updateOne').returnsWithReject(new Error('Custom error token update'));
      const okSpy = this.sandbox.spy(responseSender, 'ok');
      const errorSpy = this.sandbox.spy(responseSender, 'error'); const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(updateTokenStub).called;
      expect(errorSpy).called;
      expect(okSpy).not.called;
    });
  });
});
