const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const User = require('../../../../../models/user');

module.exports = function (req, res, next) {
    const query = {
        status: req.params.status,
        isSuspended: false
    }
    User.find(query, function (err, result) {
        if (!err) {
            if (result.length > 0) {
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "Successfully fetched",
                    data: result
                });
            } else {
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "No data fetched",
                    data: result
                });
            }
        } else {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    });
}