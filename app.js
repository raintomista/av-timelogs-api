const restify = require('restify');
const core = require("./services/core-service");


var api = restify.createServer();
api.use(restify.acceptParser(api.acceptable));
api.use(restify.queryParser());
api.use(restify.bodyParser());
api.use(restify.gzipResponse());

core.mongoConnect();
core.initCORS(api, restify);

// process.env.PORT = 8080;

api.listen(process.env.PORT, function(){
	console.log("Server started at " + process.env.PORT);
});

module.exports.api = api;

api.get("/", function(req, res){
	res.send(200, {
		msg: 'Welcome to AV Timelogs API'
	});
});

var adminUserRoutes = require('./endpoints/admin/_users/routes');
