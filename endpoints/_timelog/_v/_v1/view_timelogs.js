const mongoose = require('mongoose');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');

module.exports = function(req, res, next){
    Timelog.find({}, function(err, result){
        if(!err){
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully fetched",
                data: result
            });
        }
        else{
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR,
                err: err
            })
        }
    });
}