'use strict'

const fs = require('fs');
const nodemailer = require('nodemailer');
const config = JSON.parse(fs.readFileSync("src/config.json"));

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

  var htmlBody = mailOptions.ebayItems
    .map(function(item) {
      return '<a href="' + item.itemListingUrl + '">' + item.title + '</a><img src="' + item.itemPictureUrl + '"><p>' + item.price + '</p><p>' + item.endsAt + '</p>'
    }).join('<br>')

  // Message object
  let message = {
      from: config.email,
      to: config.email,
      subject: mailOptions.subject,
      html: htmlBody
  };

  transporter.sendMail(message, (err, info) => {
      if (err) {
          console.log('Error occurred. ' + err);
      }

      console.log('Message sent: %s', info);
  });

}