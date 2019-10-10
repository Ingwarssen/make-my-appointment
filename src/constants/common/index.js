module.exports = {
  RESPONSE_MESSAGE: {
    SUCCESS: 'Ok',
    ERROR: 'Error',
  },

  USER_STATUS: {
    REGISTERED: 'registered',
    ACTIVE: 'active',
    DISABLED: 'disabled',
  },

  ITEM_STATUS: {
    ACTIVE: 'active',
    DISABLED: 'disabled',
  },

  STATUS_ACTION: {
    ENABLE: 'enable',
    DISABLE: 'disable',
  },

  DEF_USER: {
    name: 'Super Admin',
    status: 'active',
  },

  CONTENT_STATUS: {
    PENDING: 'pending',
    DONE: 'done',
    ERROR: 'error',
  },

  GOODS_GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    UNISEX: 'unisex',
  },

  OBJECT_ID_REGEX: /^[0-9a-fA-F]{24}$/,
  DEFAULT_AVATAR_URL: 'https://www.fancyhands.com/images/default-avatar-250x250.png',
}
