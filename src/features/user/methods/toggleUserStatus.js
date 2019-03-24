const schema = require('../joi.schema').toggleStatus;
const UserModel = require('../model');
const { LOC_STR } = require('../../../constants/responses');
const { STATUS_ACTION, USER_STATUS } = require('../../../constants');

const {
  responseSender,
  joiValidate
} = require('../../../utils');

module.exports = async (req, res, next) => {
  const {
    currentUser,
    body  : payload,
    params: {
      userId
    }
  } = req;

  let action;
  try {
    const options = await joiValidate(payload, schema);
    action = options.action;
  } catch (ex) {
    return responseSender.validationError(next, ex);
  }

  if (action === STATUS_ACTION.DISABLE) {
    let subordinateIds;
    try {
      subordinateIds = await UserModel.getSubordinateIds(userId);
    } catch (ex) {
      return responseSender.error(next, ex, 'Database Error: UserModel.getSubordinateIds');
    }

    if (subordinateIds && subordinateIds.length) {
      return responseSender.badRequest(next, LOC_STR.USER.SET_NEW_SUPERVISOR);
    }
  }

  let user;
  try {
    const query = {
      _id: userId
    };
    const modify = {
      status: action === STATUS_ACTION.DISABLE ? USER_STATUS.DISABLED : USER_STATUS.ACTIVE
    };

    user = await UserModel.updateOne(query, modify, { new: true });
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.updateOne');
  }

  if (!user) {
    return responseSender.badRequest(next, LOC_STR.USER.NOT_FOUND);
  }

  // ToDo: send push to force logOut and clear session
  responseSender.ok(res);
};
