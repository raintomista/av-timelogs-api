const mongoose = require('mongoose');
const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');

module.exports = function(req, res, next){
    const start_of_day = moment(req.params.date, 'MMDDYYYY').startOf('day').toDate();
    const end_of_day = moment(req.params.date, 'MMDDYYYY').add(1, 'days').toDate();
    const query = {timeIn: {$gte : new Date(start_of_day), $lt: new Date(end_of_day)}}
    
    Timelog.find(query, function(err, result){
        if(!err){
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully fetched",
                data: result
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