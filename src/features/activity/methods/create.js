const Model = require('../model');
const schema = require('../joi.schema').create;
const {
  logger,
  joiValidate
} = require('../../../utils');

module.exports = async payload => {
  let options;
  try {
    options = await joiValidate(payload, schema);
  } catch (ex) {
    return logger.error(`ACTIVITY LOG: Validation error  ${ex}`);
  }

  return Model.create(options);
};
