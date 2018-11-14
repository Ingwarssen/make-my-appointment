const faker = require('faker');
const _ = require('lodash');
const { expect } = require('chai');
const {
  ERROR_NAMES,
  LOC_STR
} = require('../constants/responses');
const localization = require('../constants/locales/global.en.json');

const method = require('./responseSender');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  describe('error', () => {
    it('operates error object', async function func() {
      const next = this.sandbox.spy();
      const options = new Error();
      options.details = faker.random.word();

      method.error(next, options);

      expect(next).calledWithMatch(this.sandbox.match({
        status         : 500,
        name           : ERROR_NAMES.INTERNAL_ERROR.toUpperCase().split(' ').join('_'),
        message        : ERROR_NAMES.INTERNAL_ERROR,
        localizationKey: LOC_STR.GENERAL.INTERNAL_ERROR,
        _errInfo       : {
          ex     : options,
          details: options.details
        }
      }));
    });
  });

  describe('badRequest', () => {
    it('operates bad request with simple message', async function func() {
      const next = this.sandbox.spy();
      const message = faker.random.arrayElement(_.keys(localization));

      method.badRequest(next, message);

      expect(next).calledWith(this.sandbox.match({
        status         : 400,
        name           : ERROR_NAMES.BAD_REQUEST.toUpperCase().split(' ').join('_'),
        message        : _.get(localization[message], 'message'),
        localizationKey: message
      }));
    });

    it('operates bad request with Error object', async function func() {
      const next = this.sandbox.spy();
      const err = new Error();
      err.message = faker.random.arrayElement(_.keys(localization));

      method.badRequest(next, err);

      expect(next).calledWith(this.sandbox.match({
        status         : 400,
        name           : ERROR_NAMES.BAD_REQUEST.toUpperCase().split(' ').join('_'),
        message        : _.get(localization[err.message], 'message'),
        localizationKey: err.message
      }));
    });
  });

  describe('validationError', () => {
    it('operates validationError object', async function func() {
      const next = this.sandbox.spy();
      const error = new Error('Custom validation error');
      error.details = [{ message: 'Error#1' }, {}];
      error.details = error.details.map(item => {
        return {
          message        : item.message,
          path           : item.path,
          localizationKey: LOC_STR.GENERAL.VALIDATION_ERROR
        };
      });

      method.validationError(next, error);

      expect(next).calledWith(this.sandbox.match({
        name           : ERROR_NAMES.VALIDATION_ERROR.toUpperCase().split(' ').join('_'),
        status         : 400,
        details        : error.details,
        localizationKey: LOC_STR.GENERAL.VALIDATION_ERROR
      }));
    });
  });

  describe('notAuthorized', () => {
    it('operates notAuthorized object', async function func() {
      const next = this.sandbox.spy();
      const locKey = LOC_STR.GENERAL.NOT_AUTHORIZED;

      method.notAuthorized(next, locKey);

      expect(next).calledWith(this.sandbox.match({
        name           : ERROR_NAMES.NOT_AUTHORIZED.toUpperCase().split(' ').join('_'),
        status         : 401,
        localizationKey: locKey
      }));
    });
  });

  describe('forbidden', () => {
    it('operates forbidden object', async function func() {
      const next = this.sandbox.spy();
      const locKey = LOC_STR.GENERAL.FORBIDDEN;

      method.forbidden(next, locKey);

      expect(next).calledWith(this.sandbox.match({
        name           : ERROR_NAMES.FORBIDDEN.toUpperCase().split(' ').join('_'),
        status         : 403,
        localizationKey: locKey
      }));
    });
  });

  describe('customSuccess', () => {
    it('operates customSuccess object', async function func() {
      const res = this.custom.res;
      const data = {};
      const options = {};

      method.success(res, data, options);

      expect(res.data).to.be.eql({ message: 'Ok' });
      expect(res.status).to.be.equal(200);
    });
  });

  describe('ok', () => {
    it('operates ok object', async function func() {
      const res = this.custom.res;

      method.ok(res);

      expect(res.data).to.be.eql({ message: ERROR_NAMES.SUCCESS });
      expect(res.status).to.be.equal(200);
    });
  });
});
