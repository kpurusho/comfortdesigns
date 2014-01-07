var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;
//var print = require('../../../../../js/jslearning/printprops.js');


//get methods
exports.getAll = function (req, res) {
    logger.info('requesting all orders');
    db.instance().collection('orders', function (err, collection) {
        if (err) {
            logger.error('no table by name orders found in db');
            res.send({ 'error': 'An error has occured - ' + err });
        }
        else {
            collection.find().sort({ orderdate: 1 }).toArray(function (err, items) {
                var allOrders = {
                    orders: items
                };
                res.send(allOrders);
            });
        }
    });
};

exports.getByOrderName = function (req, res) {
    var Name = req.param('name', 'undefined');
    logger.info('requesting order Name ' + Name);
    db.instance().collection('orders', function (err, collection) {
        if (err) {
            logger.error('no table by name orders found in db');
            res.send({ 'error': 'An error has occured - ' + err });
        }
        else {
            collection.find({ 'name': Name }).toArray(function (err, items) {
                var matchOrders = {
                    orders: items
                };
                res.send(matchOrders);
            });
        }
    });
};

exports.getById = function (req, res) {
    var id = req.params.id;
    logger.info('requesting order id ' + id);
    db.instance().collection('orders', function (err, collection) {
        if (err) {
            logger.error('no table by name orders found in db');
            res.send({ 'error': 'An error has occured - ' + err });
        }
        else {
            collection.findOne({ '_id': BSON.ObjectID(id) }, function (err, item) {
                res.json({ order: item });
            });
        }
    });
};

exports.add = function (req, res) {
    var order = req.body.order;
    logger.info('order add body - ' + req.body);
    logger.info('requesting add order - ' + order.name);
    db.instance().collection('orders', function (err, collection) {
        collection.insert(order, { safe: true }, function (err, result) {
            if (err) {
                logger.error('failed to add order' + order);
                res.send({ 'error': 'An error has occured - ' + err });
            }
            else {
                logger.info('successfully added order - ' + order);
                res.send({order: result[0]});
            }
        });
    });
};

exports.update = function (req, res) {
    var orderId = req.params.id;
    var orderInfo = req.body.order;
    logger.info('requesting update order with id ' + orderId);
    logger.info(JSON.stringify(orderInfo));
    db.instance().collection('orders', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(orderId) }, orderInfo, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error updating order: ' + err);
                res.send({ 'error': 'An error has occured - ' + err });
            } else {
                logger.log('' + result + ' document(s) updated');
                res.send({order: result[0]});
            }
        });
    });
};

exports.delete = function (req, res) {
    var orderId = req.params.id;
    logger.info('requesting delete order with id ' + orderId);
    db.instance().collection('orders', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(orderId) }, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error deleting Order: ' + err);
                res.send({ 'error': 'An error has occured - ' + err });
            } else {
                logger.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

