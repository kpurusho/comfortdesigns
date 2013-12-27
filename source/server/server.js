var express = require('express');
var design = require('./routes/designs');
var tasks = require('./routes/tasks');
var customers = require('./routes/customers');
var logger = require('./log/log').logger;

var app = express();
 // ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    console.log("writing cross domain headers...");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};  

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
});

//uncomment following sectionto include express logging into logger
//var logstream = {
//	write : function(message, encoding) {
//			logger.info(message);
//		}
//};
//app.use(express.logger({stream : logstream}));


//Task related API's
app.get('/tasks', tasks.getAllTasks);
app.get('/tasks/TName', tasks.getByTaskName);
app.get('/tasks/:id', tasks.getById);

app.post('/tasks', tasks.addTask);

app.put('/tasks/:id', tasks.updateTask);

app.delete('/tasks/:id', tasks.deleteTask);

//Customer related API's
app.get('/customers', customers.getAllCustomers);
app.get('/customers/:id', customers.getById);
app.post('/customers', customers.addCustomer);
app.put('/customers/:id', customers.updateCustomer);
app.delete('/customers/:id', customers.deleteCustomer);

app.listen(3000);

logger.info('server listening on port 3000...')



