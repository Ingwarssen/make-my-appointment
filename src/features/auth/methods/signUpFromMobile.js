const { LOC_STR } = require('../../../constants/responses')
const UserModel = require('../../user/model')
const schema = require('../joi.schema').signUpFromMobile

const { responseSender, joiValidate, logger } = require('../../../utils')

module.exports = async (req, res, next) => {
  const { body: payload } = req
  let options

  try {
    options = await joiValidate(payload, schema)
  } catch (ex) {
    return responseSender.validationError(next, ex)
  }

  let createdUser
  try {
    createdUser = await UserModel.create(options)
  } catch (ex) {
    if (ex.code === 11000) {
      return responseSender.badRequest(next, LOC_STR.USER.PHONE_IN_USE)
    }

    return responseSender.error(next, ex, 'Database Error: UserModel.create')
  }
  // TODO: auto login user after succeffull registration

  let data
  try {
    data = await UserModel.getPopulatedById(createdUser._id)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getPopulatedById')
  }

  logger.info(`User logged in from MOBILE-- uid: ${data._id} deviceId: ${payload.deviceId}`)

  responseSender.success(res, { data })
}
