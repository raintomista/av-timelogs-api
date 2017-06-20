const mongoose = require('mongoose');
const vars = require('../../../../../vars');
const Network = require('../../../../../models/network');

module.exports = function(req,res,next){
    
    Network.findByIdAndRemove(req.params._id, function(err, result){
        if(!err){
            res.send(200,{
                code: vars.CODE_SUCCESS,
                msg: "Network has been deleted"
            });
        } else {
            res.send(500,{
                code: vars.CODE_SERVER_ERROR,
                msg: vars.MSG_SERVER_ERROR
            });
        }
    });
}