const {USER_STATUS} = require('../../../constants')
const {LOC_STR} = require('../../../constants/responses')
const UserModel = require('../../user/model')
const AccessRoleModel = require('../../accessRole/model')
const schema = require('../joi.schema').signUpFromMobile
// const addDevice = require('../../../services/queue/helpers/createAddDeviceTask');

const {
  responseSender,
  joiValidate,
  logger
} = require('../../../utils')

module.exports = async (req, res, next) => {
  const {body: payload} = req
  let options

  try {
    options = await joiValidate(payload, schema)
  } catch (ex) {
    console.log('validation fail', ex)
    return responseSender.validationError(next, ex)
  }

  console.log('validation pass?', options)
  let createdUser
  try {
    createdUser = await UserModel.create(options)
  } catch (ex) {
    if (ex.code === 11000) {
      return responseSender.badRequest(next, LOC_STR.USER.EMAIL_IN_USE)
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

  responseSender.success(res, {data})

  logger.info(`User logged in from MOBILE-- uid: ${user._id} deviceId: ${payload.deviceId}`)

  responseSender.success(res, {data})
}
