const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');


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
    return moment.utc(moment(end).diff(start)).format("HH:mm:ss");
}

module.exports = function (req, res, next) {
    const timestamp = moment().toDate();
    Timelog.findOne(
        { username: req.params.username, timeOut: null}, {},
        { new: false, sort: { timeIn: -1} },
        function(err, result){
            if(!err){
                Timelog.update(
                    { _id: result._id },
                    { timeOut: timestamp, totalHrs: getDiff(result.timeIn, timestamp)},
                    function(err){
                        if(!err){
                            Timelog.find(
                                {username: req.params.username},
                                function(err, results){
                                    if(!err){
                                        User.update(
                                            { username: results[0].username },
                                            { status: 0, totalHours: getTotalWorkingHours(results) },
                                            function(err, r){
                                                if(!err){
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