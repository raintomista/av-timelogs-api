const moment = require('moment');
const mongoose = require('mongoose');
const User = require('../models/user');
const sendgrid = require('./sendgrid');


setInterval(function(){
    const currentTime = moment().utcOffset('+08:00');
    timeInAlert(currentTime);
    endOfTheDayAlert(currentTime);

}, 1000, true);


// Alerts
timeInAlert = function(currentTime){
    const noonTime = moment().startOf('day').add(12, 'hours');
    console.log(`${noonTime.format('HH:mm:ss')} ${currentTime.format('HH:mm:ss')} -- TIME IN ${noonTime.format('HH:mm:ss') === currentTime.format('HH:mm:ss')}`);
    if(noonTime.format('HH:mm:ss') === currentTime.format('HH:mm:ss')){
        User.find({status: 0}, {email: 1, name: 1}, function(err, results){
            sendgrid.personalizeEmailByRecipient(results);
        });
    }
}

endOfTheDayAlert = function(currentTime){
    const start = moment().startOf('day').add(9, 'hours');
    const end = moment().startOf('day').add(19, 'hours');
    const endOfTheDay = moment().startOf('day').add(19, 'hours').utcOffset('+08:00');
    console.log(`${endOfTheDay.format('HH:mm:ss')} ${currentTime.format('HH:mm:ss')} -- END OF THE DAY ALERT ${end.format('HH:mm:ss') === currentTime.format('HH:mm:ss')}`);

    if(end.format('HH:mm:ss') === currentTime.format('HH:mm:ss')){
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
    }
    
}











// noonMailer = function(){
//     const noon = moment().startOf('day').add(9, 'hours').utcOffset('+08:00');
//     const current_time = moment().utcOffset('+08:00');

//     console.log(`${noon.format('HH:mm:ss')} ${current_time.format('HH:mm:ss')}`);
//     if(current_time.isSameOrAfter(noon)){
//         User.find({status: 0}, function(err, results){
//             let users = ['rstomista@up.edu.ph', 'i211459@mvrht.net']
//             // results.forEach(function(test){
//             //     console.log(test.email);
//             // });

//             let email = {
//                 from: 'rstomista@up.edu.ph',
//                 to: 'i211459@mvrht.net',
//                 html: '<p></p>',
//                 subject: 'Rain Tomista has timed in at 12:19 AM',
//                 templateId: TEMPLATE_ID,
//                 substitutions: {
//                     '%user%': 'Rain Tomista',
//                     '%noun%': 'timed in',
//                     '%time%': '09:00 AM',
//                     '%button_url%': `${BASE_URL}/admin/timelogs`
//                 }
//             };

//             sendEmail(email);
            
//         });
//     }
//     else{
//     }
// }



// sendEmail = function(email){
//     const mailer = require('sendgrid-mailer').config(SENDGRID_API_KEY);
//     mailer.send(mailer.createMail(email))
//         .then(() => {
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }

