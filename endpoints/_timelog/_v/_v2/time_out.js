const moment = require('moment');

const sendgrid = require('../../../../services/sendgrid');
const vars = require('../../../../vars');

const User = require('../../../../models/user');
const Timelog = require('../../../../models/timelog');
const Offset = require('../../../../models/offset');

module.exports = function (req, res, next) {
    const timestamp = moment().utc();
    const maxHours = 32400; //9 Hours

    //Main 
    findUserAndLatestTimelog(req.params.data.username)
        .then(user => {

            // Check Total Hours for the Day
            getTodaysHours(user._id)
                .then(response => {

                    // Check if the total hours for the day is less than max hours
                    if (response[0] && response[0].total < maxHours) {
                        timeout(user);
                    } else if (response[0] && response[0].total >= maxHours) {
                        timeoutOffset(user);
                    }
                })
                .catch(err => {
                    throw err;
                });
        })
        .catch(err => {
            throw err;
        });

    /*      Function Declaration       */
    //CASE 1-2: Time Out a Regular Session before or beyond working hours
    function timeout(user) {
        let timelog = user._timelog;
        //Checks if time out is valid
        if (timelog && timelog.timeOut === null) { //Timeout from Regular Time In
            let timeDiff = moment(timestamp).diff(timelog.timeIn, 'seconds');

            // timeDiff = 45211;
            //CASE 2: Timelog Difference is beyond Max Hours (More than 9 hrs per day)
            if (timeDiff >= maxHours) {

                //Compute Offset Hours and Total Hours for the Day
                let totalOffset = timeDiff - maxHours;
                timelog.timeOut = moment(timelog.timeIn).utc().add(9, 'hours'); //Determine the exact time out for standard time out
                timelog.totalHrs = maxHours;

                //Create Offset Timelog 
                let offset = new Offset();
                offset._user = user._id;
                offset.timeIn = timelog.timeOut; //Offset starts after the standard time out
                offset.timeOut = timestamp;
                offset.totalHrs = totalOffset;

                saveTimelog(offset)
                    .then(response => {
                        //Update User Info Before Storing it to DB
                        user.totalHours += maxHours;
                        // user.totalOffset += totalOffset;
                        user._offset = response._id;
                        user.status = 0;

                        Promise.all([saveTimelog(timelog), updateUser(user)])
                            .then(response => {
                                console.log(totalOffset);
                                console.log(maxHours);
                                sendAlerts(user, timestamp.utcOffset("+08:00").format('hh:mm:ss A'), 'timed out beyond working hours');
                                res.send(200, {
                                    code: vars.CODE_SUCCESS,
                                    message: 'Successfully timed out beyond working hours.',
                                    data: {
                                        totalHours: maxHours,
                                        totalOffset: totalOffset
                                    }
                                });
                            })
                            .catch(err => {
                                res.send(500, {
                                    code: vars.CODE_SERVER_ERROR,
                                    message: vars.MSG_SERVER_ERROR,
                                    err: err
                                })
                            });
                    })
                    .catch(err => {
                        throw err;
                    });
            }

            // CASE 3: Time Out Before Max Hours
            else {
                //Update Timelog Storing it to DB
                timelog.timeOut = timestamp;
                timelog.totalHrs = timeDiff;

                //Update User Info Before Storing it to DB
                user.totalHours += timeDiff;
                user.status = 0;
                user._offset = null;

                //Store changes to database
                Promise.all([saveTimelog(timelog), updateUser(user)])
                    .then(response => {
                        sendAlerts(user, timestamp.utcOffset("+08:00").format('hh:mm:ss A'), 'timed out');
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'Successfully timed out.',
                            data: {
                                totalHours: timeDiff,
                                totalOffset: 0
                            }
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
        } else {
            res.send(400, {
                code: vars.CODE_BAD_REQUEST,
                message: 'Failed to time out. User must time in first.'
            });
        }
    }

    //CASE 3: Time Out an Offset Session
    function timeoutOffset(user) {
        let offset = user._offset;
        if (offset && offset.timeOut === null) {
            let offsetTimeDiff = moment(timestamp).diff(offset.timeIn, 'seconds');

            //Update User Info Before Storing it to DB
            // user.totalOffset += offsetTimeDiff;   
            user.status = 0;

            //Update Timelog Storing it to DB
            offset.timeOut = timestamp;
            offset.totalHrs = offsetTimeDiff;

            Promise.all([saveTimelog(offset), updateUser(user)])
                .then(response => {
                    sendAlerts(user, timestamp.utcOffset("+08:00").format('hh:mm:ss A'), 'timed out within Offset Hours');
                    res.send(200, {
                        code: vars.CODE_SUCCESS,
                        message: 'Successfully Timed Out within Offset Hours.',
                        data: {
                            totalOffset: offsetTimeDiff,
                            totalHours: 0
                        }
                    });
                })
                .catch(err => {
                    res.send(500, {
                        code: vars.CODE_SERVER_ERROR,
                        message: vars.MSG_SERVER_ERROR,
                        err: err
                    });
                });

        } else {
            res.send(400, {
                code: vars.CODE_BAD_REQUEST,
                message: 'Failed to Time Out within Offset Hours. User must Time In within Offset Hours First.'
            });
        }
    }

    function saveTimelog(timelog) {
        return timelog.save()
            .then(timelog => {
                return timelog;
            })
            .catch(err => {
                throw err;
            });
    }

    function updateUser(user) {
        return user.save()
            .then(user => {
                return 'Succesfully update user';
            })
            .catch(err => {
                throw err;
            });
    }

    function findUserAndLatestTimelog(username) {
        return User.findOne({
                username: username
            })
            .populate('_timelog')
            .populate('_offset').exec()
            .then(results => {
                return results;
            })
            .catch(err => {
                throw err;
            });
    }


    function getTodaysHours(userId) {
        const start_of_day = moment().utc().startOf('day').toDate();
        const end_of_day = moment(start_of_day).utc().add(1, 'day').toDate();

        return Timelog.aggregate([{
                    $match: {
                        _user: userId,
                        timeIn: {
                            $gte: new Date(start_of_day),
                            $lt: new Date(end_of_day)
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_user",
                        total: {
                            $sum: "$totalHrs"
                        }
                    }
                }
            ])
            .then(timelogs => {
                return timelogs;
            })
            .catch(err => {
                throw err;
            })
    }

    function sendAlerts(user, time, verb) {
        User.find({
                isAdmin: true
            }, {
                email: 1,
                firstName: 1,
                lastName: 1
            })
            .then(recipients => {
                sendgrid.emailTimeInOutAlert(`${user.firstName} ${user.lastName}`, verb, time, recipients);
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

}