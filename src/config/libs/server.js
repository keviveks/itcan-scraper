/* eslint-disable no-empty */
const express = require('express');
const logger = require('./logger');
const modules = require('../../../modules');

/**
 * Init - adding application variables to app object
 * @param {Object} app express app object
 * @param {Object} env env properties & methods
 */
module.exports.initLocalVariables = (app, env) => {
  app.title = env.appName;
  app.env = env.env;
  app.port = env.port;
};

/**
 * Init dependent middlewares to app object
 * @param {Object} app express app object
 */
module.exports.initMiddlewares = (app) => {
  // Specify a single subnet for trusted proxy.
  app.set("trust proxy", "127.0.0.1");

  app.set('view engine', 'pug');
};

/**
 * Init public static upload files
 * @param {Object} app express app object
 */
module.exports.initStaticFiles = (app) => {
  app.use('/public', express.static(`${process.cwd()}/public`));
};

/**
 * Initialize all app module routers from core v1 router
 * @param {Object} app express app object
 */
module.exports.initRouters = (app) => {
  // Initialize express router
  const router = express.Router();

  // module routers
  // eslint-disable-next-line
  modules.map(moduleRouter => require(`${moduleRouter}/router.js`)(router));

  // mount app routes
  app.use('/app', router);

  // api status route
  app.use('/status', (req, res) => res.send('{APP_NAME} running in {ENV} {DATE}'));

  // home route
  app.use('/', (req, res) => {
    // TODO: load with another landing page
    res.send({ name: 'Welcome', message: 'Welcome to ItCan Coupon Scraper!' });
  });

  // 404 error route
  app.use('*', (req, res) => {
    res.status(404).send({ name: 'Error', errors: [], message: 'Sorry! you got a wrong url' });
  });
};

/**
 * Error Handler with log & error response
 * @param {Object} app express app object
 */
module.exports.initErrorHandler = (app) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err && next) {
      return next();
    }
    // Log it
    logger.error('--- ERROR ---');
    logger.error(`Request: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(err);
    logger.error('--- ERROR ---');
    // error response with status code
    return res.status(err.status || 500).send(err);
  });
};

/**
 * Initialize the app with middlewares
 *
 * @param {Object} config config class with env properties & methods
 * @return {Object} app express object
 */
module.exports.init = (env) => {
  try {
    // Initialize express app & other middlewares
    const app = express();

    // init some local variables
    this.initLocalVariables(app, env);

    // init all middlewares
    this.initMiddlewares(app, env);

    // init static files
    this.initStaticFiles(app);

    // init router
    this.initRouters(app);

    // init error handler
    this.initErrorHandler(app);

    return app;
  } catch (err) {
    console.log(err);
    return err;
  }
};

/**
 * Express to listen in server port
 * @param {Object} app express app object
 * @param {Object} conn mongoose connection object
 */
module.exports.listen = async (app, conn) => {
  try {
    if (conn) {
      const server = await app.listen(app.port, () => {
        logger.info('--');
        logger.info(app.title);
        logger.info();
        logger.info(`Environment:     ${app.env}`);
        logger.info(`Server:          ${app.server}`);
        logger.info(`Database:        ${app.dburi}`);
        logger.info(`Started At:      ${new Date()}`);
        logger.info('--');
      });

      return server;
    }

    return process.exit(1);
  } catch (err) {
    console.log(err);
    return err;
  }
};
