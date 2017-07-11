const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const User = require('../../../../../models/user');
const core = require('../../../../../services/core-service');

var bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function(req,res,next){
    var username = req.params.data.username;
    var password = req.params.data.password;

    User.findOne({username: username}, function(err, user){
        if(user){
            if(bcrypt.compareSync(password, user.get('password'))){
                core.generateAppAccessToken(user, function(err,token){
                    console.log(err);
                    if(!err){
                        res.send(200,{code: vars.CODE_SUCCESS, 
                            message: "Welcome " + user.first_name + "!",
                            data: {
                                username: user.username,
                                name: user.name,
                                email: user.email,
                                contactNumber: user.contactNumber,
                                totalHours: user.totalHours,
                                status: user.status,
                                imgUrl: user.imgUrl,
                                token: token,
                                isAdmin: user.isAdmin
                                }
                        }); 
                    }
                    else{
                        res.send(401,{code: "Failed", message: "Failed to generate access code"});
                    }
                });           
            } else {
                res.send(401,{code: "Failed", message: "Log in failed: Password incorrect"});
            }
        } else {
            res.send(401, {code: "Failed", message: "Log in failed: Username does not exist"});
        }
    })
};