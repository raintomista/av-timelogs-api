const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const User = require('../../../../../models/user');
const cloudinary = require('../../../../../services/cloudinary');

var bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function(req,res,next){
    cloudinary.upload(req.params.data.imgUrl, function(err, imgURL){
     var data = {
                username: req.params.data.username,
                password: bcrypt.hashSync(req.params.data.password,salt),
                name: req.params.data.name,
                email: req.params.data.email,
                contactNumber: req.params.data.contactNumber,
                totalHours: req.params.data.totalHours,
                status: req.params.data.status,
                imgUrl: imgURL
            };
    
        //Username and Email Availability
    User.find({$or: [{username: req.params.data.username},{email: req.params.data.email}]}).exec(function(err,results){
        if(!err){
            if(results.length > 0){
                res.send(400,{code: vars.CODE_BAD_REQUEST , message:"Username/Email already exists"});
            } else {
                User.create(data);
                res.send(200,{code: vars.CODE_SUCCESS, message:"User has been created",
                    data:{
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        contactNumber: Number(data.contactNumber),
                        totalHours: Number(data.totalHours),
                        status: Number(data.status),
                        imgUrl: data.imgUrl
                    }
                });
            }
        } else {
            res.send(500,{code: "Error", message: vars.MSG_SERVER_ERROR});
        }  
     })
  })
};