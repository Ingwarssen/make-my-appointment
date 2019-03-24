module.exports = {
  RESPONSE_MESSAGE: {
    SUCCESS: 'Ok',
    ERROR  : 'Error'
  },

  USER_STATUS: {
    INVITED : 'invited',
    ACTIVE  : 'active',
    DISABLED: 'disabled'
  },

  ITEM_STATUS: {
    ACTIVE  : 'active',
    DISABLED: 'disabled'
  },

  STATUS_ACTION: {
    ENABLE : 'enable',
    DISABLE: 'disable'
  },

  DEF_USER: {
    name       : 'Super Admin',
    status     : 'active',
    nationality: 'French'
  },

  TIME: {
    DAYS_IN_YEAR : 365,
    DAYS_IN_MONTH: 31
  },

  CONTENT_STATUS: {
    PENDING: 'pending',
    DONE   : 'done',
    ERROR  : 'error'
  },

  GOODS_GENDER: {
    MALE  : 'male',
    FEMALE: 'female',
    UNISEX: 'unisex'
  },

  OBJECT_ID_REGEX: /^[0-9a-fA-F]{24}$/
}
