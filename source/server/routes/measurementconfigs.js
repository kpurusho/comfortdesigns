var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;


//get methods
exports.getAll = function (req, res) {
    logger.info('requesting all measurement config');
    var type = req.query.type;
    var ids = req.query.ids;
    db.instance().collection('measurementconfigs', function (err, collection) {
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
                        measurementconfigs: items
                    };
                    res.send(matchMeasurements);
                });
            } else if (type) {
                collection.find({ 'type': type}).sort({ orderno: 1 }).toArray(function (err, items) {
                    var matchMeasurements = {
                        measurementconfigs: items
                    };
                    res.send(matchMeasurements);
                });
            } else {
                collection.find().toArray(function (err, items) {
                    var allMeasurements = {
                        measurementconfigs: items
                    };
                    res.send(allMeasurements);
                });
            }
        }
    });
};

exports.getByMeasurementName = function (req, res) {
    var Name = req.param('name', 'undefined');
    logger.info('requesting measurement Name ' + Name);
    db.instance().collection('measurementconfigs', function (err, collection) {
        if (err) {
            logger.error('no table by name measurementconfigs found in db');
            res.send(500, { message: err });

        }
        else {
            collection.find({ 'name': Name }).toArray(function (err, items) {
                var matchMeasurements = {
                    measurementconfigs: items
                };
                res.send(matchMeasurements);
            });
        }
    });
};

exports.getById = function (req, res) {
    var id = req.params.id;
    logger.info('requesting measurement id ' + id);
    db.instance().collection('measurementconfigs', function (err, collection) {
        if (err) {
            logger.error('no table by name measurementconfigs found in db');
            res.send(500, { message: err });

        }
        else {
            collection.findOne({ '_id': BSON.ObjectID(id) }, function (err, item) {
                res.json({ measurementconfig: item });
            });
        }
    });
};

exports.add = function (req, res) {
    var measurement = req.body.measurementconfig;
    logger.info('requesting add measurement - ' + measurement.type);
    db.instance().collection('measurementconfigs', function (err, collection) {
        collection.find({ 'type': measurement.type }).toArray(function (err, items) {
            if (items.length > 0) {
                res.send(500, { message: 'Type ' + measurement.type + ' already exists!!' })
            }
            else {
                collection.insert(measurement, { safe: true }, function (err, result) {
                    if (err) {
                        logger.error('failed to add measurement' + measurement);
                        res.send(500, { message: err })
                    }
                    else {
                        logger.info('successfully added measurement - ' + measurement);
                        res.send({measurementconfig: result[0]});
                    }
                });
            }
        });
    });
};

exports.update = function (req, res) {
    logger.info('requesting measurementconfig update');
    var measurementId = req.params.id;
    var measurementInfo = req.body.measurementconfig;
    logger.info('requesting update measurementconfig with id ' + measurementId);
    db.instance().collection('measurementconfigs', function (err, collection) {
        collection.find({ 'type': measurementInfo.type,
            '_id': { $ne: new BSON.ObjectID(measurementId)} }).toArray(function (err, items) {
            if (items.length > 0) {
                res.send(500, { message: 'Type ' + measurementInfo.type + ' already exists!!' })
            }
            else {
                collection.update({ '_id': new BSON.ObjectID(measurementId) }, measurementInfo, { safe: true }, function (err, result) {
                    if (err) {
                        logger.error('Error updating measurement: ' + err);
                        res.send(500, { message: err });

                    } else {
                        logger.info('' + result + ' document(s) updated');
                        res.send({ measurementconfig: result[0] });
                    }
                });
            }
        });
    });
};

exports.delete = function (req, res) {
    var measurementId = req.params.id;
    logger.info('requesting delete measurement with id ' + measurementId);
    db.instance().collection('measurementconfigs', function (err, collection) {
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

var populateCollection = function(){
    console.log('populateCollection');
    var items = [ {
        type : "Blouse",
        measurementitems : [
            {
                _id : "0",
                itemname : "length",
                min : 0,
                max : 100
            },
            {
                _id : "1",
                itemname : "shoulder",
                min : 0,
                max : 100
            },
            {
                _id : "2",
                itemname : "shouldercut",
                min : 0,
                max : 100
            },
            {
                _id : "3",
                itemname : "chest",
                min : 0,
                max : 100
            },
            {
                _id : "4",
                itemname : "chestmnt",
                min : 0,
                max : 100
            },
            {
                _id : "5",
                itemname : "chestfinishedmnt",
                min : 0,
                max : 100
            },
            {
                _id : "6",
                itemname : "waist",
                min : 0,
                max : 100
            },
            {
                _id : "7",
                itemname : "bb",
                min : 0,
                max : 100
            },
            {
                _id : "8",
                itemname : "backneck",
                min : 0,
                max : 100
            },
            {
                _id : "9",
                itemname : "frontnecksllength",
                min : 0,
                max : 100
            },
            {
                _id : "10",
                itemname : "sllength",
                min : 0,
                max : 100
            },
            {
                _id : "11",
                itemname : "slcircum1",
                min : 0,
                max : 100
            },
            {
                _id : "12",
                itemname : "slcircum2",
                min : 0,
                max : 100
            },
            {
                _id : "13",
                itemname : "arm",
                min : 0,
                max : 100
            },
            {
                _id : "14",
                itemname : "armcut",
                min : 0,
                max : 100
            },
            {
                _id : "15",
                itemname : "armslant",
                min : 0,
                max : 100
            },
            {
                _id : "16",
                itemname : "bl",
                min : 0,
                max : 100
            },
            {
                _id : "17",
                itemname : "blsplit",
                min : 0,
                max : 100
            },
            {
                _id : "18",
                itemname : "lc",
                min : 0,
                max : 100
            },
            {
                _id : "19",
                itemname : "seat",
                min : 0,
                max : 100
            },
            {
                _id : "20",
                itemname : "wb",
                min : 0,
                max : 100
            },
            {
                _id : "21",
                itemname : "seatlength",
                min : 0,
                max : 100
            },
            {
                _id : "22",
                itemname : "topsflair",
                min : 0,
                max : 100
            },
            {
                _id : "23",
                itemname : "slitfrom",
                min : 0,
                max : 100
            },
            {
                _id : "24",
                itemname : "bottomflair",
                min : 0,
                max : 100
            },
            {
                _id : "25",
                itemname : "gatheringw1",
                min : 0,
                max : 100
            },
            {
                _id : "26",
                itemname : "gatheringw2",
                min : 0,
                max : 100
            },
            {
                _id : "27",
                itemname : "gatheringw3",
                min : 0,
                max : 100
            },
            {
                _id : "28",
                itemname : "gatheringl1",
                min : 0,
                max : 100
            },
            {
                _id : "29",
                itemname : "gatheringl2",
                min : 0,
                max : 100
            }
        ]
    }];

    db.instance().collection('measurementconfigs', function(err, collection){
        collection.insert(items, {safe:true}, function(err,result){});
    });

};
