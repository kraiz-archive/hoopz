'use strict';

const winston = require('winston');

module.exports = new winston.Logger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      align: true,
      colorize: true,
      timestamp: true,
      prettyPrint: true,
      depth: 1
    })
  ],
  exitOnError: false
});
