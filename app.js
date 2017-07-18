const restify = require('restify');
const core = require("./services/core-service");


var api = restify.createServer();
api.use(restify.acceptParser(api.acceptable));
api.use(restify.queryParser());
api.use(restify.bodyParser());
api.use(restify.gzipResponse());

core.mongoConnect();
core.initCORS(api, restify);


api.listen(process.env.PORT || 8081, function(){
	console.log("Server started at Port " + (process.env.PORT || 8081) );
});

module.exports.api = api;

api.get("/", function(req, res){
	res.send(200, {
		msg: 'Welcome to AV Timelogs API'
	});
});


let scheduledEmail = require('./services/scheduled_email');

var adminAuthRoutes = require('./endpoints/admin/_auth/routes');
var adminNetworktRoutes = require('./endpoints/admin/_network/routes');
var adminAdminRoutes = require('./endpoints/admin/_admins/routes');
var adminUserRoutes = require('./endpoints/admin/_users/routes');
var userAuthRoutes = require('./endpoints/user/_auth/routes');
var timeLogRoutes = require('./endpoints/_timelog/routes');
var mailerRoutes = require('./endpoints/_mailer/routes');
var offsetRoutes = require('./endpoints/_offset/routes');






