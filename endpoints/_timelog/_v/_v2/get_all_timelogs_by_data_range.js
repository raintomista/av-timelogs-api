const mongoose = require('mongoose');
const moment = require('moment');

const vars = require('../../../../vars');
const resource = require('../../../../services/resource-service');


const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');

module.exports = function(req, res, next){
    const start_of_day = moment(req.params.startDate, 'MMDDYYYY').startOf('day').toDate();
    const end_of_day = moment(req.params.endDate, 'MMDDYYYY').endOf('day').toDate();

    getUserInfo(req.params.username)
        .then(user => {
            Promise.all([getAllTimelogs(user._id), getTotal(user._id)])
                .then(response => {
                    let timelogs = response[0];

                    if(timelogs.length > 0){
                        let totalHrs = response[1][0].totalHrs;
                        let totalLateHrs = response[1][0].totalLateHrs;
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'Successfully fetched user timelogs by date range',
                            data: {
                                user: user,
                                timelogs: resource.formatTimelogsDurationOnly(timelogs),
                                totalHrs: resource.secondsToDuration(totalHrs),
                                totalLateHrs: resource.secondsToDuration(totalLateHrs)
                            }
                        });
                    }
                    else{
                        res.send(200, {
                            code: vars.CODE_SUCCESS,
                            message: 'No timelogs fetched',
                            data: {
                                user: user,
                                timelogs: timelogs,
                                totalHrs: 0,
                                totalLateHrs: 0
                            }
                        });
                    }
                })
                .catch(err => {
                    res.send(500, {
                        code: vars.CODE_SERVER_ERROR,
                        message: vars.MSG_SERVER_ERROR,
                        err: err
                    })
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

    function getAllTimelogs(userId){
        return Timelog.find({ _user: userId, timeIn: {$gte : new Date(start_of_day), $lt: new Date(end_of_day)} }, {}, {sort: { timeIn: 1 }})
            .then(timelogs => {
               return timelogs;
            })
            .catch(err => {
                throw err;
            });
    }

    function getTotal(userId){
		return Timelog.aggregate([
				{ $match: { _user: userId, timeIn: {$gte : new Date(start_of_day), $lt: new Date(end_of_day)} }}, 
				{
					$group: {
						_id: "$_user",
						totalHrs: { $sum: "$totalHrs" },
						totalLateHrs: { $sum: "$lateHrs" }
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

