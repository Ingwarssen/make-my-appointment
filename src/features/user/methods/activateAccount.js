const {USER_STATUS} = require('../../../constants')
const {LOC_STR} = require('../../../constants/responses')
const schema = require('../joi.schema').activateAccount
const UserModel = require('../model')
const {
  responseSender,
  joiValidate
} = require('../../../utils')

module.exports = async (req, res, next) => {
  const {body: payload} = req
  const {
    uId: userId
  } = req.session

  let options
  try {
    options = await joiValidate(payload, schema)
  } catch (ex) {
    return responseSender.validationError(next, ex)
  }

  if (options.newPassword !== options.confirmNewPassword) {
    return responseSender.badRequest(next, LOC_STR.USER.PASSWORDS_NOT_MATCH)
  }

  let userBeforeUpdate
  try {
    userBeforeUpdate = await UserModel.getOne({_id: userId})
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getOne')
  }

  if (!userBeforeUpdate) {
    return responseSender.badRequest(next, LOC_STR.USER.NOT_FOUND)
  }

  if (userBeforeUpdate.status === USER_STATUS.ACTIVE) {
    return responseSender.badRequest(next, LOC_STR.USER.ACCOUNT_ACTIVATED)
  }

  try {
    const query = {
      _id: userId
    }
    const modify = {
      status         : USER_STATUS.ACTIVE,
      password       : options.newPassword,
      dateOfJoining  : new Date(),
      'editedBy.date': new Date()
    }

    await UserModel.updateOne(query, modify)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.updateOne')
  }

  let data
  try {
    data = await UserModel.getCurrent(userId)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getCurrent')
  }

  responseSender.success(res, {data})
}
