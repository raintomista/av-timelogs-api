const SENDGRID_API_KEY = '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';
const BASE_URL = 'https://av-time-logs.herokuapp.com';

let helper = require('sendgrid').mail;

module.exports.personalizeEmailByRecipient = function (recipients) {
    let bccRecipients = [];
    let mail = new helper.Mail();
    let TEMPLATE_ID = '8601ccb1-759f-4bfc-aff9-d509412b5e8e';

    // Set Email Sender 
    let fromEmail = new helper.Email('no-reply@app-venture.co');
    mail.setFrom(fromEmail);

    // Set Email BCC Recipients
    recipients.forEach((recipient) => bccRecipients.push(new helper.Email(recipient.email, recipient.name)));

    // Personalize Each BCC Recipients  
    recipients.forEach(function (recipient) {
        let personalization = new helper.Personalization();
        personalization.setSubject('Forgot to Time In?')
        personalization.addTo(fromEmail); //Set Email Receiver
        personalization.addBcc(recipient); //Set Email BCC Recipients
        personalization.addSubstitution(new helper.Substitution("%user%", `${recipient.firstName}`));
        personalization.addSubstitution(new helper.Substitution("%button_url%", `${BASE_URL}`));
        mail.addPersonalization(personalization);
    });

    //Set Email Template
    mail.setTemplateId(TEMPLATE_ID);

    // Send Email
    sendEmail(mail);
}


module.exports.emailWithList = function (absentees, recipients) {
    let list = '';
    let ccRecipients = [];
    
    let msg = 'Here is a list of user/s who have not timed in today.'
    let mail = new helper.Mail();
    let TEMPLATE_ID = 'ba3a3bb7-473f-477a-bcc0-43079a8871cc';

    // Set Email Sender 
    let fromEmail = new helper.Email('no-reply@app-venture.co');
    mail.setFrom(fromEmail);


    if (absentees.length < 1) {
        msg = 'All of the users are present today.';
        list = ''
    } 
    else {
        list = '<ul>\n';
        absentees.forEach((absentee) => {
            list = list + `\t<li><img src="${absentee.imgUrl}"><span class="absentee-name">${absentee.lastName}, ${absentee.firstName}</span></li>` + '\n';
        });
        list = list + '</ul>';
    }

    // Set Email CC Recipients
    recipients.forEach((recipient) => ccRecipients.push(new helper.Email(recipient.email, `${recipient.firstName} ${recipient.lastName}`)));

    // Personalize Each BCC Recipients  
    ccRecipients.forEach(function (recipient) {
        let personalization = new helper.Personalization();
        personalization.setSubject('List of Absent Users')
        personalization.addTo(recipient); //Set Email CC Recipients
        personalization.addSubstitution(new helper.Substitution("%msg%", msg));
        personalization.addSubstitution(new helper.Substitution("%list%", list));
        personalization.addSubstitution(new helper.Substitution("%button_url%", `${BASE_URL}/admin/timelogs`));
        mail.addPersonalization(personalization);
    });

    //Set Email Template
    mail.setTemplateId(TEMPLATE_ID);

    // Send Email
    sendEmail(mail);
}

module.exports.emailTimeInOutAlert = function (name, verb, time, recipients) {
    let ccRecipients = [];
    let mail = new helper.Mail();
    let TEMPLATE_ID = 'fbe450f5-4299-4f5a-a52b-0d96a17849ef';

    // Set Email Sender 
    let fromEmail = new helper.Email('no-reply@app-venture.co');
    mail.setFrom(fromEmail);

    // Set Email CC Recipients
    recipients.forEach((recipient) => ccRecipients.push(new helper.Email(recipient.email, `${recipient.firstName} ${recipient.lastName}`)));

    // Personalize Each BCC Recipients  
    ccRecipients.forEach(function (recipient) {
        let personalization = new helper.Personalization();
        personalization.setSubject(`${name} has ${verb} at ${time}`)
        personalization.addTo(recipient); //Set Email CC Recipients
        personalization.addSubstitution(new helper.Substitution("%name%", name));
        personalization.addSubstitution(new helper.Substitution("%verb%", verb));
        personalization.addSubstitution(new helper.Substitution("%time%", time));
        personalization.addSubstitution(new helper.Substitution("%button_url%", `${BASE_URL}/admin/timelogs`));
        mail.addPersonalization(personalization);
    });

    //Set Email Template
    mail.setTemplateId(TEMPLATE_ID);

    // Send Email
    sendEmail(mail);
}

sendEmail = function (mail) {
    let sendgrid = require('sendgrid')(SENDGRID_API_KEY);
    let request = sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sendgrid.API(request, function (error, response) {
        if (error) console.log('Error response received');
    });
}