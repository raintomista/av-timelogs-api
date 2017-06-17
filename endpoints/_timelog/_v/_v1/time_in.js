const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');

module.exports = function(req, res, next){
    let newObject = {
        username: req.params.username,
        timeIn: moment().utc(),
        timeOut: null
    }

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