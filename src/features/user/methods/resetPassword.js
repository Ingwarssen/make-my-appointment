const { webHost } = require('../../../config');
const { activateAccount: schema } = require('../joi.schema');
const TokenModel = require('../../token/model');
const UserModel = require('../model');
const { LOC_STR } = require('../../../constants/responses');
const {
  responseSender,
  joiValidate
} = require('../../../utils');

module.exports = async (req, res, next) => {
  const {
    params: {
      token
    },
    body,
    isMobile
  } = req;

  // validate payload
  let payload;
  try {
    payload = await joiValidate(body, schema);
  } catch (ex) {
    return responseSender.validationError(next, ex);
  }

  if (payload.newPassword !== payload.confirmNewPassword) {
    return responseSender.badRequest(next, LOC_STR.USER.PASSWORDS_NOT_MATCH);
  }

  // get token document
  let tokenDoc;
  try {
    tokenDoc = await TokenModel.getOne({ token });
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: TokenModel.getOne');
  }

  if (!tokenDoc) {
    return responseSender.badRequest(next, LOC_STR.USER.TOKEN_EXPIRED);
  }

  // if exist => update user password
  try {
    const query = {
      _id: tokenDoc.userId
    };
    const modify = {
      password       : payload.newPassword,
      'editedBy.date': new Date()
    };

    await UserModel.updateOne(query, modify);
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.updateOne');
  }

  // remove token document
  try {
    await TokenModel.removeById(tokenDoc._id);
  } catch
    (ex) {
    return responseSender.error(next, ex, 'Database Error: TokenModel.removeById');
  }

  if (isMobile) {
    return responseSender.ok(res);
  }

  const url = `${webHost}/resetPasswordSuccess`;
  responseSender.success(res, { data: { url } });
};
