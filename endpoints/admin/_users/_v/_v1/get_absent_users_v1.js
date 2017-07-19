const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const Timelog = require('../../../../../models/timelog');
const User = require('../../../../../models/user');
const moment = require('moment');

module.exports = function(req, res, next){
    const start = moment().startOf('day').add(9, 'hours').utcOffset('08:00');
    const end = moment().startOf('day').add(17, 'hours').utcOffset('08:00');


    User.find()
        .populate('_timelog')
        .exec(function(err, results){
            if(!err){
                let absentUsers = [];
                results.forEach(function(result){
                    if(result._timelog === null){
                        absentUsers.push(result);
                    }
                    else if(moment(result._timelog.timeIn).isBefore(start) || moment(result._timelog.timeIn).isAfter(end)){
                        absentUsers.push(result);
                    }
                });

                res.send(200, {
                    code: vars.CODE_SUCCESS,
                    msg: "Successfully fetched absent users",
                    data: absentUsers
                })
            }
            else{
                res.send(500, {
                    code: vars.CODE_SERVER_ERROR,
                    msg: vars.CODE_SERVER_ERROR,
                    err: err
                })
            }
        });
}