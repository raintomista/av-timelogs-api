const mongoose = require('mongoose');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');

module.exports = function(req, res, next){
    Timelog.find()
        .populate('_user')
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