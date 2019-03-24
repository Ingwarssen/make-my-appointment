const _ = require('lodash');
const faker = require('faker');
const { expect } = require('chai');
const UserModel = require('../../../features/user/model');
const method = require('./createUser');
const checkRoles = require('../utils');
const ROLES = require('../../../constants/acl/role');
const { PORTFOLIO } = require('../../../constants');
const { BUSINESS_UNIT } = require('../../../constants/location');
const ObjectId = require('mongoose').Types.ObjectId;
const {
  responseSender
} = require('../../../utils');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

const roleIds = _.values(ROLES).map(a => a._id);
const businessUnits = _.values(BUSINESS_UNIT);
const portfolioArr = _.values(PORTFOLIO);

describe(testName, () => {
  const userData = {
    email      : faker.internet.email(),
    supervisor : ObjectId(),
    accessRole : faker.random.arrayElement(roleIds),
    portfolio  : faker.random.arrayElement(portfolioArr),
    createdUser: {
      _id: ObjectId()
    }
  };

  const validRequest = {
    body: {
      email      : faker.internet.email(),
      name       : faker.name.findName(),
      accessRole : faker.random.arrayElement(roleIds),
      supervisor : `${ObjectId()}`,
      nationality: faker.address.country(),
      location   : {
        market      : [`${ObjectId()}`],
        city        : [`${ObjectId()}`],
        mall        : [`${ObjectId()}`],
        shop        : [`${ObjectId()}`],
        customer    : [`${ObjectId()}`],
        businessUnit: [faker.random.arrayElement(businessUnits)]
      }
    },

    params     : { userId: '1' },
    currentUser: { _id: `${ObjectId()}` }
  };
  const notValidRequest = {
    body: {
      email      : faker.lorem.word(),
      name       : faker.name.findName(),
      accessRole : faker.random.arrayElement(roleIds),
      supervisor : `${ObjectId()}`,
      nationality: faker.address.country(),
      location   : {
        market      : [`${ObjectId()}`],
        city        : [`${ObjectId()}`],
        mall        : [`${ObjectId()}`],
        shop        : [`${ObjectId()}`],
        customer    : [`${ObjectId()}`],
        businessUnit: [faker.random.arrayElement(businessUnits)]
      }
    },

    params     : { userId: '1' },
    currentUser: { _id: `${ObjectId()}` }
  };

  describe('validation', () => {
    it('returns validation error', async function func() {
      const createUserSpy = this.sandbox.spy(UserModel, 'create');
      const nextStepSpy = this.sandbox.spy(checkRoles, 'permissionToCreate');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = notValidRequest;

      await method(req, res, noop);

      expect(createUserSpy).not.called;
      expect(nextStepSpy).not.called;
      expect(validationErrorSpy).called;
    });

    it('succeeds validation', async function func() {
      const nextStepSpy = this.sandbox.spy(checkRoles, 'permissionToCreate');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(nextStepSpy).called;
      expect(validationErrorSpy).not.called;
    });
  });

  describe('checkRole.permissionToCreate', () => {
    it('returns error on hasPermission', async function func() {
      const checkPermissionStub = this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'onCreate');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(checkPermissionStub).called;
      expect(errorSpy).calledOnce;
      expect(nextStepSpy).not.called;
    });

    it('returns options', async function func() {
      const checkPermissionStub = this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'onCreate');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(checkPermissionStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('checkRole.onCreate catch reject', () => {
    it('returns error on checkRoles', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      const onCreateStub = this.sandbox.stub(checkRoles, 'onCreate').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'promotionToSupervisor');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(onCreateStub).called;
      expect(errorSpy).called;
      expect(nextStepSpy).not.called;
    });

    it('returns data on checkRoles', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      const onCreateStub = this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'promotionToSupervisor');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(onCreateStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('checkRole.promotionToSupervisor', () => {
    it('returns error on requiresPortfolio', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      const promotionToSupervisorStub = this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'requiresPortfolio');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(promotionToSupervisorStub).called;
      expect(errorSpy).calledOnce;
      expect(nextStepSpy).not.called;
    });

    it('returns data on promotionToSupervisor', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      const promotionToSupervisorStub = this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'requiresPortfolio');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(promotionToSupervisorStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('checkRole.requiresPortfolio', () => {
    it('returns error on requiresPortfolio', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      const requiresPortfolioStub = this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'requiresShift');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresPortfolioStub).called;
      expect(errorSpy).calledOnce;
      expect(nextStepSpy).not.called;
    });

    it('returns data on requiresPortfolio', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      const requiresPortfolioStub = this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'requiresShift');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresPortfolioStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('checkRole.requiresShift', () => {
    it('returns error on requiresShift', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'requiresShift').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'checkLocation');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresShiftStub).called;
      expect(errorSpy).calledOnce;
      expect(nextStepSpy).not.called;
    });

    it('returns data on requiresShift', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'checkLocation');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresShiftStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('checkRole.checkLocation', () => {
    it('returns error on checkLocation', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'checkLocation').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'matchSupervisorLocation');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresShiftStub).called;
      expect(errorSpy).calledOnce;
      expect(nextStepSpy).not.called;
    });

    it('returns data on checkLocation', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'matchSupervisorLocation');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresShiftStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('checkRole.matchSupervisorLocation', () => {
    it('returns error on matchSupervisorLocation', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(UserModel, 'create');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresShiftStub).called;
      expect(errorSpy).calledOnce;
      expect(nextStepSpy).not.called;
    });

    it('returns data on matchSupervisorLocation', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(UserModel, 'create');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(requiresShiftStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('user create', () => {
    it('not returns error on create', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const createUserStub = this.sandbox.stub(UserModel, 'create').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(UserModel, 'getPopulatedById');
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(createUserStub).called;
      expect(errorSpy).not.called;
      expect(badRequestSpy).not.called;
      expect(nextStepSpy).called;
    });

    it('returns error on create (not 11000)', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const createUserStub = this.sandbox.stub(UserModel, 'create').returnsWithReject(new Error('Custom create error'));
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const nextStepSpy = this.sandbox.spy(UserModel, 'getPopulatedById');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(errorSpy).called;
      expect(createUserStub).called;
      expect(nextStepSpy).not.called;
    });

    it('returns error 11000 on create', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const createUserStub = this.sandbox.stub(UserModel, 'create').returnsWithReject(new Error().ex = { code: 11000 });
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const nextStepSpy = this.sandbox.spy(UserModel, 'getPopulatedById');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(badRequestSpy).called;
      expect(createUserStub).called;
      expect(nextStepSpy).not.called;
    });
  });

  describe('getPopulated user', () => {
    it('not returns error on getPopulated', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const createUserStub = this.sandbox.stub(UserModel, 'create').returnsWithResolve(userData);
      const getPopulatedByIdStub = this.sandbox.stub(UserModel, 'getPopulatedById').returnsWithResolve(userData);
      const successSpy = this.sandbox.spy(responseSender, 'success');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(createUserStub).called;
      expect(getPopulatedByIdStub).called;
      expect(errorSpy).not.called;
      expect(successSpy).called;
    });

    it('returns error on getPopulated', async function func() {
      this.sandbox.stub(checkRoles, 'permissionToCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onCreate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const createUserStub = this.sandbox.stub(UserModel, 'create').returnsWithResolve(userData);
      const getPopulatedByIdStub = this.sandbox.stub(UserModel, 'getPopulatedById').returnsWithReject(new Error('Custom Get error'));
      const successSpy = this.sandbox.spy(responseSender, 'success');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(createUserStub).called;
      expect(getPopulatedByIdStub).called;
      expect(errorSpy).called;
      expect(successSpy).not.called;
    });
  });
});
