const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');
const resource = require('../../../../services/resource-service');

const Offset = require('../../../../models/offset');
const User = require('../../../../models/user');

module.exports = function(req, res, next){
    User.find(
        {isAdmin: false}, {username: 1, name: 1, imgUrl: 1, isSuspended: 1, _offset: 1})
        .populate('_offset').exec()
        .then(results => {
            if(results.length > 0){
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    message: 'Successfully fetched offsets',
                    data: resource.formatDurationData(results)
                });
            }
            else{
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    message: 'No offsets fetched',
                    data: results
                });
            }
        })
        .catch(err => {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                message: vars.CODE_SERVER_ERROR,
                err: err
            })
        });
}


