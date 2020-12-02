const transporter = require('./transporter');
const PasswordResetMail = require('./templates/password-reset');
const { appName } = require('../config/app');
const MailConfig = require('../config/mail');

const sendPasswordResetMail = async (user, password, callback=null) => {
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"${MailConfig.from.name}" <${MailConfig.from.address}>`,
        to: `"${user.name}" <${user.email}>`,
        subject: `${appName} Account Password Reset`,
        text: PasswordResetMail.text(user, password),
        html: PasswordResetMail.html(user, password),
        headers: {
            'Return-Path': MailConfig.bounce.email
        }
    });
    if(callback) callback({result: `Mail sent successfully to ${user.email}`});
}

module.exports = sendPasswordResetMail;