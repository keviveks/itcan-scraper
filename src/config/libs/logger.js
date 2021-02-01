const winston = require('winston');
const { log, env } = require('../env');

/**
 * Instantiate Winston with Console & File transports by default
 */
const logger = winston.createLogger({
  level: log.level,
  format: winston.format.simple(),
  transports: [
    new (winston.transports.Console)({
      format: winston.format.simple(),
    }),
    new (winston.transports.File)({ filename: log.file }),
  ],
});

// remove console log for production
if (env !== 'development') {
  logger.remove(winston.transports.Console);
}

// export the winston logger object
module.exports = logger;
