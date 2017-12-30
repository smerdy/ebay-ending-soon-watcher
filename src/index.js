'use strict'

import mailer from './../src/mailer'
import ebayFetch from './../src/ebayFetch'

const CronJob = require('cron').CronJob;

var ebayOptions = {
  'name': 'fujifilm+x-t1',
  'price_low': 400,
  'price_high': 1000
};

var job = new CronJob('00 11 04 * * 1-7', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
    ebayFetch(ebayOptions, function(ebayItems) {
      var formattedItems = ebayItems.map((item) => "<p>" + item.endsAt + "</p>").join();
      var mailOptions = {
        'HTMLbody': formattedItems,
        'subject': ebayOptions.name
      }
      mailer(mailOptions)
    });

  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);