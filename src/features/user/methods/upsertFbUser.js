const pwdGenerator = require('generate-password')
const {update: schema} = require('../joi.schema')
const UserModel = require('../model')
const checkRoles = require('../utils')
const {USER_STATUS} = require('../../../constants')
const {LOC_STR} = require('../../../constants/responses')
const {spaHost} = require('../../../config')
const {
  responseSender,
  joiValidate,
  logger
} = require('../../../utils')

module.exports = async (req, res, next) => {
  const {body: payload} = req
  const userId = req.params.userId

  let options
  try {
    options = await joiValidate(payload, schema)
  } catch (ex) {
    return responseSender.validationError(next, ex)
  }

  let user
  try {
    user = await UserModel.updateOne({_id: userId})
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getOne')
  }

  if (options.email && options.email !== user.email) {
    options.status = USER_STATUS.REGISTERED
  }

  let data
  try {
    data = await UserModel.getPopulatedById(userId)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getPopulatedById')
  }

  responseSender.success(res, {data})
}
