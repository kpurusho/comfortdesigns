var logger = require('../log/log').logger;
var db = require('../db/db').db;

/*
var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;
var db;

//setting up database
var mongo = new MongoClient(new MongoServer('localhost', 27017));
mongo.open(function(err,mongo){
	if(err){
		logger.error('unable to open mongo client instance');
	}
	else {
		logger.info('sleeping for 10 sec..');
		db = mongo.db("ComfortDesignDB");
		db.collection('designs', {strict:true}, function(err, collection){
			if (err){
				logger.info('setting up ComfortDesignDB for first time use');
				populateDB();
			}
		});
	}
});
*/

//get methods
exports.getAll = function(req, res){
	logger.info('requesting all designs');
	db.instance().collection('designs', function(err, collection){
		if (err){
			logger.error('no table by name designs found in db');
		}
		else {
			collection.find().toArray(function(err, items){
				res.jsonp(items);
			});
		}
	});
};

exports.getById = function(req, res){
	var id = parseInt(req.params.id);
	logger.info('requesting design id ' + id);
	db.instance().collection('designs', function(err, collection){
		if (err){
			logger.error('no table by name designs found in db');
		}
		else {
			collection.find({'id':id}).toArray(function(err, items){
				res.jsonp(items);
			});
		}
	});
};


var populateDB = function(){
	var items = [
	{ id:1, Name:"Neck1", Category:"Chudidhar", Pic:"Neck1.png" },
	{ id:2, Name:"Neck2", Category:"Chudidhar", Pic:"Neck2.png" },
	{ id:3, Name:"Neck3", Category:"Chudidhar", Pic:"Neck3.png" },
	{ id:4, Name:"Neck4", Category:"Chudidhar", Pic:"Neck4.png" },
	{ id:5, Name:"Neck5", Category:"Chudidhar", Pic:"Neck5.png" }];

	db.collection('designs', function(err, collection){
		collection.insert(items, {safe:true}, function(err,result){});
	});

};
