var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;
var nodemailer = require('nodemailer');


//get methods
exports.getAll = function (req, res) {
    logger.info('requesting all orders');
    var status = req.query.status;
    var phno = req.query.customerphoneno;
    db.instance().collection('orders', function (err, collection) {
        if (err) {
            logger.error('no table by name orders found in db');
            res.send(500, { message: err });

        }
        else {
            if (status && phno) {
                collection.find({ 'status': status, 'customerphoneno': phno}).sort({ orderno: 1 }).toArray(function (err, items) {
                    var allOrders = {
                        orders: items
                    };
                    res.send(allOrders);
                });
            }
            else if (status) {
                collection.find({ 'status': { $in: status }}).sort({ orderno: 1 }).toArray(function (err, items) {
                    var allOrders = {
                        orders: items
                    };
                    res.send(allOrders);
                });
            } else if (phno) {
                collection.find({ 'customerphoneno':{$in: phno}}).sort({ orderno: 1 }).toArray(function (err, items) {
                    var allOrders = {
                        orders: items
                    };
                    res.send(allOrders);
                });
            }
            else {

                collection.find().sort({ orderno: -1 }).toArray(function (err, items) {
                    var allOrders = {
                        orders: items
                    };
                    res.send(allOrders);
                });
            }
        }
    });
};

exports.getByOrderName = function (req, res) {
    var Name = req.param('name', 'undefined');
    logger.info('requesting order Name ' + Name);
    db.instance().collection('orders', function (err, collection) {
        if (err) {
            logger.error('no table by name orders found in db');
            res.send(500, { message: err });

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
            res.send(500, { message: err });

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
        collection.find().sort({ orderno: -1 }).limit(1).toArray(function (err, items) {
            if (items.length > 0)
                order.orderno = items[0].orderno + 1;
            else
                order.orderno = 1;

            collection.insert(order, { safe: true }, function (err, result) {
                if (err) {
                    logger.error('failed to add order' + order);
                    res.send(500, { message: err });

                }
                else {
                    logger.info('successfully added order - ' + order);
                    res.send({ order: result[0] });
                }
            });
        });
    });
};

exports.update = function (req, res) {
    var orderId = req.params.id;
    var orderInfo = req.body.order;
    logger.info('requesting update order with id ' + orderId);
    db.instance().collection('orders', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(orderId) }, orderInfo, { safe: true }, function (err, result) {
            if (err) {
                logger.error('Error updating order: ' + err);
                res.send(500, { message: err });

            } else {
                logger.log('' + result + ' document(s) updated');
                //sendmail('karthik.purushothaman@gmail.com');
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
                res.send(500, { message: err });

            } else {
                logger.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

exports.getSummary = function (req, res) {
    var keyf = function (doc) { duedate: doc.duedate };
    db.instance().collection('orders', function (err, collection) {
        collection.group(
            { duedate: true },
            { status: { $ne: 'Delivered' } },
            { "_id": 0, "newcount": 0, "inprogresscount": 0, "donecount": 0 },
            function (curr, result) {
                if (curr.status === 'New')
                    result.newcount += 1;
                if (curr.status === 'InProgress')
                    result.inprogresscount += 1;
                if (curr.status === 'Done')
                    result.donecount += 1;
            },
	    function (result) {
	    	result._id = (new Date(result.duedate)).getTime().toString();
	    },
            true,
            function (err, results) {
                results.sort(function (a, b){
                    var d1 = new Date(a.duedate).getTime();
                    var d2 = new Date(b.duedate).getTime();
                    return d1 - d2;
                });
                var ordersummary = {
                    ordersummarys: results
                };
                res.send(ordersummary);
            }
        );
    });
};

sendmail = function(mailid) {
// create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "karthik.purushothaman@gmail.com",
            pass: ""
    }
    });

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Karthik P<karthik.purushothaman@gmail.com>", // sender address
        to: "karthik.purushothaman@gmail.com", // list of receivers
        subject: "Order Status", // Subject line
        text: "Your order is ready for pickup", // plaintext body
        html: "<b>Your order is ready for pickup</b>" // html body
    }

// send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}
