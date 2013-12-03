var logger = require('../log/log').logger;
var db = require('../db/db').db;


//get methods
exports.getAllTasks = function(req, res){
	logger.info('requesting all tasks');
	db.instance().collection('tasks_master', function(err, collection){
		if (err){
			logger.error('no table by name tasks_master found in db');
		}
		else {
			collection.find().toArray(function(err, items){
				res.jsonp(items);
			});
		}
	});
};

exports.getByTaskName = function(req, res){
	var Name = parseInt(req.params.TaskName);
	logger.info('requesting task Name ' + Name);
	db.instance().collection('tasks_master', function(err, collection){
		if (err){
			logger.error('no table by name tasks_master found in db');
		}
		else {
			collection.find({'TaskName':Name}).toArray(function(err, items){
				res.jsonp(items);
			});
		}
	});
};

exports.addTask = function(req, res) {
	var task = req.body;
	db.instance().collection('tasks_master', function (err, collection) {
		collection.insert(task, { safe: true }, function (err, result) {
			if (err) {
				logger.error('failed to add task' + task);
			} 
		});
	});
};

exports.updateTask = function (req, res) {
	db.instance().collection('tasks_master', function (err, collection) {
		collection.update({ TaskName: req.params.TaskName });
	});
};

exports.deleteTask = function (req, res) {
	db.instance().collection('tasks_master', function (err, collection) {
		collection.remove({ TaskName: req.params.TaskName });
	});
};

