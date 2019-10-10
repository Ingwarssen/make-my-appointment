const { USER_STATUS } = require('../../../constants')
const { LOC_STR } = require('../../../constants/responses')
const UserModel = require('../../user/model')
const schema = require('../joi.schema').logInFromCms

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
    user = await UserModel.getOne(params)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getOne')
  }

  if (!user) {
    return responseSender.badRequest(next, LOC_STR.AUTH.INCORRECT_LOGIN)
  }

  if (user.status === USER_STATUS.DISABLED) {
    return responseSender.badRequest(next, LOC_STR.AUTH.ACCOUNT_DISABLED)
  }

  const userId = user._id

  // req.session.isMobile = false
  // req.session.loggedIn = true
  // req.session.uId = userId

  let data
  try {
    data = await UserModel.getCurrent(userId)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getCurrent')
  }

  logger.info(`User logged in from CMS -- uid: ${userId}`)

  responseSender.success(res, { data })
}
