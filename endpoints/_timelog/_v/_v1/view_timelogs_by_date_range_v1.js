const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');

const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');

module.exports = function(req, res, next){
    const start_of_day = moment(req.params.startDate, 'MMDDYYYY').startOf('day').toDate();
    const end_of_day = moment(req.params.endDate, 'MMDDYYYY').add(1, 'days').toDate();

    User.findOne({username: req.params.username}, function(err, user){
        if(!err){
            Timelog.find({ _user: user._id, timeIn: {$gte : new Date(start_of_day), $lt: new Date(end_of_day)} }, {}, {sort: { timeIn: 1}}, 
            function(err, result){
                if(!err){
                    res.send(200, {
                        code: vars.CODE_SUCCESS,
                        msg: "Successfully fetched",
                        data: result,
                        user: user
                    });
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
        else{
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully fetched",
                data: result
            });
        }
    });
    
}