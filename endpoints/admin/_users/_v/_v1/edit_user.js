const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const User = require('../../../../../models/user');
const cloudinary = require('../../../../../services/cloudinary');

var bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function(req,res,next){
    User.findOne({username: req.params.data.username}, function(err, user){
        if(!err){
            let newData = {};
            newData.name = req.params.data.name;
            newData.email = req.params.data.email;
            newData.contactNumber = req.params.data.contactNumber;
            if(req.params.data.newUsername !== null){
                console.log("new username");
                newData.username = req.params.data.newUsername;
            }
            if(req.params.data.password !== null){
                console.log("new pass");
                newData.password = bcrypt.hashSync(req.params.data.password, salt);
            }
            if(req.params.data.imgUrl !== null){
                console.log("new image");
                
                cloudinary.upload(req.params.data.imgUrl, function(response){
                    newData.imgUrl = response.secure_url;             
                    User.update({username: req.params.data.username}, newData, function(err, response){
                        if(!err){
                            res.send(200, {
                                code: vars.CODE_SUCCESS, 
                                message: `Your account has been updated!`,
                            });
                        }
                        else{
                            res.send(500, {
                                code: vars.CODE_SERVER_ERROR, 
                                message: vars.CODE_SERVER_ERROR,
                                err: err
                            });
                        }
                    });
                });
            }
            else{
                console.log("no new image");
                       
                User.update({username: req.params.data.username}, newData, function(err, response){
                    if(!err){
                        res.send(200, {
                            code: vars.CODE_SUCCESS, 
                            message: `Your account has been updated!`,
                        });
                    }
                    else{
                        res.send(500, {
                            code: vars.CODE_SERVER_ERROR, 
                            message: vars.CODE_SERVER_ERROR,
                            err: err
                        });
                    }
                });
            }
        }
        else{
            res.send(500, {
                code: vars.CODE_SERVER_ERROR, 
                message: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    });
};



    
    //                     console.log(result);
    //  var data = {
    //             username: req.params.data.username,
    //             password: bcrypt.hashSync(req.params.data.password,salt),
    //             name: req.params.data.name,
    //             email: req.params.data.email,
    //             contactNumber: req.params.data.contactNumber,
    //             totalHours: null,
    //             status: 0,
    //             imgUrl: result.secure_url,
    //             _timelog: null
    // };
//   });