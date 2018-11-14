const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const config = require('../config');
const logger = require('./logger');

mongoose.Promise = Bluebird;
const dbUri = config.mongodbUri;
const isProduction = config.isProduction;
let connected = false;

module.exports = {
  get connection() {
    if (!connected) {
      throw new Error('Please create connection to DB server first');
    }

    return mongoose.connection;
  },

  connect() {
    // When successfully connected
    mongoose.connection.on('connected', () => {
      logger.info(`Mongoose default connection open to ${isProduction ? 'database' : dbUri}`);
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose default connection error: ${isProduction ? '' : dbUri}`, err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      logger.error('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        logger.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
      });
    });

    return mongoose.connect(dbUri).then(() => {
      connected = true;
    });
  },

  dropDatabase() {
    if (!connected) {
      throw new Error('Please create connection to DB server first');
    }

    return mongoose.connection.db.dropDatabase();
  }
};
