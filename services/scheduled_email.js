const moment = require('moment');
const mongoose = require('mongoose');
const User = require('../models/user');
const sendgrid = require('./sendgrid');
const cron = require('node-schedule');


cron.scheduleJob({
    hour: 12,
    minute: 00,
    dayOfWeek: [1, 2, 3, 4, 5]
}, function () {
    console.log('12 NOON MAILER');
    timeInAlert();
});

cron.scheduleJob({
    hour: 0,
    minute: 10,
    dayOfWeek: [1, 2, 3, 4, 5]
}, function () {
    console.log('7PM END OF THE DAY MAILER');
    endOfTheDayAlert();
});


// Alerts
timeInAlert = function () {
    User.find({
        status: 0
    }, {
        email: 1,
        firstName: 1,
        lastName: 1
    }, function (err, results) {
        sendgrid.personalizeEmailByRecipient(results);
    });
}

endOfTheDayAlert = function () {
    User.find()
        .populate('_timelog')
        .exec(function (err, results) {
            if (!err) {
                let absentUsers = [];
                results.forEach(function (result) {
                    if (result._timelog === null) {
                        absentUsers.push(result);
                    } else if (moment(result._timelog.timeIn).isBefore(start) || moment(result._timelog.timeIn).isAfter(end)) {
                        absentUsers.push(result);
                    }
                });

                sendgrid.emailWithList(absentUsers);
            }
        });
}