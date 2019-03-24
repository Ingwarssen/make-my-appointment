const pwdGenerator = require('generate-password')
const {forgotPassword: schema} = require('../joi.schema')
const TokenModel = require('../../token/model')
const UserModel = require('../model')
const config = require('../../../config')
const {
  responseSender,
  joiValidate,
  logger
} = require('../../../utils')

module.exports = async (req, res, next) => {
  const {body: payload} = req
  const token = pwdGenerator.generate({
    length   : 50,
    numbers  : true,
    uppercase: false,
    symbols  : false
  })

  let options
  try {
    options = await joiValidate(payload, schema)
  } catch (ex) {
    return responseSender.validationError(next, ex)
  }

  let user
  try {
    const query = {
      email: options.email
    }
    user = await UserModel.getOne(query)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getOne')
  }

  if (!user) {
    return responseSender.ok(res)
  }

  try {
    const query = {
      userId: user._id
    }
    const modify = {
      token,
      userId   : user._id,
      createdAt: new Date()
    }
    const opt = {
      upsert: true
    }

    await TokenModel.updateOne(query, modify, opt)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: TokenModel.updateOne')
  }

  responseSender.ok(res)

  if (user) {
    try {
      const opt = {
        subject: 'FORGOT_PASSWORD',
        payload: {
          cmsUrl  : config.spaHost,
          resetUrl: `${config.webHost}/resetPassword/${token}`
        },

        recipients: [{
          _id  : user._id,
          name : user.name,
          email: user.email
        }]
      }
    } catch (ex) {
      logger.error(`Error to create send email task. Details: ${ex}`)
    }
  }
}
