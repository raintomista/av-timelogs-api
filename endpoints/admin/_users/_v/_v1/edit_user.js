const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const vars = require('../../../../../vars');
const cloudinary = require('../../../../../services/cloudinary');

const User = require('../../../../../models/user');

const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function (req, res, next) {
    User.findOne({
        username: req.params.data.username
    }, function (err, user) {
        if (!err) {
            cloudinary.upload(req.params.data.imgUrl, function (response) {
                if (response.secure_url) {
                    user.imgUrl = response.secure_url;
                }
                if (req.params.data.newUsername) {
                    user.username = req.params.data.newUsername;
                }
                if (req.params.data.password) {
                    user.password = bcrypt.hashSync(req.params.data.password, salt);
                }

                user.name = req.params.data.name;
                user.email = req.params.data.email;
                user.contactNumber = req.params.data.contactNumber;

                user.save(function (err, result) {
                    if (!err) {
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'Successfully updated account.',
                            data: result
                        });
                    } else {
                        res.send(500, {
                            code: vars.CODE_SERVER_ERROR,
                            message: vars.CODE_SERVER_ERROR,
                            err: err
                        });
                    }
                });

            });
        } else {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                message: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    });
}