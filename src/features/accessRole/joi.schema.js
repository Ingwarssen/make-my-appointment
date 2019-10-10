const Joi = require('joi')

const getAll = Joi.object().keys({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  count: Joi.number()
    .integer()
    .min(1)
    .default(20),
  sortBy: Joi.string()
    .allow('')
    .default('level'),
  sortOrder: Joi.number()
    .valid([-1, 1])
    .default(1),
  search: Joi.string()
    .allow('')
    .default(null),
})

module.exports = {
  getAll,
}
