'use strict'

const fs = require('fs');
const nodemailer = require('nodemailer');
const config = JSON.parse(fs.readFileSync("src/config.json"));
const Email = require('email-templates');

// mailOptions has {subject, html of body}
module.exports = (mailOptions) => {

  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: config.email,
        pass: config.password
      },
      tls: {
        rejectUnauthorized: false
      }
  });

  const email = new Email({
    message: {
      from: 'joshua.pham@gmail.com'
    },
    // uncomment below to send emails in development/test env:
    // send: true
    transport: transporter
  });

  email.send({
    template: 'mars',
    message: {
      to: 'joshua.pham@gmail.com'
    },
    locals: {
      'ebayItems': mailOptions.ebayItems,
      'subject': mailOptions.subject
    }
  }).then(console.log).catch(console.error);


  // Message object
  let message = {
      from: config.email,
      to: config.email,
      subject: mailOptions.subject,
      html: mailOptions.htmlBody
  };

  transporter.sendMail(message, (err, info) => {
      if (err) {
          console.log('Error occurred. ' + err);
      }

      console.log('Message sent: %s', info);
  });

}