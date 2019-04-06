const {
  SUPER_ADMIN,
  ADMIN,
  TRAINER,
  VISITOR,
  CLIENT
} = require('./roleNames')

const {id: SAD} = SUPER_ADMIN
const {id: AD} = ADMIN
const {id: TR} = TRAINER
const {id: CL} = CLIENT
const {id: VI} = VISITOR

module.exports = {
  SUPER_ADMIN: {
    _id                   : SAD,
    level                 : 1,
    name                  : SUPER_ADMIN.name,
    allowedLoginFromMobile: true
  },

  ADMIN: {
    _id                   : AD,
    level                 : 11,
    name                  : ADMIN.name,
    allowedLoginFromMobile: true
  },

  TRAINER: {
    _id                   : TR,
    level                 : 22,
    name                  : TRAINER.name,
    allowedLoginFromMobile: true
  },

  CLIENT: {
    _id                   : CL,
    level                 : 33,
    name                  : CLIENT.name,
    allowedLoginFromMobile: true
  },

  VISITOR: {
    _id                   : VI,
    level                 : 44,
    name                  : VISITOR.name,
    allowedLoginFromMobile: true
  }
}
