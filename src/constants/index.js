const DB = require('./db')
const RESPONSES = require('./responses')
const COMMON = require('./common')

const EXTRA = {
  DB,
  RESPONSES
}

// used to make common as root but extend by other constants
const CONSTANTS = Object.assign({}, COMMON, EXTRA)

module.exports = CONSTANTS
