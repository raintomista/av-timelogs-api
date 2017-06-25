const mongoose = require('mongoose');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');


module.exports = function(req, res, next){
    User.find()
        .populate('_timelog')
        .exec(function(err, results){
            if(!err){
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "Successfully fetched",
                    data: results
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