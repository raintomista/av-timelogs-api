const moment = require('moment');
const vars = require('../../../../vars');
const mongoose = require('mongoose');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');


const office_start = moment().startOf('day').add(9, 'hours').toDate();
const late = moment().startOf('day').add(10, 'hours').add(1, 'minutes').toDate();



module.exports = function (req, res, next) {
    const time_in = moment().toDate();
    const late_hours = moment(time_in).isBetween(office_start, late) ? null : moment.utc(moment(time_in).diff(late)).format("HH:mm:ss");


    User.findOne({username: req.params.username}, function(err, user){
        if(!err){
            let newObject = {
                _user: user._id,
                timeIn: time_in,
                timeOut: null,
                lateHrs: late_hours,
                totalHrs: null
            }

            let newTimelog = new Timelog(newObject);

            newTimelog.save(function (err, timelog) {
                if (!err) {
                    let query = { username: req.params.username }
                    let update = { status: 1 }
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
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    });
}