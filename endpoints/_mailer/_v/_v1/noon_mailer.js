const mongoose = require('mongoose');
const vars = require('../../../../vars');
const User = require('../../../../models/user');
const sendgrid = require('../../../../services/sendgrid');


module.exports = function(req, res, next){
    User.find({status: 0}, {email: 1, name: 1}, function(err, results){
            console.log(err);
        
        if(!err){
            sendgrid.personalizeEmailByRecipient(results); 
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully send alerts",
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