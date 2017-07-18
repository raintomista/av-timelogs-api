require('moment-duration-format');

const moment = require('moment');
const mongoose = require('mongoose');

const sendgrid = require('../../../../services/sendgrid');
const vars = require('../../../../vars');

const Offset = require('../../../../models/offset');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');

const office_start = moment().startOf('day').add(9, 'hours').utc();
const late = moment().startOf('day').add(10, 'hours').add(1, 'minutes').utc();


module.exports = function (req, res, next) {
	const time_in = moment().utc();
	let late_hours = null;

	//Check if Time In is Late
	if (!time_in.isBetween(office_start, late)) {
		late_hours = moment(time_in).diff(office_start, 'seconds');
	}


	findUser(req.params.data.username)
		.then(user => {
			if (user.status === 0) {
				checkIfOffsetHour(req.params.data.username)
					.then(offsetHour => {
						if (!offsetHour) { //Normal Time In
							saveTimelog(user._id);
						} else { //Offset Hour Time In
							saveOffset(user._id);
						}
					});
			} else {
				res.send(400, {
					code: vars.CODE_BAD_REQUEST,
					message: 'User is already timed in'
				})
			}
		});

	// Function Declaration
	function findUser(username) {
		return User.findOne({
				username: username
			}, {
				username: 1,
				status: 1
			})
			.then(user => {
				return user;
			})
			.catch(err => {
				throw err;
			})
	}

	function saveOffset(userId) {
		let newOffset = new Offset({
			_user: userId,
			timeIn: time_in,
			timeOut: null,
			totalHrs: 0
		});

		newOffset.save()
			.then(offset => {
				let query = {
					username: req.params.data.username
				};
				let update = {
					status: 1,
					_offset: newOffset._id
				};
				updateUserStatus(query, update, 0, 3);
			})
			.catch(err => {
				res.send(500, {
					code: vars.CODE_SERVER_ERROR,
					message: vars.MSG_SERVER_ERROR,
					err: err
				})
			});
	}

	function saveTimelog(userId) {
		//Create New Timelog
		let newTimelog = new Timelog({
			_user: userId,
			timeIn: time_in,
			timeOut: null,
			lateHrs: late_hours,
			totalHrs: 0
		});

		newTimelog.save()
			.then(timelog => {
				let query = {
					username: req.params.data.username
				};
				let update = {
					status: 1,
					_timelog: timelog._id,
					_offset: null
				};
				let msgCode = late_hours > 0 ? 1 : 2;
				updateUserStatus(query, update, timelog.lateHrs, msgCode);
			})
			.catch(err => {
				res.send(500, {
					code: vars.CODE_SERVER_ERROR,
					message: vars.MSG_SERVER_ERROR,
					err: err
				})
			});
	}

	function updateUserStatus(query, update, lateHrs, msgCode) {
		User.findOneAndUpdate(query, update)
			.then(user => {
				let message = '';
				switch(msgCode){
					case 1:
						message = 'Successfully timed in. You are late.';
						break;
					case 2: 
						message = 'Successfuly timed in. You are on-time.';
						break;
					case 3: 
						message = 'Successfully timed in within Offset Hours';
						break;
				}
				sendAlerts(user, time_in.utcOffset("+08:00").format('hh:mm:ss A'), msgCode);
				res.send(200, {
					code: vars.CODE_SUCCESS,
					message: message,
					data: {
						lateHrs: lateHrs
					}
				});
			})
			.catch(err => {
				res.send(500, {
					code: vars.CODE_SERVER_ERROR,
					message: vars.MSG_SERVER_ERROR,
					err: err
				});
			});
	}

	function checkIfOffsetHour(username) {
		return findUser(username).then(user => {
			return getTodaysHours(user._id)
				.then(response => {
					if (response.length > 0) {
						let total = response[0].total;
						console.log(moment.duration(total, 'seconds').asHours());
						if (moment.duration(total, 'seconds').asHours() >= 9) {
							return true;
						}
					}

					return false;
				})
				.catch(err => {
					throw err;
				})
		});
	}


	function getTodaysHours(userId) {
		const start_of_day = moment().utc().startOf('day').toDate();
		const end_of_day = moment(start_of_day).utc().add(1, 'day').toDate();

		return Timelog.aggregate([{
					$match: {
						_user: userId,
						timeIn: {
							$gte: new Date(start_of_day),
							$lt: new Date(end_of_day)
						}
					}
				},
				{
					$group: {
						_id: "$_user",
						total: {
							$sum: "$totalHrs"
						}
					}
				}
			])
			.then(timelogs => {
				return timelogs;
			})
			.catch(err => {
				throw err;
			})
	}

	function sendAlerts(user, time, msgCode) {
		User.find({
				isAdmin: true
			}, {
				email: 1,
				firstName: 1,
				lastName: 1
			})
			.then(recipients => {
				let verb = '';
				switch(msgCode){
					case 1:
						verb = 'timed in late';
						break;
					case 2:
						verb = 'timed in'
						break;
					case 3:
						verb = 'timed in within Offset Hours'
						break;
				}

				sendgrid.emailTimeInOutAlert(`${user.firstName} ${user.lastName}`, verb, time, recipients);
			})
			.catch(err => {
				console.log(err);
				throw err;
			});
	}
}