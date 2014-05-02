var express = require('express');
var design = require('./routes/designs');
var tasks = require('./routes/tasks');
var customers = require('./routes/customers');
var measurements = require('./routes/measurements');
var measurementitems = require('./routes/measurementitems');
var measurementconfigs = require('./routes/measurementconfigs');
var measurementitemconfigs = require('./routes/measurementitemconfigs');
var orders = require('./routes/orders');
var logger = require('./log/log').logger;

var app = express();
 // ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
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
var logstream = {
	write : function(message, encoding) {
			logger.info(message);
		}
};
app.use(express.logger({stream : logstream}));


//Task related API's
app.get('/tasks', tasks.getAll);
app.get('/tasks/TName', tasks.getByName);
app.get('/tasks/:id', tasks.getById);
app.post('/tasks', tasks.add);
app.put('/tasks/:id', tasks.update);
app.delete('/tasks/:id', tasks.delete);

//Customer related API's
app.get('/customers', customers.getAll);
app.get('/customers/:id', customers.getById);
app.post('/customers', customers.add);
app.put('/customers/:id', customers.update);
app.delete('/customers/:id', customers.delete);

//Measurement related API's
app.get('/measurements', measurements.getAll);
app.get('/measurements/:id', measurements.getById);
app.post('/measurements', measurements.add);
app.put('/measurements/:id', measurements.update);
app.delete('/measurements/:id', measurements.delete);


//Measurement related API's
app.get('/measurementitems', measurementitems.getAll);
app.get('/measurementitems/:id', measurementitems.getById);
app.post('/measurementitems', measurementitems.add);
app.put('/measurementitems/:id', measurementitems.update);
app.delete('/measurementitems/:id', measurementitems.delete);

//Measurement config related API's
app.get('/measurementconfigs', measurementconfigs.getAll);
app.get('/measurementconfigs/:id', measurementconfigs.getById);
app.post('/measurementconfigs', measurementconfigs.add);
app.put('/measurementconfigs/:id', measurementconfigs.update);
app.delete('/measurementconfigs/:id', measurementconfigs.delete);


//Measurement config related API's
app.get('/measurementitemconfigs', measurementitemconfigs.getAll);
app.get('/measurementitemconfigs/:id', measurementitemconfigs.getById);
app.post('/measurementitemconfigs', measurementitemconfigs.add);
app.put('/measurementitemconfigs/:id', measurementitemconfigs.update);
app.delete('/measurementitemconfigs/:id', measurementitemconfigs.delete);

//Order related API's
app.get('/orders', orders.getAll);
app.get('/orders/:id', orders.getById);
app.post('/orders', orders.add);
app.put('/orders/:id', orders.update);
app.delete('/orders/:id', orders.delete);

//Order summary
app.get('/ordersummaries', orders.getSummary);

app.listen(3000);

logger.info('server listening on port 3000...')



