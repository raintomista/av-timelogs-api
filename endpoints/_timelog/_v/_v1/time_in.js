const moment = require('moment');
const vars = require('../../../../vars');
const mongoose = require('mongoose');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');


const office_start = moment().startOf('day').add(9, 'hours');
const late = moment().startOf('day').add(10, 'hours').add(1, 'minutes');


module.exports = function (req, res, next) {
    const time_in = moment().utcOffset('+08:00');
    const late_hours = moment(time_in).isBetween(office_start, late) ? null : moment.utc(moment(time_in).diff(late)).format("HH:mm:ss").toString();
    
    console.log(office_start);
    console.log(late);
    console.log(time_in);
    console.log(late_hours);
    User.findOne({username: req.params.username}, function(err, user){
        console.log(user);
        if(!err){
            let newObject = {
                _user: user._id,
                timeIn: time_in,
                timeOut: null,
                lateHrs: late_hours,
                totalHrs: null
            }

            let newTimelog = new Timelog(newObject);

            if(user.status !== 1){
                newTimelog.save(function (err, timelog) {
                    if (!err) {
                        let query = { username: req.params.username }
                        let update = { status: 1, _timelog: timelog._id }
                        User.update(query, update, function (err) {
                            if (!err) {
                                res.send(200, {
                                    code: vars.CODE_SUCCESS,
                                    msg: vars.CODE_SUCCESS
                                });
                            } else {
                                res.send(500, {
                                    code: vars.CODE_SERVER_ERROR,
                                    msg: vars.CODE_SERVER_ERROR
                                });
                            }
                        });

                    } else {
                        res.send(500, {
                            code: vars.CODE_SERVER_ERROR,
                            msg: vars.CODE_SERVER_ERROR,
                            err: err
                        });
                    }
                });
            }
            else{
                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: `${user.name} + has already timed in`
                });
            }
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