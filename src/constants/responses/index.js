module.exports = {
  ERROR_NAMES: {
    // SUCCESS MESSAGES
    SUCCESS: 'Success',

    // ERROR MESSAGES
    BAD_REQUEST                    : 'Bad Request',
    VALIDATION_ERROR               : 'Validation Error',
    NOT_AUTHORIZED                 : 'Not Authorized',
    FORBIDDEN                      : 'Forbidden',
    PAGE_NOT_FOUND                 : 'Page Not Found',
    INTERNAL_ERROR                 : 'Internal Server Error',
    SERVICE_TEMPORARILY_UNAVAILABLE: 'Service Temporarily Unavailable'

  },

  LOC_STR: {
    GENERAL: {
      BAD_REQUEST     : 'general.badRequest',
      NOT_AUTHORIZED  : 'general.notAuthorized',
      FORBIDDEN       : 'general.forbidden',
      VALIDATION_ERROR: 'general.validationError',
      INTERNAL_ERROR  : 'general.internalError'
    },

    AUTH: {
      INCORRECT_LOGIN   : 'auth.incorrectLogin',
      USER_EXISTS   : 'auth.usersExists',
      ACCOUNT_DISABLED  : 'auth.accountDisabled',
      MOBILE_NOT_ALLOWED: 'auth.mobileNotAllowed'
    },

    USER: {
      TOKEN_EXPIRED: 'user.tokenExpired',
      EMAIL_IN_USE : 'user.emailInUse',
      PHONE_IN_USE : 'user.phoneInUse',
      NOT_FOUND    : 'user.notFound'
    },

    CURRENCY: {
      NOT_FOUND: 'currency.notFound'
    },

    ACCESS_ROLE: {
      NOT_FOUND: 'accessRole.notFound'
    }
  }
}
