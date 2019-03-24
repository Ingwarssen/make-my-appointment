const ROLE = require('../role')
const admin = require('./admin')

module.exports = {
  [ROLE.ADMIN._id]: admin
}
