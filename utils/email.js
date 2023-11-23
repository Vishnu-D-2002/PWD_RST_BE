const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = require('./config');

const sendEmail = async(option) => {
    const transporter=nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass:EMAIL_PASSWORD
        }
    })

    const emailOptions = {
        from: 'vishnu support<support@vishnu.com>',
        to: option.email,
        subject: option.subject,
        text:option.message
    }

   await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;