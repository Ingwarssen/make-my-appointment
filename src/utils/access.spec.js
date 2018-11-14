const faker = require('faker');
const { expect } = require('chai');
const UserModel = require('../features/user/model');
const method = require('./access');
const ObjectId = require('mongoose').Types.ObjectId;
const responseSender = require('./responseSender');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  const mid = faker.random.number({ min: 1, max: 20 });
  const accessType = faker.random.arrayElement(['create', 'read', 'update', 'delete']);
  const agentType = faker.random.arrayElement(['cms', 'mobile']);
  const provideAccessData = (access, agent, allow) => {
    return {
      access: {
        [agent]: {
          [access]: allow
        }
      }
    };
  };

  const isMobile = agentType === 'mobile';
  const validReq = {
    isMobile,
    params : { userId: '1' },
    session: {
      uId     : `${ObjectId()}`,
      loggedIn: true
    }
  };

  const notValidReq = {
    params : { userId: '1' },
    session: {
      uId     : `${ObjectId()}`,
      loggedIn: false
    }
  };

  describe('checkAuth', () => {
    it('not returns error', async function func() {
      const notAuthorizedSpy = this.sandbox.stub(responseSender, 'notAuthorized');
      const res = this.custom.res;
      const next = this.sandbox.spy();
      const req = validReq;

      await method.checkAuth(req, res, next);

      expect(notAuthorizedSpy).not.called;
      expect(next).called;
    });

    it('returns error', async function func() {
      const notAuthorizedSpy = this.sandbox.stub(responseSender, 'notAuthorized');
      const res = this.custom.res;
      const next = this.sandbox.spy();
      const req = notValidReq;

      await method.checkAuth(req, res, next);

      expect(notAuthorizedSpy).calledOnce;
      expect(next).not.called;
    });
  });

  describe('middleware', () => {
    it('Auth check fail', async function func() {
      const notAuthorizedSpy = this.sandbox.stub(responseSender, 'notAuthorized');
      const res = this.custom.res;
      const next = this.sandbox.spy();
      const req = notValidReq;

      await method.middleware(mid, accessType)(req, res, next);

      expect(notAuthorizedSpy).called;
      expect(next).not.called;
    });

    it('Auth check pass', async function func() {
      const notAuthorizedSpy = this.sandbox.stub(responseSender, 'notAuthorized');
      const getAccessSpy = this.sandbox.spy(UserModel, 'getAccess');
      const res = this.custom.res;
      const req = validReq;
      const noop = this.custom.noop;

      await method.middleware(mid, accessType)(req, res, noop);

      expect(notAuthorizedSpy).not.called;
      expect(getAccessSpy).called;
    });

    it('returns error on middleware getAccess', async function func() {
      const userGetAccessStub = this.sandbox.stub(UserModel, 'getAccess').returnsWithReject(new Error('Custom error getAccess'));
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const forbiddenSpy = this.sandbox.spy(responseSender, 'forbidden');
      const res = this.custom.res;
      const next = this.sandbox.spy();
      const req = validReq;

      await method.middleware(mid, accessType)(req, res, next);

      expect(userGetAccessStub).called;
      expect(errorSpy).called;
      expect(forbiddenSpy).not.called;
    });

    it('returns forbidden', async function func() {
      const userGetAccessStub = this.sandbox.stub(UserModel, 'getAccess')
        .returnsWithResolve(provideAccessData(accessType, agentType, false));
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const forbiddenSpy = this.sandbox.spy(responseSender, 'forbidden');
      const res = this.custom.res;
      const next = this.sandbox.spy();
      const req = validReq;

      await method.middleware(mid, accessType)(req, res, next);

      expect(userGetAccessStub).called;
      expect(errorSpy).not.called;
      expect(forbiddenSpy).called;
    });

    it('returns allowed', async function func() {
      const userGetAccessStub = this.sandbox.stub(UserModel, 'getAccess')
        .returnsWithResolve((provideAccessData(accessType, agentType, true)));
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const forbiddenSpy = this.sandbox.spy(responseSender, 'forbidden');
      const res = this.custom.res;
      const req = validReq;
      const next = this.sandbox.spy();

      await method.middleware(mid, accessType)(req, res, next);

      expect(userGetAccessStub).called;
      expect(errorSpy).not.called;
      expect(forbiddenSpy).not.called;
      expect(next).called;
    });
  });
});
