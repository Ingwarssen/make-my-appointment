const express = require('express')
const addRequestId = require('express-request-id')()
const { errorHandler, pageNotFoundHandler, setIsMobileMiddleware } = require('../utils')

const viewsRouter = require('./view/router')

const userRouter = require('./user/router')
const authRouter = require('./auth/router')

const apiRouter = express.Router()

module.exports = app => {
  app.use(addRequestId)

  // used for API version-ing
  app.use('/', viewsRouter)
  app.use('/api/v1', apiRouter)

  // all routes by features
  // =============================================

  // set req.isMobile to true
  apiRouter.use(setIsMobileMiddleware)
  apiRouter.use('/mobile/user', userRouter.mobile)
  apiRouter.use('/mobile/auth', authRouter.mobile)

  app.use(pageNotFoundHandler)
  app.use(errorHandler)
}
