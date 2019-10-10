const logger = require('./logger')
const { ERROR_NAMES, LOC_STR } = require('../constants/responses')

// eslint-disable-next-line
module.exports = (err, req, res, next) => {
  const {
    status = 500,
    name = ERROR_NAMES.INTERNAL_ERROR,
    message = ERROR_NAMES.INTERNAL_ERROR,
    localizationKey = LOC_STR.GENERAL.INTERNAL_ERROR,
    details,
    stack: stackTrace,
    _errInfo: { ex = '', details: errDetails = '' } = {},
  } = err
  const { id: requestId, session: { uId: userId } = { uId: null } } = req

  const logObject = { status, userId, requestId, name, message }

  // for keeping log clean
  if (![401, 403].includes(status) && name !== 'VALIDATION_ERROR') {
    logObject.stackTrace = stackTrace.split('\n')
  }

  logger.error(logObject, errDetails, ex)

  res.status(status).send({ status, requestId, name, message, localizationKey, details })
}
