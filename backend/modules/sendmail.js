const nodemailer = require('nodemailer');
const $config = require('../config.module')

function sendmail(mensaje) {
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: $config.mail,
      pass: $config.mailpassword
    }
  });

  return transporter.sendMail(mensaje);
}

module.exports = sendmail