const ROLE = require('../role')
const superAdmin = require('./superAdmin')
const admin = require('./admin')
const trainer = require('./trainer')
const client = require('./client')
const visitor = require('./visitor')

module.exports = {
  [ROLE.SUPER_ADMIN._id]: superAdmin,
  [ROLE.ADMIN._id]      : admin,
  [ROLE.TRAINER._id]    : trainer,
  [ROLE.CLIENT._id]     : client,
  [ROLE.VISITOR._id]    : visitor
}
