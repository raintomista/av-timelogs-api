const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const Network = require('../../../../../models/network');

module.exports = function (req, res, next) {
    var data = {
        hostname: req.params.data.hostname,
        ip_address: req.params.data.ip_address,
        description: req.params.data.description,
        status: 1
    };

    Network.create(data);
    res.send(200, {
        code: vars.CODE_SUCCESS,
        message: "Network has been added to valid list",
        data: {
            hostname: data.hostname,
            ip_address: data.ip_address,
            description: data.description,
            status: data.status
        }
    });
}