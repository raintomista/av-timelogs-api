const moment = require('moment');
const mongoose = require('mongoose');
const User = require('../models/user');
const sendgrid = require('./sendgrid');
const cron = require('node-schedule');


cron.scheduleJob({hour: 4, minute: 00, dayOfWeek: [1,2,3,4,5]}, function(){
    console.log('NOON MAILER');
    timeInAlert();
});

cron.scheduleJob({hour: 11, minute: 00, dayOfWeek: [1,2,3,4,5]}, function(){
    console.log('NIGHT MAILER');
    endOfTheDayAlert();
});

cron.scheduleJob({hour: 18}, function(){
    console.log('Test2');
});

cron.scheduleJob({second: 20}, function(){
    console.log('Test');
});
// setInterval(function(){
//     const currentTime = moment().utcOffset('+08:00');
//     timeInAlert(currentTime);
//     endOfTheDayAlert(currentTime);

// }, 1000, true);


// Alerts
timeInAlert = function(){
    // const noonTime = moment().startOf('day').add(12, 'hours');
    // console.log(`${noonTime.format('HH:mm:ss')} ${currentTime.format('HH:mm:ss')} -- TIME IN ${noonTime.format('HH:mm:ss') === currentTime.format('HH:mm:ss')}`);
    // if(noonTime.format('HH:mm:ss') === currentTime.format('HH:mm:ss')){
        User.find({status: 0}, {email: 1, name: 1}, function(err, results){
            sendgrid.personalizeEmailByRecipient(results);
        });
    // }
}

endOfTheDayAlert = function(){
    const start = moment().startOf('day').add(9, 'hours');
    const end = moment().startOf('day').add(19, 'hours');
    // const endOfTheDay = moment().startOf('day').add(19, 'hours');
    // console.log(`${endOfTheDay.format('HH:mm:ss')} ${currentTime.format('HH:mm:ss')} -- END OF THE DAY ALERT ${endOfTheDay.format('HH:mm:ss') === currentTime.format('HH:mm:ss')}`);

    // if(end.format('HH:mm:ss') === currentTime.format('HH:mm:ss')){
        User.find()
        .populate('_timelog')
        .exec(function(err, results){
            if(!err){
                let absentUsers = [];
                results.forEach(function(result){
                    if(result._timelog === null){
                        absentUsers.push(result);
                    }
                    else if(moment(result._timelog.timeIn).isBefore(start) || moment(result._timelog.timeIn).isAfter(end)){
                        absentUsers.push(result);
                    }
                });

                sendgrid.emailWithList(absentUsers);
            }
        });
    // }
    
}