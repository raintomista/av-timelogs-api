const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');
const resource = require('../../../../services/resource-service');

const Offset = require('../../../../models/offset');        

module.exports = function(req, res, next){
    Offset.findOneAndUpdate({ _id: req.params._id }, { isValid: false })
        .then(() => {
            res.send(200, {
                code: vars.CODE_SUCCESS,
                message: 'Successfully set offset to invalid.'
            });
        })
        .catch(err => {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                message: vars.MSG_SERVER_ERROR,
                err: err
            });
        });
}