const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');
const resource = require('../../../../services/resource-service');

const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');

module.exports = function (req, res, next) {
    getUserInfo(req.params.username)
        .then(user => {
            Promise.all([getAllTimelogs(user._id), getTotal(user._id)])
                .then(response => {
                    let timelogs = response[0];
                    if (timelogs.length > 0) {
                        let totalHrs = response[1][0].totalHrs;
                        let totalLateHrs = response[1][0].totalLateHrs;
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'Successfully fetched user timelogs.',
                            data: {
                                user: resource.formatUserDurationOnly(user),
                                timelogs: resource.formatTimelogsDurationOnly(timelogs),
                                totalHrs: resource.secondsToDuration(totalHrs),
                                totalLateHrs: resource.secondsToDuration(totalLateHrs)
                            }
                        });
                    } else {
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'No user timelogs fetched.',
                            data: {
                                user: user,
                                timelogs: timelogs,
                                totalHrs: 0,
                                totalLateHrs: 0
                            }
                        });
                    }
                })
                .catch(err => {
                    res.send(500, {
                        code: vars.CODE_SERVER_ERROR,
                        message: vars.MSG_SERVER_ERROR,
                        err: err
                    });
                });
        })


    function getUserInfo(username) {
        return User.findOne({
                username: username
            })
            .then(user => {
                return user;
            })
            .catch(err => {
                throw err;
            });
    }

    function getAllTimelogs(userId) {
        return Timelog.find({
                _user: userId
            }, {}, {
                sort: {
                    timeIn: 1
                }
            })
            .then(results => {
                return results;
            })
            .catch(err => {
                throw err;
            });
    }

    function getTotal(userId) {
        return Timelog.aggregate([{
                    $match: {
                        _user: userId
                    }
                },
                {
                    $group: {
                        _id: "$_user",
                        totalHrs: {
                            $sum: "$totalHrs"
                        },
                        totalLateHrs: {
                            $sum: "$lateHrs"
                        }
                    }
                }
            ])
            .then(results => {
                return results;
            })
            .catch(err => {
                throw err;
            })
    }
}