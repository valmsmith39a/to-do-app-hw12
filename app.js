'use strict';

var PORT = 4000;

// dependencies and libraries
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

// general middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// get index.html file for local server port 4000
app.get('/', function(req, res){
	fs.readFile('./index.html', function(err, data){
		var html = fs.readFileSync('./index.html').toString();
		res.send(html);
	});
});

// gets tasks from local directory
// curl localhost:4000/tasks
app.get('/tasks', function(req, res){
	fs.readFile('./tasks.json', function(err, data){
		// Parse JSON String into an object
		if(data == ''){
    	data = '[]';
    }
		var arrayObj = JSON.parse(data);
		var tasksArrayString = JSON.stringify(arrayObj);
		res.send(arrayObj);
	});
});

// post task to server
app.post('/tasks/add', function(req, res) {
  fs.readFile('./tasks.json', function(err, data) {
    if(err) return res.status(400).send(err);
    if(data == ''){
    	data = '[]';
    }
    var arr = JSON.parse(data);
    var date = req.body.date;
    var task = req.body.task;
    var status = req.body.status;
    var index = req.body.index;
    var newTaskObject = {
    	date:date,
    	task:task,
    	status:status,
    	index:index
    }
    arr.push(newTaskObject);
    fs.writeFile('./tasks.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send(arr);
    });
  });
});

// delete task from server 
app.post('/tasks/delete', function(req, res) {
  fs.readFile('./tasks.json', function(err, data) {
    if(err) return res.status(400).send(err);
    if(data == ''){
    	data = '[]';
    }
    var arr = JSON.parse(data);
    var index = req.body.indexToRemove;
    arr.splice(index, 1);

    fs.writeFile('./tasks.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send(arr);
    });
  });
});

// handle completed checkbox
app.post('/tasks/checkbox', function(req, res) {
  fs.readFile('./tasks.json', function(err, data) {
    if(err) return res.status(400).send(err);
    if(data == ''){
    	data = '[]';
    }
    var arr = JSON.parse(data);
    var index = req.body.indexChecked;
    var status = req.body.status;
    arr[index].status = status;

    fs.writeFile('./tasks.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send(arr);
    });
  });
});

// spin up server
app.listen(PORT, function() {
  console.log('Express server listening on port', PORT)
});