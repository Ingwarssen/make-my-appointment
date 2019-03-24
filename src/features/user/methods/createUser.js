const pwdGenerator = require('generate-password')
const {create: schema} = require('../joi.schema')
const UserModel = require('../model')
const {LOC_STR} = require('../../../constants/responses')

const {
  responseSender,
  joiValidate
} = require('../../../utils')

module.exports = async (req, res, next) => {
  const {
    body: payload
  } = req
  const pwd = pwdGenerator.generate({
    length   : 8,
    numbers  : true,
    uppercase: false,
    symbols  : false
  })

  payload.password = pwd

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
      return responseSender.badRequest(next, LOC_STR.USER.EMAIL_IN_USE)
    }

    return responseSender.error(next, ex, 'Database Error: UserModel.create')
  }

  let data
  try {
    data = await UserModel.getPopulatedById(createdUser._id)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getPopulatedById')
  }

  responseSender.success(res, {data})
}
