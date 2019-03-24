const faker = require('faker');
const { expect } = require('chai');
const UserModel = require('../../../features/user/model');
const method = require('./changePassword');
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
  const pass = faker.internet.password();
  const validReq = {
    body: {
      oldPassword       : faker.internet.password(),
      newPassword       : pass,
      confirmNewPassword: pass
    },

    params : { userId: '1' },
    session: {
      uId: `${ObjectId()}`
    }
  };

  const notValidReq = {
    body: {
      newPassword       : faker.internet.password(),
      confirmNewPassword: faker.internet.password()
    },

    params : { userId: '1' },
    session: {
      uId: `${ObjectId()}`
    }
  };

  describe('validation', () => {
    it('returns validation error', async function func() {
      const nextStepSpy = this.sandbox.spy(UserModel, 'getOne');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = notValidReq;

      await method(req, res, noop);

      expect(nextStepSpy).not.called;
      expect(validationErrorSpy).called;
    });

    it('succeeds validation', async function func() {
      const nextStepSpy = this.sandbox.spy(UserModel, 'getOne');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(nextStepSpy).called;
      expect(validationErrorSpy).not.called;
    });

    it('returns error on same passwords', async function func() {
      const nextStepSpy = this.sandbox.spy(UserModel, 'getOne');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = {
        body: {
          oldPassword       : faker.internet.password(),
          newPassword       : faker.internet.password(),
          confirmNewPassword: faker.internet.password()
        },

        params : { userId: '1' },
        session: {
          uId: `${ObjectId()}`
        }
      };

      await method(req, res, noop);

      expect(nextStepSpy).not.called;
      expect(validationErrorSpy).not.called;
      expect(badRequestSpy).called;
    });
  });

  describe('get user from DB on getOne', () => {
    it('returns error', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithReject(new Error('Custom error user'));
      const nextStepSpy = this.sandbox.spy(UserModel, 'updateOne');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(getOneStub).called;
      expect(errorSpy).called;
      expect(nextStepSpy).not.called;
    });

    it('successfully finds user', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(UserModel, 'updateOne');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(getOneStub).called;
      expect(badRequestSpy).not.called;
      expect(errorSpy).not.called;
      expect(nextStepSpy).called;
    });

    it('not finds user by old password', async function func() {
      const getOneStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve();
      const nextStepSpy = this.sandbox.spy(UserModel, 'updateOne');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(getOneStub).called;
      expect(badRequestSpy).called;
      expect(errorSpy).not.called;
      expect(nextStepSpy).not.called;
    });
  });

  describe('update password', () => {
    /* eslint-disable no-unused-vars */
    it('returns error', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const updateOneStub = this.sandbox.stub(UserModel, 'updateOne').returnsWithReject(new Error('Custom error subordinates'));
      const nextStepSpy = this.sandbox.spy(responseSender, 'ok');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(updateOneStub).called;
      expect(errorSpy).called;
      expect(nextStepSpy).not.called;
    });

    it('successfully updates password', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const updateOneStub = this.sandbox.stub(UserModel, 'updateOne').returnsWithResolve({ data: true });
      const nextStepSpy = this.sandbox.spy(responseSender, 'ok');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validReq;

      await method(req, res, noop);

      expect(updateOneStub).called;
      expect(errorSpy).not.called;
      expect(nextStepSpy).called;
    });
  });
});
