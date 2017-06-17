const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');
module.exports = function(req, res, next){
    let query = { username: req.params.username };
    const update = { timeOut: moment().utc() };
    const options = { new: false, sort: {'timeIn': -1}};
    
    Timelog.findOneAndUpdate(query, update, options, function(err){
        if(!err){
            Timelog.find(query, function(err, result){
                if(!err){
                    let total = 0;
                    result.forEach(function(e){
                        const start = e.timeIn;
                        const end = moment(e.timeOut);

                        if(total === 0) total = moment.duration(end.diff(start)).asHours();
                        else total = total + moment.duration(end.diff(start)).asHours();
                    });

                    query = { username: req.params.username, timedIn: true };
                    User.findOneAndUpdate(query, {totalHours: total, timedIn: false}, function(err, result){
                        if(result == null){
                            res.send(400, {
                                code: vars.CODE_BAD_REQUEST,
                                msg: vars.CODE_BAD_REQUEST,
                                err: err
                            });
                        }
                        else if(!err){
                            res.send(200, {
                                code: vars.CODE_SUCCESS,
                                msg: "Successfully timed out",
                            });
                        }
                        else if(err){
                            res.send(500, {
                                code: vars.CODE_SUCCESS_ERROR,
                                msg: vars.CODE_SUCCESS_ERROR,
                                err: err
                            });
                        }
                    });
                }
                else{
                    res.send(500, {
                        code: vars.CODE_SUCCESS_ERROR,
                        msg: vars.CODE_SUCCESS_ERROR,
                        err: err
                    });
                }
            });
        }
        else{
            res.send(500, {
                code: vars.CODE_SUCCESS_ERROR,
                msg: vars.CODE_SUCCESS_ERROR,
                err: err
            });
        }
    });

    
}