const UserModel = require('../model');
const { LOC_STR } = require('../../../constants/responses');
const {
  responseSender
} = require('../../../utils');

module.exports = async (req, res, next) => {
  const {
    params: { userId }
  } = req;

  let data;
  try {
    data = await UserModel.getPopulatedById(userId);
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getPopulatedById');
  }

  if (!data) {
    return responseSender.badRequest(next, LOC_STR.PRODUCT.NOT_FOUND);
  }

  responseSender.success(res, { data });
};
