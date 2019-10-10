const _ = require('lodash')
const { ERROR_NAMES, LOC_STR } = require('../constants/responses')
const localization = require('../constants/locales/global.en.json')

const customError = (callback, options, excludeFromStackTrace = customError) => {
  const { locKey = LOC_STR.GENERAL.BAD_REQUEST } = options
  const {
    status = 400,
    name = ERROR_NAMES.BAD_REQUEST,
    message = _.get(localization[locKey], 'message') || ERROR_NAMES.BAD_REQUEST,
    details,
    internalErrorInfo,
  } = options
  const err = new Error(message)

  err.status = status
  err.name = name
    .toUpperCase()
    .split(' ')
    .join('_')
  err.localizationKey = locKey

  // add details if it's joi ValidationError
  if (details) {
    err.details = details
  }

  // used only for local logging!!! To improve server log readability
  if (internalErrorInfo) {
    // eslint-disable-next-line
    err._errInfo = internalErrorInfo
  }

  // used to exclude auxiliary functions from stack trace
  Error.captureStackTrace(err, excludeFromStackTrace)

  callback(err)
}

const error = (cb, ex, _details) => {
  const details = ex.details || _details

  customError(
    cb,
    {
      status: 500,
      name: ERROR_NAMES.INTERNAL_ERROR,
      locKey: LOC_STR.GENERAL.INTERNAL_ERROR,
      internalErrorInfo: {
        ex,
        details,
      },
    },
    error
  )
}

const badRequest = (cb, opt = LOC_STR.GENERAL.BAD_REQUEST) => {
  let locKey

  // To have ability to pass error or custom localization key as 2nd parameter
  if (opt instanceof Error) {
    locKey = opt.message
  } else {
    locKey = opt
  }

  customError(
    cb,
    {
      status: 400,
      name: ERROR_NAMES.BAD_REQUEST,
      locKey,
    },
    badRequest
  )
}

/* eslint-disable */
const validationError = (cb, error = {}) => {
  const status = 400
  const name = ERROR_NAMES.VALIDATION_ERROR
  const locKey = LOC_STR.GENERAL.VALIDATION_ERROR
  let { details: [{ message = ERROR_NAMES.VALIDATION_ERROR } = {}] = [], details = [] } = error

  details = details.map(item => {
    return {
      message: item.message,
      path: item.path,
      localizationKey: LOC_STR.GENERAL.VALIDATION_ERROR,
    }
  })

  customError(
    cb,
    {
      status,
      name,
      locKey,
      message,
      details,
    },
    validationError
  )
}
/* eslint-enable */

const notAuthorized = (cb, locKey = LOC_STR.GENERAL.NOT_AUTHORIZED) => {
  customError(
    cb,
    {
      status: 401,
      name: ERROR_NAMES.NOT_AUTHORIZED,
      locKey,
    },
    notAuthorized
  )
}

const forbidden = (cb, locKey = LOC_STR.GENERAL.FORBIDDEN) => {
  customError(
    cb,
    {
      status: 403,
      name: ERROR_NAMES.FORBIDDEN,
      locKey,
    },
    forbidden
  )
}

const customSuccess = (res, data, options = {}) => {
  const { status = 200, message = 'Ok' } = options

  res.status(status).send(Object.assign({ message }, data))
}

const ok = (res, message = ERROR_NAMES.SUCCESS) => {
  customSuccess(res, {}, { status: 200, message })
}

module.exports = {
  success: customSuccess,
  error,
  ok,
  validationError,
  badRequest,
  notAuthorized,
  forbidden,
}
