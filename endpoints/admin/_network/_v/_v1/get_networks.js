const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const Network = require('../../../../../models/network');

module.exports = function(req, res, next){
    Network.find({}, function(err, result){
        if(!err){
            if(result.length > 0){
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "Successfully fetched",
                    data: result
                });
            } else {
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "No data feteched"
                });
            }
        } else {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    });
}