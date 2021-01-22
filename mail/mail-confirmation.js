const transporter = require('./transporter');
const MailConfirmationMail = require('./templates/mail-confirmation');
const { appName } = require('../config/app');
const MailConfig = require('../config/mail');

const sendMailConfirmationMail = async (user, link, callback=null) => {
    if(process.env.NODE_ENV !== 'development') {
        let info = await transporter.sendMail({
            from: `"${MailConfig.from.name}" <${MailConfig.from.address}>`,
            to: `"${user.name}" <${user.email}>`,
            subject: `Please Verify Your ${appName} Email Address`,
            text: MailConfirmationMail.text(user, link),
            html: MailConfirmationMail.html(user, link),
            headers: {
                'Return-Path': MailConfig.bounce.email
            }
        });
        if(callback) callback({result: `Mail sent successfully to ${user.email}`});
    } else {
        console.log(MailConfirmationMail.html(user, link), MailConfirmationMail.text(user, link));
        if(callback) callback({result: `Mail sent successfully to ${user.email}`});
    }
    
}

module.exports = sendMailConfirmationMail;