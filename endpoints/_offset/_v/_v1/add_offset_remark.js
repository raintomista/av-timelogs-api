const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');
const resource = require('../../../../services/resource-service');

const Offset = require('../../../../models/offset');        

module.exports = function(req, res, next){
    Offset.findOne({_id: req.params._id})
        .then(user => {
            if(user){
                user.remarks = req.params.data.remarks;
                user.save()
                    .then(response => {
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'Successfully added offset remarks'
                        });
                    })
                    .catch((err) => { 
                        throw err; 
                    });
            }
        })
        .catch(err => {
            res.send(500, {
                code: vars.CODE_SERVER_ERROR, 
                message: vars.MSG_SERVER_ERROR, 
                err: err
            });    
        });
}