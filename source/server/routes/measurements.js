var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;
//var print = require('../../../../../js/jslearning/printprops.js');


//get methods
exports.getAll = function (req, res) {
    logger.info('requesting all measurements');
    db.instance().collection('measurements', function (err, collection) {
        if (err) {
            logger.error('no table by name measurements found in db');
            res.send({ 'error': 'An error has occured - ' + err });
        }
        else {
            collection.find().sort({ name: 1 }).toArray(function (err, items) {
                var allCustomers = {
                    measurements: items
                };
                res.send(allCustomers);
            });
        }
    });
};

exports.getByCustomerName = function (req, res) {
    var Name = req.param('name', 'undefined');
    logger.info('requesting measurement Name ' + Name);
    db.instance().collection('measurements', function (err, collection) {
        if (err) {
            logger.error('no table by name measurements found in db');
            res.send({ 'error': 'An error has occured - ' + err });
        }
        else {
            collection.find({ 'name': Name }).toArray(function (err, items) {
                var matchCustomers = {
                    measurements: items
                };
                res.send(matchCustomers);
            });
        }
    });
};

exports.getById = function (req, res) {
    var id = req.params.id;
    logger.info('requesting measurement id ' + id);
    db.instance().collection('measurements', function (err, collection) {
        if (err) {
            logger.error('no table by name measurements found in db');
            res.send({ 'error': 'An error has occured - ' + err });
        }
        else {
            collection.findOne({ '_id': BSON.ObjectID(id) }, function (err, item) {
                res.json({ measurement: item });
            });
        }
    });
};

exports.add = function (req, res) {
    var measurement = req.body.measurement;
    logger.info('requesting add measurement - ' + measurement.name);
    db.instance().collection('measurements', function (err, collection) {
        collection.insert(measurement, { safe: true }, function (err, result) {
            if (err) {
                logger.error('failed to add measurement' + measurement);
                res.send({ 'error': 'An error has occured - ' + err });
            }
            else {
                logger.info('successfully added measurement - ' + measurement);
                res.send({measurement: result[0]});
            }
        });
    });
};

exports.update = function (req, res) {
    var measurementId = req.params.id;
    var measurementInfo = req.body.measurement;
    logger.info('requesting update measurement with id ' + measurementId);
    logger.info(JSON.stringify(measurementInfo));
    db.instance().collection('measurements', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(measurementId) }, measurementInfo, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error updating measurement: ' + err);
                res.send({ 'error': 'An error has occured - ' + err });
            } else {
                logger.log('' + result + ' document(s) updated');
                res.send({ measurement: result[0] });
            }
        });
    });
};

exports.delete = function (req, res) {
    var measurementId = req.params.id;
    logger.info('requesting delete measurement with id ' + measurementId);
    db.instance().collection('measurements', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(measurementId) }, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error deleting Customer: ' + err);
                res.send({ 'error': 'An error has occured - ' + err });
            } else {
                logger.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

