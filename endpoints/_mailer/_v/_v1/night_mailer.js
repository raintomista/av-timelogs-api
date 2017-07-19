const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');
const sendgrid = require('../../../../services/sendgrid');

const User = require('../../../../models/user');

module.exports = function (req, res, next) {
    const start = moment().startOf('day').add(9, 'hours');
    const end = moment().startOf('day').add(19, 'hours');

    User.find()
        .populate('_timelog')
        .exec(function (err, results) {
            if (!err) {
                let absentUsers = [];
                results.forEach(function (result) {
                    if (result._timelog === null) {
                        absentUsers.push(result);
                    } else if (moment(result._timelog.timeIn).isBefore(start) || moment(result._timelog.timeIn).isAfter(end)) {
                        absentUsers.push(result);
                    }
                });

                sendgrid.emailWithList(absentUsers);

                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "Successfully send alerts",
                });
            } else {
                res.send(500, {
                    code: vars.CODE_SERVER_ERROR,
                    msg: vars.CODE_SERVER_ERROR,
                    err: err
                })
            }
        });
}