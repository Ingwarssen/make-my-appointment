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
  const {body: payload, currentUser} = req
  const userId = req.params.userId
  let pwd

  if (payload.email) {
    pwd = pwdGenerator.generate({
      length   : 8,
      numbers  : true,
      uppercase: false,
      symbols  : false
    })
    payload.password = pwd
  }

  payload.editedBy = {
    user: `${currentUser._id}`,
    date: new Date()
  }

  let options
  try {
    options = await joiValidate(payload, schema)
  } catch (ex) {
    return responseSender.validationError(next, ex)
  }

  const project = {
    accessRole     : 1,
    supervisor     : 1,
    portfolio      : 1,
    shift          : 1,
    dateOfPromotion: 1
  }

  let user
  try {
    user = await UserModel.getOne({_id: userId}, project)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getOne')
  }

  if (!user) {
    return responseSender.badRequest(next, LOC_STR.USER.NOT_FOUND)
  }

  try {
    options = await checkRoles.permissionToUpdate(options, user, currentUser)
  } catch (ex) {
    if (ex.status === 400) {
      return responseSender.badRequest(next, ex)
    }
    return responseSender.error(next, ex)
  }

  try {
    options = await checkRoles.onUpdate(options, user)
  } catch (ex) {
    if (ex.status === 400) {
      return responseSender.badRequest(next, ex)
    }
    return responseSender.error(next, ex)
  }

  try {
    options = await checkRoles.promotionToSupervisor(options, user)
  } catch (ex) {
    if (ex.status === 400) {
      return responseSender.badRequest(next, ex)
    }
    return responseSender.error(next, ex)
  }

  try {
    options = await checkRoles.requiresPortfolio(options, user)
  } catch (ex) {
    if (ex.status === 400) {
      return responseSender.badRequest(next, ex)
    }
    return responseSender.error(next, ex)
  }

  try {
    options = await checkRoles.requiresShift(options, user)
  } catch (ex) {
    if (ex.status === 400) {
      return responseSender.badRequest(next, ex)
    }
    return responseSender.error(next, ex)
  }

  try {
    options = await checkRoles.checkLocation(options, user)
  } catch (ex) {
    if (ex.status === 400) {
      return responseSender.badRequest(next, ex)
    }
    return responseSender.error(next, ex)
  }

  try {
    options = await checkRoles.matchSupervisorLocation(options)
  } catch (ex) {
    if (ex.status === 400) {
      return responseSender.badRequest(next, ex)
    }
    return responseSender.error(next, ex)
  }

  if (options.email && options.email !== user.email) {
    options.status = USER_STATUS.INVITED
  }

  try {
    await UserModel.updateOne({_id: userId}, options)
  } catch (ex) {
    if (ex.code === 11000) {
      return responseSender.badRequest(next, LOC_STR.USER.EMAIL_IN_USE)
    }

    return responseSender.error(next, ex, 'Database Error: UserModel.updateOne')
  }

  let data
  try {
    data = await UserModel.getPopulatedById(userId)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getPopulatedById')
  }

  responseSender.success(res, {data})

  if (options.email && options.email !== user.email) {
    try {
      const opt = {
        subject: 'CHANGE_EMAIL',
        payload: {
          password: pwd,
          email   : data.email,
          cmsUrl  : spaHost
        },

        recipients: [{
          _id  : data._id,
          name : data.name,
          email: data.email
        }]
      }
    } catch (ex) {
      logger.error(`Error to create send email task. Details: ${ex}`)
    }
  }
}
