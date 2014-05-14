var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;


//get methods
exports.getAll = function (req, res) {
    logger.info('requesting all customers');
    var phoneno = req.query.phoneno;
    var name = req.query.name;

    logger.info('phoneno = ' + phoneno);
    logger.info('name = ' + name);
    //var phno = req.param('phoneno', 'undefined');
    db.instance().collection('customers', function (err, collection) {
        if (err) {
            logger.error('no table by name customers found in db');
            res.send(500, { message: err })
        }
        else {
            if (name) {
                collection.find({ 'name': name }).toArray(function (err, items) {
                    var matchCustomers = {
                        customers: items
                    };
                    res.send(matchCustomers);
                });
            }
            else if (phoneno) {
                collection.find({ 'phoneno': phoneno }).toArray(function (err, items) {
                    var matchCustomers = {
                        customers: items
                    };
                    res.send(matchCustomers);
                });
            }
            else {
                collection.find().sort({ name: 1 }).toArray(function (err, items) {
                    var allCustomers = {
                        customers: items
                    };
                    res.send(allCustomers);
                });
            }
        }
    });
};

exports.getByCustomerName = function (req, res) {
    var Name = req.param('name', 'undefined');
    logger.info('requesting customer Name ' + Name);
    db.instance().collection('customers', function (err, collection) {
        if (err) {
            logger.error('no table by name customers found in db');
            res.send(500, { message: err });

        }
        else {
            collection.find({ 'name': Name }).toArray(function (err, items) {
                var matchCustomers = {
                    customers: items
                };
                res.send(matchCustomers);
            });
        }
    });
};

exports.getById = function (req, res) {
    var id = req.params.id;
    logger.info('requesting customer id ' + id);
    db.instance().collection('customers', function (err, collection) {
        if (err) {
            logger.error('no table by name customers found in db');
            res.send(500, { message: err });

        }
        else {
            collection.findOne({ '_id': BSON.ObjectID(id) }, function (err, item) {
                res.json({ customer: item });
            });
        }
    });
};

exports.add = function (req, res) {
    var customer = req.body.customer;
    logger.info('customer add body - ' + req.body);
    logger.info('requesting add customer - ' + customer.name);
    db.instance().collection('customers', function (err, collection) {
        collection.insert(customer, { safe: true }, function (err, result) {
            if (err) {
                logger.error('failed to add customer' + customer);
                res.send(500, { message: err });

            }
            else {
                logger.info('successfully added customer - ' + customer);
                res.send({customer: result[0]});
            }
        });
    });
};

exports.update = function (req, res) {
    var customerId = req.params.id;
    var customerInfo = req.body.customer;
    logger.info('requesting update customer with id ' + customerId);
    db.instance().collection('customers', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(customerId) }, customerInfo, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error updating customer: ' + err);
                res.send(500, { message: err });

            } else {
                logger.log('' + result + ' document(s) updated');
                res.send({customer: result[0]});
            }
        });
    });
};

exports.delete = function (req, res) {
    var customerId = req.params.id;
    logger.info('requesting delete customer with id ' + customerId);
    db.instance().collection('customers', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(customerId) }, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error deleting Customer: ' + err);
                res.send(500, { message: err });

            } else {
                logger.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

