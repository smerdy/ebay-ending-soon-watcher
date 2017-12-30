'use strict';

const trim = require('trim');
const request = require('request');
const cheerio = require('cheerio');
const NUM_HOURS = 6;
const TODAY = new Date();

export default ((ebayOptions, callback) => {
  //Lets require/import the HTTP module

  const search_url = 'http://www.ebay.com/sch/i.html?_from=R40&_sacat=0&_nkw=' + ebayOptions.name + '&_sop=1&_udlo=' + ebayOptions.price_low + '&_udhi=' + ebayOptions.price_high + '&LH_ItemCondition=1000|1500|3000&_ipg=200&rt=nc';

  console.log(search_url);
  request(search_url, function (error, response, body) {
    if (response.statusCode === 200) {
      const $ = cheerio.load(body);
      const itemsData = Array.from($('.sresult')).filter(function (ebayListing) {
        var timeLeftMs = parseInt($(ebayListing).find('.timeleft .timeMs').attr('timems'));

        if (timeLeftMs) {
          var endingDate = new Date();
          endingDate.setTime(timeLeftMs);
          if (endingDate - TODAY <= 1000 * 60 * 60 * NUM_HOURS) return true;
        }
        return false;
      }).map(function (ebayListing) {
        var endTime = new Date();
        endTime.setTime(parseInt($(ebayListing).find('.timeleft .timeMs').attr('timems')));

        return {
          title: trim($(ebayListing).find('h3.lvtitle').text()),
          price: parseFloat(trim($(ebayListing).find('.lvprice').text()).replace(',', '').replace('$', '')),
          endsAt: endTime.toString(),
          itemListingUrl: $(ebayListing).find('.lvtitle a').attr('href'),
          itemPictureUrl: $(ebayListing).find('.lvpic img').attr('src')
        };
      });
      // send cron job with itemsData formatted into email.
      callback(itemsData);
    }
  });
});