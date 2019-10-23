const https = require('https')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const consolidate = require('consolidate')

const fs = require('fs')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const config = require('./config')
const startUpScript = require('./init')
const mainRouter = require('./features')
const configurePassportFb = require('./features/auth/strategies/configurePassportFbToken')

const key = fs.readFileSync(__dirname + '/certs/selfsigned.key')
const cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt')
const httpsOptions = { key, cert }

const {
  mongo,
  logger,
  isApiAvailable,
  sessionMiddleware,
  cacheControlMiddleware,
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
  get app() {
    if (!app) {
      throw new Error('Please run server first')
    }

    return app
  },

  async run() {
    app = express()

    // connect to database
    await mongo.connect()

    // configure passport
    await configurePassportFb()

    // set up views
    app.engine('hbs', consolidate.handlebars)
    app.set('view engine', 'hbs')
    app.set('views', `${config.workingDirectory}src/views`)

    app.use(helmet())

    const corsOption = {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      exposedHeaders: ['x-auth-token'],
    }

    app.use(cors(corsOption))

    // set static directory
    app.use(express.static(`${config.workingDirectory}dist`))

    // setup body parser
    app.use(
      bodyParser.json({
        strict: false,
        limit: '10mb',
      })
    )
    app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    )

    app.use(sessionMiddleware.connect())
    app.use(cacheControlMiddleware)

    app.use(cookieParser())

    // set logger for request
    app.use(morgan('dev'))
    app.get('/info', isApiAvailable)

    // attach main router
    mainRouter(app)

    const httpsServer = https.createServer(httpsOptions, app)

    await startUpScript()

    httpsServer.listen(config.port, () => {
      logger.info(' --------------------------------------------------------------------')
      logger.info(`  Server started at port ${config.port} in ${config.env} environment`)
      logger.info(' --------------------------------------------------------------------')
    })

    return httpsServer
  },
}
