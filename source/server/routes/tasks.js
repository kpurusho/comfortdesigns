var logger = require('../log/log').logger;
var db = require('../db/db').db;
var BSON = require('mongodb').BSONPure;
//var print = require('../../../../../js/jslearning/printprops.js');


//get methods
exports.getAllTasks = function(req, res){
	logger.info('requesting all tasks');
	db.instance().collection('tasks_master', function(err, collection){
		if (err){
			logger.error('no table by name tasks_master found in db');
			res.send({'error' : 'An error has occured - ' + err});
		}
		else {
			collection.find().toArray(function(err, items){
				res.jsonp(items);
			});
		}
	});
};

exports.getByTaskName = function(req, res){
	var Name = req.param('TaskName','undefined');
	logger.info('requesting task Name ' + Name);
	db.instance().collection('tasks_master', function(err, collection){
		if (err){
			logger.error('no table by name tasks_master found in db');
			res.send({'error' : 'An error has occured - ' + err});
		}
		else {
			collection.find({'TaskName':Name}).toArray(function(err, items){
				res.jsonp(items);
			});
		}
	});
};

exports.getById = function(req, res){
	var id = req.params.id;
	logger.info('requesting task id ' + id);
	db.instance().collection('tasks_master', function(err, collection){
		if (err){
			logger.error('no table by name tasks_master found in db');
			res.send({'error' : 'An error has occured - ' + err});
		}
		else {
			collection.findOne({'_id':BSON.ObjectID(id)}, function(err, item) {
				res.jsonp(item);
			});
		}
	});
};

exports.addTask = function(req, res) {
	var task = req.body;
	logger.info('requesting add task - ' + task.TaskName);
	db.instance().collection('tasks_master', function (err, collection) {
		collection.insert(task, { safe: true }, function (err, result) {
			if (err) {
				logger.error('failed to add task' + task);
				res.send({'error' : 'An error has occured - ' + err});
			}
			else {
				logger.info('successfully added task - ' + task);
				res.send(result[0]);
			}
		});
	});
};

exports.updateTask = function (req, res) {
	var taskId = req.params.id;
	var taskInfo = req.body;
	logger.info('requesting update task with id ' + taskId);
	logger.info(JSON.stringify(taskInfo));
	db.instance().collection('tasks_master', function (err, collection) {
		collection.update({ '_id': new BSON.ObjectID(taskId)}, taskInfo, {safe:true}, function(err,result){
			 if (err) {
			 	logger.error('Error updating task: ' + err);
				res.send({'error' : 'An error has occured - ' + err});
			 } else {
			 	logger.log('' + result + ' document(s) updated');
				res.send(taskInfo);
			 }
		});
	});
};

exports.deleteTask = function (req, res) {
	var taskId = req.params.id;
	logger.info('requesting delete task with id ' + taskId);
	db.instance().collection('tasks_master', function (err, collection) {
		collection.remove({ '_id': new BSON.ObjectID(taskId)}, {safe:true}, function(err,result){
			if (err) {
			 	logger.error('Error deleting task: ' + err);
				res.send({'error' : 'An error has occured - ' + err});
			} else {
			 	logger.log('' + result + ' document(s) deleted');
				 res.send(req.body);
			}
		});
	});
};

