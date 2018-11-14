const express = require('express');
const addRequestId = require('express-request-id')();
const {
  errorHandler,
  pageNotFoundHandler,
  setIsMobileMiddleware
} = require('../utils');

const viewsRouter = require('./view/router');

const contentRouter = require('./content/router');
const userRouter = require('./user/router');
const authRouter = require('./auth/router');
const activityRouter = require('./activity/router');
const accessRolesRouter = require('./accessRole/router');
const notificationRouter = require('./notification/router');

const houseRouter = require('./house/router');
const categoryRouter = require('./category/router');
const brandRouter = require('./brand/router');
const productRouter = require('./product/router');
const itemRouter = require('./item/router');

const cityRouter = require('./city/router');
const marketRouter = require('./market/router');
const mallRouter = require('./mall/router');
const customerRouter = require('./customer/router');
const shopRouter = require('./shop/router');

const filterRouter = require('./filter/router');
const currencyRouter = require('./currency/router');
const targetRouter = require('./target/router');

const apiRouter = express.Router();
module.exports = function attachRouter(app) {
  app.use(addRequestId);

  // used for API version-ing
  app.use('/', viewsRouter);
  app.use('/api/v1', apiRouter);

  // all routes by features
  // =============================================
  apiRouter.use('/cms/target', targetRouter.cms);
  apiRouter.use('/cms/filter', filterRouter.cms);
  apiRouter.use('/cms/currency', currencyRouter.cms);
  apiRouter.use('/cms/auth', authRouter.cms);
  apiRouter.use('/cms/user', userRouter.cms);
  apiRouter.use('/cms/role', accessRolesRouter.cms);
  apiRouter.use('/cms/activity', activityRouter.cms);
  apiRouter.use('/cms/notification', notificationRouter.cms);
  apiRouter.use('/cms/content', contentRouter.cms);
  // item router
  apiRouter.use('/cms/house', houseRouter.cms);
  apiRouter.use('/cms/category', categoryRouter.cms);
  apiRouter.use('/cms/brand', brandRouter.cms);
  apiRouter.use('/cms/product', productRouter.cms);
  apiRouter.use('/cms/item', itemRouter.cms);
  // location router
  apiRouter.use('/cms/market', marketRouter.cms);
  apiRouter.use('/cms/city', cityRouter.cms);
  apiRouter.use('/cms/mall', mallRouter.cms);
  apiRouter.use('/cms/customer', customerRouter.cms);
  apiRouter.use('/cms/shop', shopRouter.cms);


  // set req.isMobile to true
  apiRouter.use(setIsMobileMiddleware);
  apiRouter.use('/mobile/user', userRouter.mobile);
  apiRouter.use('/mobile/auth', authRouter.mobile);
  apiRouter.use('/mobile/target', targetRouter.mobile);
  // item router
  apiRouter.use('/mobile/house', houseRouter.mobile);
  apiRouter.use('/mobile/category', categoryRouter.mobile);
  apiRouter.use('/mobile/brand', brandRouter.mobile);
  apiRouter.use('/mobile/product', productRouter.mobile);
  // location router
  apiRouter.use('/mobile/market', marketRouter.mobile);
  apiRouter.use('/mobile/city', cityRouter.mobile);
  apiRouter.use('/mobile/mall', mallRouter.mobile);
  apiRouter.use('/mobile/customer', customerRouter.mobile);
  apiRouter.use('/mobile/shop', shopRouter.mobile);
  apiRouter.use('/mobile/item', itemRouter.mobile);

  app.use(pageNotFoundHandler);
  app.use(errorHandler);
};
