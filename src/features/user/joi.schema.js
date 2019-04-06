const Joi = require('joi')
const encryptPassword = require('../../utils/encrypt')
const {
  STATUS_ACTION,
  OBJECT_ID_REGEX,
  USER_STATUS
} = require('../../constants')

Joi.objectId = require('joi-objectid')(Joi)

const customJoi = Joi.extend({
  base: Joi.string().min(6),
  name: 'hash',

  language: {
    encrypt: 'can\'t encrypt empty value'
  },

  rules: [
    {
      name: 'encrypt',

      // eslint-disable-next-line
      validate (params, value, state, options) {
        return encryptPassword(value)
      }
    }
  ]
})

const status = Joi.string().valid([
  USER_STATUS.REGISTERED,
  USER_STATUS.ACTIVE,
  USER_STATUS.DISABLED
])

const filter = Joi.object().keys({
  accessRole : Joi.array().items(Joi.number().integer().min(1)),
  nationality: Joi.array().items(Joi.string()),
  status     : Joi.array().items(status),
  startDate  : Joi.date(),
  endDate    : Joi.date()
})

const createdBy = Joi.object().keys({
  user: Joi.string().regex(OBJECT_ID_REGEX),
  date: Joi.date()
})

const create = Joi.object().keys({
  name       : Joi.string().required(),
  email      : Joi.string().email().required(),
  accessRole : Joi.number().integer().min(1).required(),
  password   : customJoi.hash().encrypt().required(),
  nationality: Joi.string().required(),
  editedBy   : createdBy,
  createdBy
})

const update = Joi.object().keys({
  name       : Joi.string(),
  email      : Joi.string().email(),
  accessRole : Joi.number().integer().min(1),
  password   : customJoi.hash().encrypt(),
  nationality: Joi.string(),
  editedBy   : createdBy,
  createdBy,
})

const activateAccount = Joi.object().keys({
  newPassword       : customJoi.hash().encrypt().required(),
  confirmNewPassword: customJoi.hash().encrypt().required()
})

const getAll = Joi.object().keys({
  page      : Joi.number().integer().min(1).default(1),
  count     : Joi.number().integer().min(1).default(20),
  sortBy    : Joi.string().allow('').default('createdBy.date'),
  sortOrder : Joi.number().valid([-1, 1]).default(-1),
  search    : Joi.string().allow('').default(null),
  filter
})

const changePassword = activateAccount.keys({
  oldPassword: customJoi.hash().encrypt().required()
})

const changeAvatar = Joi.object().keys({
  avatar: Joi.string().regex(OBJECT_ID_REGEX).required()
})

const forgotPassword = Joi.object().keys({
  email: Joi.string().email().required()
})

const toggleStatus = Joi.object().keys({
  action: Joi.string().valid([STATUS_ACTION.ENABLE, STATUS_ACTION.DISABLE]).required()
})

const email = Joi.string().email().required()
const password = customJoi.hash().encrypt().required()

module.exports = {
  email,
  create,
  password,
  changePassword,
  activateAccount,
  forgotPassword,
  changeAvatar,
  toggleStatus,
  getAll,
  update,
  filter
}
