const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const Network = require('../../../../../models/network');

module.exports = function (req, res, next) {

    var data = {
        status: 1
    };

    Network.findOneAndUpdate({
        _id: req.params._id,
    }, data, function (err, result) {
        if (!err) {
            if (result) {
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "Network moved to valid list"
                });
            } else {
                res.send(400, {
                    code: vars.CODE_NOT_FOUND,
                    msg: "Network not found"
                });
            }
        } else {
            res.send(500, {
                code: "Error",
                msg: vars.MSG_SERVER_ERROR
            });
        }
    });
}