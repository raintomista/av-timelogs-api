const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const vars = require('../../../../../vars');
const core = require('../../../../../services/core-service');

const Admin = require('../../../../../models/admin');

const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function (req, res, next) {
    var username = req.params.data.username;
    var password = req.params.data.password;

    Admin.findOne({
        username: username
    }, function (err, admin) {
        if (admin) {
            if (bcrypt.compareSync(password, admin.get('password'))) {

                core.generateAppAccessToken(admin, function (err, token) {
                    res.send(200, {
                        code: vars.CODE_SUCCESS,
                        message: "Welcome Admin " + admin.first_name + "!",
                        data: {
                            username: admin.username,
                            name: admin.name,
                            email: admin.email,
                            contactNumber: admin.contactNumber,
                            imgUrl: admin.imgUrl,
                            token: token
                        }
                    });
                });
            } else {
                res.send(401, {
                    code: "Failed",
                    message: "Log in failed: Password incorrect"
                });
            }
        } else {
            res.send(401, {
                code: "Failed",
                message: "Log in failed: Username does not exist"
            });
        }
    })
};