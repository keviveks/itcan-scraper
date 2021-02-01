const dotenv = require('dotenv');

dotenv.config();

/**
 * Export environment variables
 */
module.exports = {
  env: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  port: process.env.PORT,
  scrapWebUrl: process.env.SCRAP_WEB_URL,
  dbPath: process.env.DB_PATH,
  log: {
    format: process.env.LOG_FORMAT,
    level: process.env.LOG_LEVEL,
    file: process.env.LOG_FILE,
  },
};
