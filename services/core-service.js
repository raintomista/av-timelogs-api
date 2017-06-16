const mongoose = require('mongoose');

//mongoDB connect
exports.mongoConnect = function(){ 
    // process.env.MONGODB_URI = 'mongodb://localhost/appventure';
    mongoose.connect(process.env.MONGODB_URI, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('MongoDB successfully connected to: ', process.env.MONGODB_URI);
        }
    });
}

//initialize CORS config
exports.initCORS = function(api, restify){
    api.use(
        function crossOrigin(req,res,next){
            res.header("Access-Control-Allow-Origin", "*");
            return next();
        }
    );

    api.on('MethodNotAllowed', _unknownMethodHandler.bind(this, restify));
}

function _unknownMethodHandler(restify, req, res) {
  if (req.method.toLowerCase() === 'options') {
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'x-access-token'];

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError("Invalid Method"));
}

