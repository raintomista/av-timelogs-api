const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');
module.exports = function(req, res, next){
    const query = { username: req.params.username };
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

                        console.log(total);
                    });

                    User.findOneAndUpdate(query, {totalHours: total}, function(err, result){
                        if(!err){
                            res.send(200, {
                                code: vars.CODE_SUCCESS,
                                msg: "Successfully timed out",
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
        else{
            res.send(500, {
                code: vars.CODE_SUCCESS_ERROR,
                msg: vars.CODE_SUCCESS_ERROR,
                err: err
            });
        }
    });

    
}