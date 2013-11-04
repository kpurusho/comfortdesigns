var logger = require('../log/log').logger;
var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;


var DATABASE = function(servername, port){
	var that = {};
	var _db = {};	//private variable
	
	//private member function
	function setupInstance(){
		var mongo = new MongoClient(new MongoServer(servername,port));
		mongo.open(function(err,mongo){
        		if(err){
                		logger.error('unable to open mongo client instance');
        		}
        		else {
                		_db = mongo.db("ComfortDesignDB");
                		_db.collection('designs', {strict:true}, function(err, collection){
                        		if (err){
                                		logger.info('setting up ComfortDesignDB for first time use');
                                		this.populateDB();
                        		}
                		});
        		}
		});	
	}

	function populateDB(){
		var items = [
			{ id:1, Name:"Neck1", Category:"Chudidhar", Pic:"Neck1.png" },
			{ id:2, Name:"Neck2", Category:"Chudidhar", Pic:"Neck2.png" },
			{ id:3, Name:"Neck3", Category:"Chudidhar", Pic:"Neck3.png" },
			{ id:4, Name:"Neck4", Category:"Chudidhar", Pic:"Neck4.png" },
			{ id:5, Name:"Neck5", Category:"Chudidhar", Pic:"Neck5.png" },
			{ id:6, Name:"Blouse1", Category:"Blouse", Pic:"Blouse1.png" }];

		_db.collection('designs', function(err, collection){
		collection.insert(items, {safe:true}, function(err,result){});
		});

	};

	//public member function
	that.instance = function(){
		return _db;
	}

	//call private member function
	setupInstance();

	//retun that instance to expose public members
	return that;

}('localhost',27017);



exports.db = DATABASE;
