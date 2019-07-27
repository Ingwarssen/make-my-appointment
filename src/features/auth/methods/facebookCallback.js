const {
  responseSender
} = require('../../../utils')

module.exports = async (req, res, next) => {
  console.log('got callback')

  next()
}
