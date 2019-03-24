const express = require('express')
const addRequestId = require('express-request-id')()
const {
  errorHandler,
  pageNotFoundHandler,
  setIsMobileMiddleware
} = require('../utils')

const viewsRouter = require('./view/router')

const userRouter = require('./user/router')
const authRouter = require('./auth/router')
const accessRolesRouter = require('./accessRole/router')

const filterRouter = require('./filter/router')

const apiRouter = express.Router()
module.exports = function attachRouter (app) {
  app.use(addRequestId)

  // used for API version-ing
  app.use('/', viewsRouter)
  app.use('/api/v1', apiRouter)

  // all routes by features
  // =============================================
  apiRouter.use('/cms/filter', filterRouter.cms)
  apiRouter.use('/cms/auth', authRouter.cms)
  apiRouter.use('/cms/user', userRouter.cms)
  apiRouter.use('/cms/role', accessRolesRouter.cms)

  // set req.isMobile to true
  apiRouter.use(setIsMobileMiddleware)
  apiRouter.use('/mobile/user', userRouter.mobile)
  apiRouter.use('/mobile/auth', authRouter.mobile)

  app.use(pageNotFoundHandler)
  app.use(errorHandler)
}
