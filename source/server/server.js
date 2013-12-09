var express = require('express');
var design = require('./routes/designs');
var tasks = require('./routes/tasks');
var logger = require('./log/log').logger;

var app = express();

app.use(express.bodyParser());

//uncomment following sectionto include express logging into logger
//var logstream = {
//	write : function(message, encoding) {
//			logger.info(message);
//		}
//};
//app.use(express.logger({stream : logstream}));

//app.get('/', design.getAll);
//app.get('/designs', design.getAll);
//app.get('/designs/:id', design.getById);

app.get('/tasks', tasks.getAllTasks);
app.get('/tasks/TName', tasks.getByTaskName);
app.get('/tasks/:id', tasks.getById);
app.post('/tasks', tasks.addTask);
app.put('/tasks/:id', tasks.updateTask);
app.delete('/tasks/:id', tasks.deleteTask);

app.listen(3000);

logger.info('server listening on port 3000...')



