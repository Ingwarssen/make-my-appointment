const Model = require('../model')
const { getAll: schema } = require('../joi.schema')
const { responseSender, joiValidate } = require('../../../utils')

module.exports = async (req, res, next) => {
  const { query: payload } = req

  let options
  try {
    options = await joiValidate(payload, schema)
  } catch (ex) {
    return responseSender.validationError(next, ex)
  }

  let data
  try {
    data = await Model.getAll(options)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: Model.getAll')
  }

  responseSender.success(res, { data })
}
