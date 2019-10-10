const Joi = require('joi')
const { OBJECT_ID_REGEX } = require('../../constants')

const getAll = Joi.object().keys({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  count: Joi.number()
    .integer()
    .min(1)
    .default(20),
  sortBy: Joi.string().default('createdAt'),
  sortOrder: Joi.number()
    .valid([-1, 1])
    .default(-1),
  search: Joi.string()
    .allow('')
    .default(null),
})

const create = Joi.object().keys({
  type: Joi.string().required(),
  description: Joi.string().required(),
  originator: Joi.string()
    .regex(OBJECT_ID_REGEX)
    .default(null),
  createdAt: Joi.date(),
  payload: {
    _id: Joi.string()
      .regex(OBJECT_ID_REGEX)
      .required(),
    context: Joi.string().required(),
  },
})

module.exports = {
  create,
  getAll,
}
