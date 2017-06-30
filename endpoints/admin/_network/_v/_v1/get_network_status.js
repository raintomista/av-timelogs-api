const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const Network = require('../../../../../models/network');

module.exports = function(req, res, next){
    Network.findOne({ip_address: req.params.ip}, function(err, result){
        if(!err){
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully fetched network",
                data: result
            });
        } else {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    });
}