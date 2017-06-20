const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const User = require('../../../../../models/user');


module.exports = function(req, res, next){
    User.find({}, function(err, result){
        if(!err){

            res.send(200,{code: "success", data: result});
            // if(result.length > 0){
            //     res.send(200, {
            //         code: vars.CODE_SUCCESS,
            //         msg: "Successfully fetched",
            //         data: result
            //     });
            // }
            // else{
            //     res.send(200, {
            //         code: vars.CODE_SUCCESS,
            //         msg: "No data fetched"
            //     });
            // }
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