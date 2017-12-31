'use strict'

import mailer from './../src/mailer'
import ebayFetch from './../src/ebayFetch'

const CronJob = require('cron').CronJob;

const hour_gap = 6;

var ebayOptions = {
  'name': 'fujifilm x-t1',
  'price_low': 300,
  'price_high': 400
};

// final string: '00 00 0-23/' + String(hour_gap) + ' * * *'
var job = new CronJob('0-59/10 * * * * *', function() {
    ebayFetch(ebayOptions, hour_gap, function(ebayItems) {
      // var formattedItems = ebayItems.map((item) => "<p>" + item.endsAt + "</p>").join();

      if (ebayItems.length > 0) {
        var htmlBody = ebayItems.map(function(item) {
            return '<a href="' + item.itemListingUrl + '">' + item.title + '</a><img src="' + item.itemPictureUrl + '"><p>' + item.price + '</p><p>' + item.endsAt + '</p>'
          }).join('<br>')

        var mailOptions = {
          'htmlBody': htmlBody,
          'subject': ebayOptions.name
        }

        mailer(mailOptions)
      }
      else {
        var mailOptions = {
          'htmlBody': 'No items found!',
          'subject': ebayOptions.name
        }
        mailer(mailOptions);
      }
    });

  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);