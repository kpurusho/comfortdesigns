var winston = require('winston');
var fs = require('fs');
fs.mkdir('logs', function(e){
});

winston.add(winston.transports.File, { filename: 'logs/server.log', level: 'error' });
winston.remove(winston.transports.Console);


exports.logger = winston;

