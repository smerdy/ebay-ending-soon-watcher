'use strict'

import mailer from './../src/mailer'
import ebayFetch from './../src/ebayFetch'

const CronJob = require('cron').CronJob;

const hour_gap = 8;

var ebayOptions = {
  'query': 'fujifilm x-t1 lens',
  'price_low': 400,
  'price_high': 610
};

// final string: '00 00 0-23/' + String(hour_gap) + ' * * *'
var job = new CronJob('00 00 0-23/' + String(hour_gap) + ' * * *', function() {
    ebayFetch(ebayOptions, hour_gap, function(ebayItems) {

      if (ebayItems.length > 0) {

        var mailOptions = {
          'ebayItems': ebayItems,
          'subject': ebayOptions.query
        }

        mailer(mailOptions)
      }
      else {
        // console.log("no items to email")
      }
    });

  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles', /* Time zone of this job. */
  undefined,
  true
);