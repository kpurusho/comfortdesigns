var express = require('express');
var design = require('./routes/designs');
var logger = require('./log/log').logger;

var app = express();

//uncomment following sectionto include express logging into logger
//var logstream = {
//	write : function(message, encoding) {
//			logger.info(message);
//		}
//};
//app.use(express.logger({stream : logstream}));

app.get('/', design.getAll);
app.get('/designs', design.getAll);
app.get('/designs/:id', design.getById);

app.listen(3000);

logger.info('server listening on port 3000...')



