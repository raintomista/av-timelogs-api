const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');


module.exports = function(req, res, next){
    const query = {username: req.params.username, timedIn: false};
    const update = {timedIn: true};

    let newObject = {
        username: req.params.username,
        timeIn: moment().utc(),
        timeOut: null
    }

    User.findOneAndUpdate(query, update, function(err, result){
        if(result !== null){
            let newTimelog = new Timelog(newObject);

            newTimelog.save(function(err, timelog){
                if(!err){
                    res.send(200, {
                        code: vars.CODE_SUCCESS,
                        msg: "Successfully timed in",
                        data: timelog
                    });
                }
                else{
                    res.send(500, {
                        code: vars.CODE_SUCCESS_ERROR,
                        msg: vars.CODE_SUCCESS_ERROR,
                        err: err
                    });
                }
            })
        }
        else{
            res.send(400, {
                code: vars.CODE_BAD_REQUEST,
                msg: vars.CODE_BAD_REQUEST
            });
        }
    });
}