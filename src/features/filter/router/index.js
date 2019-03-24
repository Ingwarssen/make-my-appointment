const cmsRouter = require('./cms');
const mobileRouter = require('./mobile');

module.exports = {
  cms   : cmsRouter,
  mobile: mobileRouter
};
