const { USER_STATUS } = require('../../../constants')
const { LOC_STR } = require('../../../constants/responses')
const UserModel = require('../../user/model')
const AccessRoleModel = require('../../accessRole/model')
const schema = require('../joi.schema').logInFromMobile

const { responseSender, joiValidate, logger } = require('../../../utils')

module.exports = async (req, res, next) => {
  const { body: payload } = req
  let params

  try {
    params = await joiValidate(payload, schema)
  } catch (ex) {
    return responseSender.validationError(next, ex)
  }

  let user
  try {
    const opt = {
      email: params.email,
      password: params.password,
    }
    user = await UserModel.getOne(opt)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getOne')
  }

  if (!user) {
    return responseSender.badRequest(next, LOC_STR.AUTH.INCORRECT_LOGIN)
  }

  if (user.status === USER_STATUS.DISABLED) {
    return responseSender.badRequest(next, LOC_STR.AUTH.ACCOUNT_DISABLED)
  }

  let userRole
  try {
    userRole = await AccessRoleModel.getById(user.accessRole)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: AccessRoleModel.getById')
  }

  if (!userRole || !userRole.allowedLoginFromMobile) {
    return responseSender.forbidden(next, LOC_STR.AUTH.MOBILE_NOT_ALLOWED)
  }

  // try {
  //   const opt = {
  //     userId: user._id,
  //     sessionId: req.sessionID,
  //     deviceId: params.deviceId,
  //     deviceToken: params.deviceToken,
  //   }

  //   await addDevice(opt)
  // } catch (ex) {
  //   return responseSender.error(next, ex)
  // }

  const userId = user._id

  // set user logged in
  // req.session.isMobile = true
  // req.session.loggedIn = true
  // req.session.uId = userId

  let data
  try {
    data = await UserModel.getCurrent(userId)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getCurrent')
  }

  logger.info(`User logged in from MOBILE-- uid: ${user._id} deviceId: ${payload.deviceId}`)

  responseSender.success(res, { data })
}
