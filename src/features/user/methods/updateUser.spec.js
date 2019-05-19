const _ = require('lodash');
const faker = require('faker');
const { expect } = require('chai');
const UserModel = require('../../../features/user/model');
const method = require('./upsertFbUser');
const checkRoles = require('../utils');
const ROLES = require('../../../constants/acl/role');
const ObjectId = require('mongoose').Types.ObjectId;
const {
  responseSender
} = require('../../../utils');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

const roleIds = _.values(ROLES).map(a => a._id);

describe(testName, () => {
  const userData = {
    email      : faker.internet.email(),
    supervisor : ObjectId(),
    accessRole : faker.random.arrayElement(roleIds),
    updatedUser: {
      _id: ObjectId()
    }
  };
  const validRequest = {
    body       : { name: faker.name.findName() },
    params     : { userId: ObjectId() },
    session    : { uId: `${ObjectId()}` },
    currentUser: { _id: `${ObjectId()}` }
  };
  const notValidRequest = {
    body: {
      email      : faker.lorem.word(),
      name       : faker.name.findName(),
      accessRole : faker.random.arrayElement(roleIds),
      supervisor : `${ObjectId()}`,
      nationality: faker.address.country()
    },

    params     : { userId: '1' },
    currentUser: { _id: `${ObjectId()}` }
  };

  describe('validation', () => {
    it('returns validation error', async function func() {
      const updateUserSpy = this.sandbox.spy(UserModel, 'updateOne');
      const nextStepSpy = this.sandbox.spy(UserModel, 'getOne');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = notValidRequest;

      await method(req, res, noop);

      expect(updateUserSpy).not.called;
      expect(nextStepSpy).not.called;
      expect(validationErrorSpy).called;
    });

    it('succeeds validation', async function func() {
      const nextStepSpy = this.sandbox.spy(UserModel, 'getOne');
      const validationErrorSpy = this.sandbox.spy(responseSender, 'validationError');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(nextStepSpy).called;
      expect(validationErrorSpy).not.called;
    });
  });

  describe('user finding', () => {
    it('not finds user', async function func() {
      const getOneUserStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve();
      const nextStepSpy = this.sandbox.spy(checkRoles, 'permissionToUpdate');
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(getOneUserStub).called;
      expect(nextStepSpy).not.called;
      expect(badRequestSpy).called;
    });

    it('finds user', async function func() {
      const getOneUserStub = this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'permissionToUpdate');
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(getOneUserStub).called;
      expect(nextStepSpy).called;
      expect(badRequestSpy).not.calledBefore(nextStepSpy);
    });
    it('returns db error ', async function func() {
      const getOneUserStub = this.sandbox.stub(UserModel, 'getOne').returnsWithReject(new Error('Custom Error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'permissionToUpdate');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(getOneUserStub).called;
      expect(nextStepSpy).not.called;
      expect(errorSpy).called;
    });
  });

  describe('checkRole.permissionToUpdate', () => {
    it('returns error on permissionToUpdate', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const checkPermissionStub = this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'onUpdate');
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      const checkPermissionStub = this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'onUpdate');
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

  describe('checkRole.onUpdate catch reject', () => {
    it('returns error on onUpdate', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      const onUpdateStub = this.sandbox.stub(checkRoles, 'onUpdate').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(checkRoles, 'promotionToSupervisor');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(onUpdateStub).called;
      expect(errorSpy).called;
      expect(nextStepSpy).not.called;
    });

    it('returns data on checkRoles', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      const onUpdateStub = this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(checkRoles, 'promotionToSupervisor');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(onUpdateStub).called;
      expect(errorSpy).not.calledBefore(nextStepSpy);
      expect(nextStepSpy).called;
    });
  });

  describe('checkRole.promotionToSupervisor', () => {
    it('returns error on requiresPortfolio', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithReject(new Error('Custom roles error'));
      const nextStepSpy = this.sandbox.spy(UserModel, 'updateOne');
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
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      const requiresShiftStub = this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const nextStepSpy = this.sandbox.spy(UserModel, 'updateOne');
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


  describe('user updating', () => {
    it('not returns error on update', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const updateUserStub = this.sandbox.stub(UserModel, 'updateOne').returnsWithResolve(userData);
      const successSpy = this.sandbox.spy(responseSender, 'success');
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(updateUserStub).called;
      expect(errorSpy).not.called;
      expect(badRequestSpy).not.called;
      expect(successSpy).called;
    });

    it('returns error on update (not 11000)', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const updateUserStub = this.sandbox.stub(UserModel, 'updateOne').returnsWithReject(new Error('Custom update error'));
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const successSpy = this.sandbox.spy(responseSender, 'success');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(badRequestSpy).not.called;
      expect(updateUserStub).called;
      expect(errorSpy).called;
      expect(successSpy).not.called;
    });

    it('returns error 11000 on update', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      const updateUserStub = this.sandbox.stub(UserModel, 'updateOne').returnsWithReject(new Error().ex = { code: 11000 });
      const badRequestSpy = this.sandbox.spy(responseSender, 'badRequest');
      const successSpy = this.sandbox.spy(responseSender, 'success');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(badRequestSpy).called;
      expect(updateUserStub).called;
      expect(errorSpy).not.called;
      expect(successSpy).not.called;
    });
  });

  describe('getPopulated user', () => {
    it('not returns error on getPopulated', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      this.sandbox.stub(UserModel, 'updateOne').returnsWithResolve(userData);
      const getPopulatedByIdStub = this.sandbox.stub(UserModel, 'getPopulatedById').returnsWithResolve(userData);
      const successSpy = this.sandbox.spy(responseSender, 'success');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(getPopulatedByIdStub).called;
      expect(errorSpy).not.called;
      expect(successSpy).called;
    });

    it('returns error on getPopulated', async function func() {
      this.sandbox.stub(UserModel, 'getOne').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'permissionToUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'onUpdate').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'promotionToSupervisor').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresPortfolio').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'requiresShift').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'checkLocation').returnsWithResolve(userData);
      this.sandbox.stub(checkRoles, 'matchSupervisorLocation').returnsWithResolve(userData);
      this.sandbox.stub(UserModel, 'updateOne').returnsWithResolve(userData);
      const getPopulatedByIdStub = this.sandbox.stub(UserModel, 'getPopulatedById').returnsWithReject(new Error('Custom Get error'));
      const successSpy = this.sandbox.spy(responseSender, 'success');
      const errorSpy = this.sandbox.spy(responseSender, 'error');
      const res = this.custom.res;
      const noop = this.custom.noop;
      const req = validRequest;

      await method(req, res, noop);

      expect(getPopulatedByIdStub).called;
      expect(errorSpy).called;
      expect(successSpy).not.called;
    });
  });
});
