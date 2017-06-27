const mongoose = require('mongoose');
const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');


module.exports = function(req, res, next){
    const start_of_day = moment(req.params.startDate, 'MMDDYYYY').startOf('day').toDate();
    const end_of_day = moment(req.params.endDate, 'MMDDYYYY').add(1, 'days').toDate();

    console.log(start_of_day);
    console.log(end_of_day);
    
    const query = {
        
}
    
    User.findOne({username: req.params.username}, function(err, user){
        if(!err){
            Timelog.find({ _user: user._id, timeIn: {$gte : new Date(start_of_day), $lt: new Date(end_of_day)} }, {}, {sort: { timeIn: 1}})
            .populate('_user')
            .exec(function(err, result){
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
        else{
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully fetched",
                data: result
            });
        }
    });
    


    // Timelog.find(query, function(err, result){
    //     if(!err){
    //         res.send(200, {
    //             code: vars.CODE_SUCCESS,
    //             msg: "Successfully fetched",
    //             data: result
    //         });
    //     }
    //     else{
    //         res.send(500, {
    //             code: vars.CODE_SERVER_ERROR,
    //             msg: vars.CODE_SERVER_ERROR,
    //             err: err
    //         })
    //     }
    // });
}