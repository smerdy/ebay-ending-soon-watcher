'use strict'

import mailer from './../src/mailer'
import ebayFetch from './../src/ebayFetch'

const CronJob = require('cron').CronJob;

const hour_gap = 72;

var ebayOptions = {
  'query': 'fujifilm x-t1',
  'price_low': 300,
  'price_high': 400
};


// final string: '00 00 0-23/' + String(hour_gap) + ' * * *'
var job = new CronJob('0-59/10 * * * * *', function() {
    ebayFetch(ebayOptions, hour_gap, function(ebayItems) {

      if (ebayItems.length > 0) {
        // var htmlBody = ebayItems.map(function(item) {
        //     return '<a href="' + item.url + '">' + item.title + '</a><img src="' + item.picURL + '"><p>' + item.price + '</p><p>' + item.hoursLeft + ' hours left</p>'
        //   }).join('<br>')

        var mailOptions = {
          'ebayItems': ebayItems,
          'subject': ebayOptions.query
        }

        mailer(mailOptions)
      }
      else {
        console.log("no items to email")
      }
    });

  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);