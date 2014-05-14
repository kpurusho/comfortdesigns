var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;


//get methods
exports.getAll = function (req, res) {
    logger.info('requesting all measurementitems');
    var ids = req.query.ids;
    db.instance().collection('measurementitems', function (err, collection) {
        if (err) {
            logger.error('no table by name measurementitems found in db');
            res.send(500, { message: err });

        }
        else {
            if (ids) {
                var idArr = [];
                ids.forEach(function (id) {
                    idArr.push(BSON.ObjectID(id));
                });

                collection.find({ '_id': { $in: idArr }}).toArray(function (err, items) {
                    var matchMeasurements = {
                        measurementitems: items
                    };
                    res.send(matchMeasurements);
                });
            }
            else {
                collection.find().toArray(function (err, items) {
                    var allMeasurements = {
                        measurementitems: items
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
    db.instance().collection('measurementitems', function (err, collection) {
        if (err) {
            logger.error('no table by name measurementitems found in db');
            res.send(500, { message: err });

        }
        else {
            collection.find({ 'itemname': Name }).toArray(function (err, items) {
                var matchMeasurements = {
                    measurementitems: items
                };
                res.send(matchMeasurements);
            });
        }
    });
};

exports.getById = function (req, res) {
    var id = req.params.id;
    logger.info('requesting measurement id ' + id);
    db.instance().collection('measurementitems', function (err, collection) {
        if (err) {
            logger.error('no table by name measurementitems found in db');
            res.send(500, { message: err });

        }
        else {
            collection.findOne({ '_id': BSON.ObjectID(id) }, function (err, item) {
                res.json({ measurementitem: item });
            });
        }
    });
};

exports.add = function (req, res) {
    var mitem = req.body.measurementitem;
    logger.info('requesting add measurementitem - ' + mitem.itemname);
    db.instance().collection('measurementitems', function (err, collection) {
        collection.insert(mitem, { safe: true }, function (err, result) {
            if (err) {
                logger.error('failed to add measurement' + measurementitem);
                res.send(500, { message: err });

            }
            else {
                logger.info('successfully added measurement - ' + mitem);
                res.send({measurementitem: result[0]});
            }
        });
    });
};

exports.update = function (req, res) {
    var measurementId = req.params.id;
    var measurementInfo = req.body.measurementitem;
    logger.info('requesting update measurement with id ' + measurementId);
    db.instance().collection('measurementitems', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(measurementId) }, measurementInfo, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error updating measurement: ' + err);
                res.send(500, { message: err });

            } else {
                logger.log('' + result + ' document(s) updated');
                res.send({ measurementitem: result[0] });
            }
        });
    });
}


exports.delete = function (req, res) {
    var measurementId = req.params.id;
    logger.info('requesting delete measurement with id ' + measurementId);
    db.instance().collection('measurementitems', function (err, collection) {
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

