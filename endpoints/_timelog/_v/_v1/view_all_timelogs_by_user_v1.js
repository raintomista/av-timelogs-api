const mongoose = require('mongoose');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');

module.exports = function(req, res, next){
    
    //Search Username 
    User.findOne({username: req.params.username}, function(err, user){
        if(!err){
            Timelog.findOne({_user: user._id})
            .populate('_user') 
            .exec(function(err, result){
                if(!err){
                    res.send(200,{
                        code: vars.CODE_SUCCESS,
                        msg: "Fetched data",
                        data: result
                    });
                } else {
                     res.send(500,{
                        code: vars.CODE_AUTH_ERROR,
                        msg: vars.MSG_AUTH_ERROR,
                        err: err
                    });
                }
            })
        } else {
            res.send(500,{
                code: vars.CODE_AUTH_ERROR,
                msg: vars.MSG_AUTH_ERROR,
                err: err
            });
        }
    })
}