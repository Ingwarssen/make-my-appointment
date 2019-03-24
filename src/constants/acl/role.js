const {
  SUPER_ADMIN
} = require('./roleNames')

const {id: ADMIN} = SUPER_ADMIN

module.exports = {
  ADMIN: {
    _id                   : ADMIN,
    level                 : 1,
    name                  : SUPER_ADMIN.name,
    allowedLoginFromMobile: true
  }
}
