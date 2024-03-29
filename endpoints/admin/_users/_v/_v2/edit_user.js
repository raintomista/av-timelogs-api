const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const User = require('../../../../../models/user');
const cloudinary = require('../../../../../services/cloudinary');

var bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function (req, res, next) {
    User.findOne({
        username: req.params.data.username
    }, function (err, user) {
        if (!err) {
            cloudinary.upload(req.params.data.imgUrl, function (response) {
                if (response.secure_url) {
                    let s = response.secure_url;
                    user.imgUrl = `${s.substring(0, 50)}w_400,h_400,c_fill,g_auto/${s.substring(50, s.length)}`;
                }
                if (req.params.data.newUsername) {
                    user.username = req.params.data.newUsername;
                }
                if (req.params.data.password) {
                    user.password = bcrypt.hashSync(req.params.data.password, salt);
                }

                user.firstName = req.params.data.firstName;
                user.lastName = req.params.data.lastName;
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