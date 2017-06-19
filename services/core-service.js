const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var API_KEY = "aPi_aVtImeL0gs2o17";

//mongoDB connect
exports.mongoConnect = function(){ 
    var mongoURI = process.env.MONGODB_URI;
    mongoURI = 'mongodb://heroku_s3d14v5p:b5hsgugp04lc5qcaco7dei0dph@ds127962.mlab.com:27962/heroku_s3d14v5p';

    mongoose.connect(mongoURI, function (err) {
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

//Tokenization
module.exports.generateAppAccessToken = function(payload, callback){
    jwt.sign(payload, API_KEY, {expiresIn : '365d'}, function(err, token){
        if(!err){
            callback(null, token);
        }
        else{
            callback(err, null);
        }
    });
};

module.exports.verifytoken = function(req,res,next){
    var token = req.headers['access-token'];
    var userdetails = {
        username: req.params.username,
        password: req.params.password}
    
    if(token){
            jwt.verify(token, API_KEY, function(err, decoded) {
                // jwt.decode(token);
            if(!err){
                 req.token_info = decoded;
                 return next();
            } else {
                res.send(500, {code: 'ServerError', message: 'Something went wrong!', error: err});
            }
        });
    } else {
        res.send(401, {code: 'Unauthorized', message: "No app token."});

    }
};

