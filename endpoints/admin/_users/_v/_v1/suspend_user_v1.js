const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const User = require('../../../../../models/user');

module.exports = function (req, res, next) {
    User.findOneAndUpdate({
        username: req.params.username
    }, {
        isSuspended: true,
        status: 0
    }, function (err) {
        if (!err) {
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully suspended user account",
            });
        } else {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR
            });
        }
    });
}