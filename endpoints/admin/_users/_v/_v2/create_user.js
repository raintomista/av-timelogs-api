const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const cloudinary = require('../../../../../services/cloudinary');
const vars = require('../../../../../vars');

const User = require('../../../../../models/user');

const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function (req, res, next) {
    findUser(req.params.data)
        .then(results => {
            if (results.length > 0) {
                res.send(400, {
                    code: vars.CODE_BAD_REQUEST,
                    message: 'Username/Email already exists'
                });
            } else {
                createUser(req.params.data);
            }
        })
        .catch(err => {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                message: vars.CODE_SERVER_ERROR,
                err: err
            });
        });


    /* Function Declaration */
    function uploadPicture(url) {
        return new Promise((resolve, reject) => {
            cloudinary.upload(url, function (result) {
                resolve(result);
            });
        });
    }

    //Find if Username and Email exists in the Database
    function findUser(user) {
        return User.find({
                $or: [{
                    username: user.username
                }, {
                    email: user.email
                }]
            })
            .exec()
            .then(results => {
                return results;
            })
            .catch(err => {
                throw err;
            });
    }

    function createUser(user) {

        // Uploads Picture First
        uploadPicture(user.imgUrl)
            .then(result => {
                let s = result.secure_url;
                let newUser = new User({
                    username: user.username,
                    password: bcrypt.hashSync(user.password, salt),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    contactNumber: user.contactNumber,
                    imgUrl: `${s.substring(0, 52)}w_400,h_400,c_fill,g_auto/${s.substring(52, s.length)}`,
                    isAdmin: user.isAdmin
                });

                // Stores new User to Database
                User.create(newUser)
                    .then(result => {
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'Successfully created user.',
                            data: result
                        });
                    })
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                throw err;
            });
    }
}