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
                		/*_db.collection('designs', {strict:true}, function(err, collection){
                        		if (err){
                                		logger.info('setting up ComfortDesignDB for first time use');
                                		this.populateDB();
                        		}
                		});*/
        		}
		});	
	}

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
