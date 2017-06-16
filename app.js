var restify = require('restify');
var mongoose = require('mongoose');

mongoose.connect('mongodb://heroku_s3d14v5p:b5hsgugp04lc5qcaco7dei0dph@ds127962.mlab.com:27962/heroku_s3d14v5p');
var db = mongoose.connection;

var server = restify.createServer();
var User = require('./models/user');

server.get('/api/users', function(req, res, next){
	User.retrieveUsers(function(err, user){
		if(err){
			return next(err);
		}
		res.send(user);
		return next();
	});
});

server.listen(process.env.PORT || 8080);