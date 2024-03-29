const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const vars = require('../../../../../vars');
const cloudinary = require('../../../../../services/cloudinary');

const User = require('../../../../../models/user');

const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function (req, res, next) {
    cloudinary.upload(req.params.data.imgUrl, function (result) {

        var data = {
            username: req.params.data.username,
            password: bcrypt.hashSync(req.params.data.password, salt),
            name: req.params.data.name,
            email: req.params.data.email,
            contactNumber: req.params.data.contactNumber,
            totalHours: null,
            status: 0,
            imgUrl: result.secure_url,
            _timelog: null,
            isSuspended: false,
        };


        //Username and Email Availability
        User.find({
            $or: [{
                username: req.params.data.username
            }, {
                email: req.params.data.email
            }]
        }).exec(function (err, results) {

            if (!err) {
                if (results.length > 0) {
                    res.send(400, {
                        code: vars.CODE_BAD_REQUEST,
                        message: "Username/Email already exists"
                    });
                } else {
                    User.create(data, function (test) {
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: "User has been created",
                            data: data
                        });
                    });
                }
            } else {
                res.send(500, {
                    code: "Error",
                    message: vars.MSG_SERVER_ERROR
                });
            }
        })
    })
};