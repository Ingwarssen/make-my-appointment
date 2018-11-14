const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongo = require('./mongo');

function connect() {
  return session({
    name             : 'make-my-appointment-api',
    key              : 'make-my-appointment-api',
    secret           : '1f09ff2ec00c664a588b6a6ce44c3d814601cc27f35d17123c666621eef5dea3',
    resave           : true,
    rolling          : true,
    saveUninitialized: true,

    cookie: {
      maxAge  : 365 * 24 * 60 * 60 * 1000, // One year
      httpOnly: true,
      secure  : false
    },

    store: new MongoStore({
      autoRemove        : 'interval',
      autoRemoveInterval: 10,
      db                : mongo.connection.db
    })
  });
}

module.exports = {
  connect
};
