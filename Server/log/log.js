var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/server.log' });
winston.remove(winston.transports.Console);


exports.logger = winston;

