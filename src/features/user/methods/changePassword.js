const {changePassword: schema} = require('../joi.schema')
const UserModel = require('../model')
const config = require('../../../config')
const {LOC_STR} = require('../../../constants/responses')
const {
  responseSender,
  joiValidate,
  logger
} = require('../../../utils')

module.exports = async function changePassword (req, res, next) {
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
    userBeforeUpdate = await UserModel.getOne({_id: userId, password: options.oldPassword})
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getOne')
  }

  if (!userBeforeUpdate) {
    return responseSender.badRequest(next, LOC_STR.USER.PASSWORD_INCORRECT)
  }

  try {
    const query = {
      _id: userId
    }
    const modify = {
      password       : options.newPassword,
      'editedBy.date': new Date()
    }

    await UserModel.updateOne(query, modify)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.updateOne')
  }

  responseSender.ok(res)

  try {
    const opt = {
      subject: 'CHANGE_PASSWORD',
      payload: {
        cmsUrl: config.spaHost
      },

      recipients: [{
        _id  : userBeforeUpdate._id,
        name : userBeforeUpdate.name,
        email: userBeforeUpdate.email
      }]
    }
  } catch (ex) {
    logger.error(`Error to create send email task. Details: ${ex}`)
  }
}
