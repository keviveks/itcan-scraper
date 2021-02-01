const env = require('./config/env');
const logger = require('./config/libs/logger');
const server = require('./config/libs/server');
const scraper = require('./config/libs/scraper');
const database = require('./config/libs/database');
const couponModel = require('./modules/coupon/model');

/**
 * Capture the Unhandled Exception errors in the process
 */
process.on('uncaughtException', err => {
  logger.error('-- Uncaught Exception Error --');
  console.log(err);
  logger.error(err);
});

process.on('unhandledRejection', err => {
  logger.error('-- Unhandled Rejection --');
  logger.error(err);
});

/**
 * Capture the log with exit code on process exit
 */
process.on('exit', (code) => {
  logger.error(`About to exit with code: ${code}`);
});

/**
 * Start the application with express & database
 */
module.exports.start = async (setup) => {
  try {
    // connect sqlite database and run inital setup
    const dbConn = await database.connect(env.dbPath, setup);
    if (setup) {
      await couponScraper();
    }
    // Init express middlewares & error handlers & routers
    const app = await server.init(env);
    // express start & listen to server port
    const serverConn = await server.listen(app, dbConn);
    // return server connection
    return serverConn;
  } catch (error) {
    // log the error & exit the process on any errors
    console.log(error);
    logger.error(error);
    return process.exit(1);
  }
};

async function couponScraper() {
  const $html = await scraper.scrapHtmlFromUrl(env.scrapWebUrl);
  const coupons = await scraper.scrapeCouponsFromHtml($html, env.scrapWebUrl);
  for (let coupon of coupons) {
    await couponModel.insertCoupon(coupon);
  }
}

/**
 * Stop the application with express & mongoose
 */
module.exports.stop = (server) => {
  try {
    // stop the express server instance
    server.close();
    // disconnect database
    database.disconnect();
    // return
    return true;
  } catch (error) {
    // log the error & exit the process on any errors
    console.log(error);
    logger.error(error);
    return process.exit(1);
  }
};





// const scraper = require('./src/libs/scraper');
// const env = require('./src/config/env');

// (async () => {
//   const $webHtml = await scraper.scrapHtmlFromUrl(env.scrapWebUrl);
//   const coupons = await scraper.scrapeCouponsFromHtml($webHtml, env.scrapWebUrl);

//   console.log(coupons);

// })();


// async function scrapSite() {
//   const $webHtml = await scraper.scrapHtmlFromUrl(env.scrapWebUrl);
//   const coupons = await scraper.scrapeCouponsFromHtml($webHtml, env.scrapWebUrl);

//   console.log(coupons);
//   // const u = 'https://www.picodi.com/ae/top#cid=72496';

//   // const a = await scraper.text(u);
//   // await scraper.ts(a);
// }

// scrapSite();
