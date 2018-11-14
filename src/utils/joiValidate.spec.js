const joi = require('joi');
const _ = require('lodash');

const { expect } = require('chai');

const method = require('./joiValidate');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('validates successfully', async function func() {
    const payload = {
      a    : 'b',
      field: 3,
      c    : 3
    };
    const schema = joi.object().keys({
      field: joi.number().integer().min(1).default(1)
    });

    const resultPromise = method(payload, schema);
    const result = await resultPromise;

    expect(resultPromise).to.be.an('promise');
    expect(result).to.be.eql(_.omit(payload, ['a', 'c']));
  });

  it('returns validation error', async function func() {
    const payload = {
      a    : 'b',
      field: 'that is not valid field',
      c    : 3
    };
    const schema = joi.object().keys({
      field: joi.number().integer().min(1).default(1)
    });

    const result = method(payload, schema);

    expect(result).to.be.rejected;
  });
});
