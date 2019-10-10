const { responseSender, logger } = require('../../../utils')

module.exports = async (req, res, next) => {
  logger.log('got callback', responseSender)

  next()
}
