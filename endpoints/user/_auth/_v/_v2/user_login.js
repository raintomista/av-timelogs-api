const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const core = require('../../../../../services/core-service');
const vars = require('../../../../../vars');

const User = require('../../../../../models/user');

const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function(req,res,next){
    let username = req.params.data.username;
    let password = req.params.data.password;

    User.findOne({username: username})
        .then(user => {
            if(user){
                authenticateUser(user);
            }
            else{
                res.send(401, {
                    code: vars.CODE_AUTH_ERROR,
                    message: 'Log in failed: Username does not exist.'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                message: vars.CODE_SERVER_ERROR,
                err: err
            });
        })

    function authenticateUser(user){
        if(!bcrypt.compareSync(password, user.password)){
            res.send(401, {
                code: vars.CODE_AUTH_ERROR,
                message: 'Log in failed: Password incorrect'
            });
        }
        else{
            generateToken(user);
        }
    }

    function generateToken(user){
        core.generateAppAccessToken({user: JSON.stringify(user)}, 
            function(err,token){
                let data = {
                    token: token,
                    user: {
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        contactNumber: user.contactNumber,
                        imgUrl: user.imgUrl,
                        totalHours: user.totalHours,
                        totalOffset: user.totalOffset,
                        isAdmin: user.isAdmin,
                        isSuspended: user.isSuspended,
                        status: user.status
                    }
                }

                if(!err){
                    res.send(200, {
                        code: vars.CODE_SUCCESS,
                        message: 'Successfully logged in',
                        data: data
                    });
                }
                else{
                    res.send(401, {
                        code: vars.CODE_AUTH_ERROR,
                        message: 'Failed to generate access token.'
                    })
                }
            });
    }
};