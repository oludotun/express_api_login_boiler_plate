const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // use TLS
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

module.exports = transporter;