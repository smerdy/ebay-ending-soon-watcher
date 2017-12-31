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
    send: true,
    preview: false,
    juice: false,
    htmlToText: false,
    transport: transporter
  });

  email.send({
    template: 'endingSoonNotification',
    message: {
      to: 'joshua.pham@gmail.com'
    },
    locals: {
      'ebayItems': mailOptions.ebayItems,
      'subject': mailOptions.subject
    }
  }).then(console.log).catch(console.error);
}