const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');
const resource = require('../../../../services/resource-service');

const Offset = require('../../../../models/offset');        
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');

module.exports = function(req, res, next){
    getUserInfo(req.params.username)
        .then(user => {
            Promise.all([getAllOffsets(user._id), getTotal(user._id)])
                .then(response => {                    
                    let offsets = response[0];
                    if(offsets.length > 0){
                        let totalValidOffsetHrs = 0;

                        if(response[1][0]){
                            totalValidOffsetHrs = response[1][0].totalValidOffsetHrs;
                        }
    
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'Successfully fetched user offsets.',
                            data: {
                                user: resource.formatUserDurationOnly(user),
                                offsets: resource.formatOffsetDurationOnly(offsets),
                                totalValidOffsetHrs: resource.secondsToDuration(totalValidOffsetHrs),
                            }
                        });
                    }
                    else{
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'No user offsets fetched.',
                            data: {
                                user: user,
                                offsets: offsets,
                                totalHrs: 0,
                            }
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
        })


    function getUserInfo(username){
        return User.findOne({username: username})
            .then(user => {
                return user;
            })
            .catch(err => {
                throw err;
            });
    }

    function getAllOffsets(userId){
        return Offset.find({_user: userId})
            .sort([['isValid', -1,], ['timeIn', 1]])
            .exec()
            .then(results => {
                return results;
            })
            .catch(err => {
                throw err;
            });
    }

    function getTotal(userId){
        
		return Offset.aggregate([
				{ $match: { _user: userId, isValid: true }}, 
				{
					$group: {
						_id: "$_user",
						totalValidOffsetHrs: { $sum: "$totalHrs" },
					}
				}
			])
			.then(results => {	                	
				return results;				
			})
			.catch(err => {
				throw err;
			})
	}
}