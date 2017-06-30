const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');
const sendgrid = require('../../../../services/sendgrid');


function getHours(milliseconds){
    let time = moment.duration(milliseconds, 'milliseconds');
    let hours = (24 * time.days()) + time.hours();
    let minutes = time.minutes();
    let seconds = time.seconds();
    
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    
    return `${hours}:${minutes}:${seconds}`;
}

function getTotalWorkingHours(timelogs) {
    let total = 0;

    for (let i = 0; i < timelogs.length; i++) {
        let t = moment(timelogs[i].timeOut).diff(timelogs[i].timeIn, 'milliseconds');
        total = total + t;
    }
    return getHours(total);
}

function getDiff(start, end) {
    let total = moment(end).diff(start, 'milliseconds');
    return getHours(total);
}

module.exports = function (req, res, next) {
    const timestamp = moment().utcOffset("+08:00");

    // Check if the username exists in the user db
    User.findOne({ username: req.params.username }, function(err, user){
        if(!err){
            // Find the latest timelog of the user
            Timelog.findOne(
                { _user: user._id}, {},
                { new: false, sort: { timeIn: -1} },
                function(err, result){
                    if(!err){
                        // Update the timeOut and totalHrs of the latest timelog of the user
                        Timelog.update(
                            { _id: result._id },
                            { timeOut: timestamp, totalHrs: getDiff(result.timeIn, timestamp)},
                            function(err){
                                if(!err){
                                    // Get all timelogs of the user for the computation of total working hours
                                    Timelog
                                        .find({ _user: user._id})
                                        .populate('_user')
                                        .exec(function(err, results){
                                            if(!err){

                                                // Update the status and totalHours of the user
                                                User.update(
                                                    { username: results[0]._user.username },
                                                    { status: 0, totalHours: getTotalWorkingHours(results) },
                                                    function(err, r){
                                                        if(!err){
                                                            sendgrid.emailTimeInOutAlert(results[0]._user.name, 'timed out', timestamp.format('HH:mm:ss A'));
                                                            res.send(200, {
                                                                code: vars.CODE_SUCCESS,
                                                                msg: "Successfully timed out",
                                                            });
                                                        }
                                                        else{
                                                            res.send(500, {
                                                                code: vars.CODE_SERVER_ERROR,
                                                                msg: vars.CODE_SERVER_ERROR,
                                                                err: err
                                                            });
                                                        }
                                                    }
                                                );
                                            }
                                            else{
                                                res.send(500, {
                                                    code: vars.CODE_SERVER_ERROR,
                                                    msg: vars.CODE_SERVER_ERROR,
                                                    err: err
                                                });
                                            }
                                        }
                                    );
                                }
                                else{
                                    res.send(500, {
                                        code: vars.CODE_SERVER_ERROR,
                                        msg: vars.CODE_SERVER_ERROR,
                                        err: err
                                    });
                                }
                            } 
                        );
                    }
                    else{
                        res.send(500, {
                            code: vars.CODE_SERVER_ERROR,
                            msg: vars.CODE_SERVER_ERROR,
                            err: err
                        });
                    }
                }
            );
        }
        else{
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    });
}