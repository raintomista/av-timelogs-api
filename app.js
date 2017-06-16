var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());

mongoose.connect('mongodb://heroku_s3d14v5p:b5hsgugp04lc5qcaco7dei0dph@ds127962.mlab.com:27962/heroku_s3d14v5p');
var db = mongoose.connection;


var User = require('./models/user');

app.post('/api/users', function(req, res){
	var user = req.body;
	User.createUser(user, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});	

app.get('/api/users', function(req, res){
	User.retrieveUsers(function(err, users){
		if(err){
			throw err;
		}
		res.json(users);
	});
});

app.get('/api/users/:_id', function(req, res){
	User.retrieveUserById(req.params._id, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

app.put('/api/users/:_id', function(req, res){
	var id = req.params._id;
	var user = req.body;
	User.updateUser(id, user, {}, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

app.delete('/api/users/:_id', function(req, res){
	var id = req.params._id;
	var user = req.body;
	User.deleteUser(id, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});



app.listen(process.env.PORT || 5000, function(){
	console.log('Running on port 3000');
});
