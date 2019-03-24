const UserModel = require('../model');
const schema = require('../joi.schema').getAll;
const {
  responseSender,
  joiValidate
} = require('../../../utils');

module.exports = async (req, res, next) => {
  const { query: payload } = req;

  let options;
  try {
    options = await joiValidate(payload, schema);
  } catch (ex) {
    return responseSender.validationError(next, ex);
  }

  let data;
  try {
    data = await UserModel.getAll(options);
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getAll');
  }

  responseSender.success(res, { data });
};
