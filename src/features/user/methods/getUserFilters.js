const UserModel = require('../model');
const schema = require('../joi.schema').filter;

const {
  responseSender,
  joiValidate
} = require('../../../utils');

module.exports = async (req, res, next) => {
  const {
    query: payload,
    currentUser
  } = req;

  let filter;
  try {
    filter = await joiValidate(payload, schema);
  } catch (ex) {
    return responseSender.validationError(next, ex);
  }

  const options = { filter };

  let data;
  try {
    data = await UserModel.getUserFilter(options, currentUser);
  } catch (ex) {
    return responseSender.error(next, ex);
  }

  responseSender.success(res, { data });
};
