const nodemailer = require('nodemailer');

module.exports = {
    sendVerification
}

//input smtp options for your own email
async function sendVerification({ to, subject, html, from = 'darwin.tillman@ethereal.email' }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'darwin.tillman@ethereal.email',
            pass: 'p8nktc9R35FSxqw14h'
        }
    });
    await transporter.sendMail({from, to, subject, html})
}