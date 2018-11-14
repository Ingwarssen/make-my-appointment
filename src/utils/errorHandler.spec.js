const faker = require('faker');
const { expect } = require('chai');
const method = require('./errorHandler');
const ObjectId = require('mongoose').Types.ObjectId;
const logger = require('./logger');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  const err = {
    details        : faker.lorem.sentence(),
    stack          : faker.lorem.text(),
    status         : faker.random.number(),
    name           : faker.lorem.word(),
    message        : faker.lorem.sentence(),
    localizationKey: faker.lorem.sentence(),
    _errInfo       : {
      ex     : new Error(),
      details: faker.lorem.sentence()
    }
  };

  const req = {
    id     : `${ObjectId()}`,
    session: {
      uId: `${ObjectId()}`
    }
  };
  it('does strange things', async function func() {
    const noop = this.custom.noop;
    const res = this.custom.res;
    res.send = this.sandbox.spy();
    logger.error = this.sandbox.spy();

    method(err, req, res, noop);

    expect(logger.error).calledOnce.calledWith({
      status    : err.status,
      userId    : req.session.uId,
      requestId : req.id,
      name      : err.name,
      message   : err.message,
      stackTrace: err.stack.split('\n')
    });
    expect(res.status).to.be.equal(err.status);
    expect(res.send).calledOnce.calledWith({
      status         : err.status,
      requestId      : req.id,
      name           : err.name,
      message        : err.message,
      localizationKey: err.localizationKey,
      details        : err.details
    });
  });
  it('cleans log from 401, 403 and validation errors', async function func() {
    Object.assign(err, faker.random.arrayElement([
      { status: 401 },
      { status: 403 },
      { name: 'VALIDATION_ERROR' }]));

    const noop = this.custom.noop;
    const res = this.custom.res;
    res.send = this.sandbox.spy();
    logger.error = this.sandbox.spy();

    method(err, req, res, noop);

    expect(logger.error).calledOnce.calledWith({
      status   : err.status,
      userId   : req.session.uId,
      requestId: req.id,
      name     : err.name,
      message  : err.message
    });
    expect(res.send).calledOnce;
  });
});
