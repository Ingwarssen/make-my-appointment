const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const consolidate = require('consolidate')
const config = require('./config')
const startUpScript = require('./init')
const mainRouter = require('./features')
require('mongoose')
const {
  mongo,
  logger,
  isApiAvailable,
  sessionMiddleware,
  cacheControlMiddleware
} = require('./utils')

let app

process.on('unhandledRejection', reason => {
  logger.error(reason)
  process.exit(1)
})

process.on('uncaughtException', error => {
  logger.error(error)
  process.exit(1)
})

module.exports = {
  get app () {
    if (!app) {
      throw new Error('Please run server first')
    }

    return app
  },

  async run () {
    app = express()

    // connect to database
    await mongo.connect()

    // set up views
    app.engine('hbs', consolidate.handlebars)
    app.set('view engine', 'hbs')
    app.set('views', `${config.workingDirectory}src/views`)

    // set static directory
    app.use(express.static(`${config.workingDirectory}dist`))

    // setup body parser
    app.use(bodyParser.json({
      strict: false,
      limit : '10mb'
    }))
    app.use(bodyParser.urlencoded({
      extended: false
    }))

    app.use(sessionMiddleware.connect())
    app.use(cacheControlMiddleware)

    // set logger for request
    app.use(morgan('dev'))
    app.get('/info', isApiAvailable)

    // attach main router
    mainRouter(app)

    const httpServer = http.createServer(app)

    await startUpScript()

    httpServer.listen(config.port, () => {
      logger.info(' --------------------------------------------------------------------')
      logger.info(`  Server started at port ${config.port} in ${config.env} environment`)
      logger.info(' --------------------------------------------------------------------')
    })

    return httpServer
  }
}
