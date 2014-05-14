var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;


//get methods
exports.getAll = function (req, res) {
    logger.info('requesting all measurement config');
    var ids = req.query.ids;
    db.instance().collection('measurementitemconfigs', function (err, collection) {
        if (err) {
            console.log('collection not found')
        }
        else
        {
            if (ids) {
                var idArr = [];
                ids.forEach(function (id) {
                    idArr.push(BSON.ObjectID(id));
                });

                collection.find({ '_id': { $in: idArr }}).toArray(function (err, items) {
                    var matchMeasurements = {
                        measurementitemconfigs: items
                    };
                    res.send(matchMeasurements);
                });
            }
            else {
                console.log('collection found')
                collection.find().toArray(function (err, items) {
                    console.log('collection count = '+ items.length);
                    var allMeasurements = {
                        measurementitemconfigs: items
                    };
                    res.send(allMeasurements);
                });
            }
        }
    });
};

exports.getByMeasurementName = function (req, res) {
    var Name = req.param('itemname', 'undefined');
    logger.info('requesting measurement Name ' + Name);
    db.instance().collection('measurementitemconfigs', function (err, collection) {
        if (err) {
            logger.error('no table by name measurementitemconfigs found in db');
            res.send(500, { message: err });

        }
        else {
            collection.find({ 'itemname': Name }).toArray(function (err, items) {
                var matchMeasurements = {
                    measurementitemconfigs: items
                };
                res.send(matchMeasurements);
            });
        }
    });
};

exports.getById = function (req, res) {
    var id = req.params.id;
    logger.info('requesting measurement id ' + id);
    db.instance().collection('measurementitemconfigs', function (err, collection) {
        if (err) {
            logger.error('no table by name measurementitemconfigs found in db');
            res.send(500, { message: err });

        }
        else {
            collection.findOne({ '_id': BSON.ObjectID(id) }, function (err, item) {
                res.json({ measurementitemconfig: item });
            });
        }
    });
};

exports.add = function (req, res) {
    var measurement = req.body.measurementitemconfig;
    logger.info('requesting add measurement - ' + measurement.itemname);
    db.instance().collection('measurementitemconfigs', function (err, collection) {
        collection.insert(measurement, { safe: true }, function (err, result) {
            if (err) {
                logger.error('failed to add measurement' + measurement);
                res.send(500, { message: err });

            }
            else {
                logger.info('successfully added measurement - ' + measurement);
                res.send({measurementitemconfig: result[0]});
            }
        });
    });
};

exports.update = function (req, res) {
    var measurementId = req.params.id;
    var measurementInfo = req.body.measurementitemconfig;
    logger.info('requesting update measurement with id ' + measurementId);
    db.instance().collection('measurementitemconfigs', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(measurementId) }, measurementInfo, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error updating measurement: ' + err);
                res.send(500, { message: err });

            } else {
                logger.log('' + result + ' document(s) updated');
                res.send({ measurementitemconfig: result[0] });
            }
        });
    });
};

exports.delete = function (req, res) {
    var measurementId = req.params.id;
    logger.info('requesting delete measurement with id ' + measurementId);
    db.instance().collection('measurementitemconfigs', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(measurementId) }, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error deleting Measurement: ' + err);
                res.send(500, { message: err });

            } else {
                logger.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
