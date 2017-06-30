const SENDGRID_API_KEY = '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';
const BASE_URL = 'https://av-time-logs.herokuapp.com';

let helper = require('sendgrid').mail;

module.exports.personalizeEmailByRecipient = function(recipients){
    let bccRecipients = [];
    let mail = new helper.Mail();
    let TEMPLATE_ID = '3df627f7-485c-4e71-85fd-12b5189d760b';

    // Set Email Sender 
    let fromEmail = new helper.Email('no-reply@app-venture.co');
    mail.setFrom(fromEmail);

    // Set Email BCC Recipients
    recipients.forEach((recipient) =>  bccRecipients.push(new helper.Email(recipient.email, recipient.name)));
    
    // Personalize Each BCC Recipients
        recipients.forEach(function(recipient){
        let personalization = new helper.Personalization();
        personalization.setSubject('Forgot to Time In?')
        personalization.addTo(fromEmail); //Set Email Receiver
        personalization.addBcc(recipient); //Set Email BCC Recipients
        personalization.addSubstitution(new helper.Substitution("%user%", recipient.name));
        personalization.addSubstitution(new helper.Substitution("%button_url%", `${BASE_URL}`));
        mail.addPersonalization(personalization);
    });

    //Set Email Template
    mail.setTemplateId(TEMPLATE_ID); 
    
    // Send Email
    sendEmail(mail);
}


module.exports.emailWithList = function(absentees){
    let list = '';
    let msg = 'Here are the list of users who have not timed in today.'
    let mail = new helper.Mail();
    let TEMPLATE_ID = '56a32316-85e8-4ee4-8f4f-e75d852ab001';

    // Set Email Sender 
    let fromEmail = new helper.Email('no-reply@app-venture.co');
    mail.setFrom(fromEmail);

    // Set Email BCC Recipients
    // absentees.forEach((absentee) =>  {
    //     list = `${list}${absentee.name}\n` 
    // });
    
    
    if(absentees.length < 1){
        msg = 'All of the users are present today.';
        list = ''
    }   
    else{
        absentees.forEach((absentee) => {
            list = list + `<ul><li><img src="${absentee.imgUrl}"><span class="absentee-name">${absentee.name}</span></li></ul>` + '\n';
        });
    }

    // Personalize Each BCC Recipients
    let personalization = new helper.Personalization();
    personalization.setSubject('Absent Users')
    personalization.addTo(new helper.Email('rstomista@up.edu.ph', 'Admin')); //Set Email Receiver
    personalization.addSubstitution(new helper.Substitution("%msg%", msg));    
    personalization.addSubstitution(new helper.Substitution("%list%", list));
    personalization.addSubstitution(new helper.Substitution("%button_url%", `${BASE_URL}/time-in`));
    mail.addPersonalization(personalization);

    //Set Email Template
    mail.setTemplateId(TEMPLATE_ID); 
    
    // Send Email
    sendEmail(mail);
}

sendEmail = function(mail){
    let sendgrid = require('sendgrid')(SENDGRID_API_KEY);
    let request = sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sendgrid.API(request, function (error, response) {
        if (error) console.log('Error response received');
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
}