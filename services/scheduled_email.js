const moment = require('moment');
const mongoose = require('mongoose');
const sendgrid = require('./sendgrid');
const cron = require('node-schedule');

const User = require('../models/user');

cron.scheduleJob({
    hour: 12,
    minute: 00,
    dayOfWeek: [1, 2, 3, 4, 5]
}, function () {
    console.log('12 NOON MAILER');
    timeInAlert();
});

cron.scheduleJob({
    hour: 19,
    minute: 00,
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

function endOfTheDayAlert() {
    const start = moment().startOf('day').add(9, 'hours');
    const end = moment().startOf('day').add(19, 'hours');
    User.find({
            isAdmin: false
        })
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

                absentUsers.sort((a, b) => {
                    return compareStrings(a.lastName, b.lastName);
                })

                sendAlerts(absentUsers)
            }
        });
}

function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}


function sendAlerts(absentUsers) {
    User.find({
            isAdmin: true
        }, {
            email: 1,
            firstName: 1,
            lastName: 1
        })
        .then(recipients => {
            sendgrid.emailWithList(absentUsers, recipients);
        })
        .catch(err => {
            throw err;
        });
}