'use strict'

const trim = require('trim');
const ebay = require('ebay-api');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const ebayConfig = JSON.parse(fs.readFileSync('src/config.json')).ebay;

function convertMS(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return { d: d, h: h, m: m, s: s };
};

module.exports = (ebayOptions, hour_gap, sendItems) => {

  var params = {
    keywords: ebayOptions.query.split(' '),
    paginationInput: {
      entriesPerPage: 10
    },
    itemFilter: [
      {name: 'MaxPrice', value: '900'},
      {name: 'MinPrice', value: '350'}
    ],
    sortOrder: 'EndingTimeSoonest'
  };


  ebay.xmlRequest({
      serviceName: 'Finding',
      opType: 'findItemsByKeywords',
      devId: ebayConfig.devId,
      certId: ebayConfig.certId,
      appId: ebayConfig.appId,
      authToken: ebayConfig.authToken,
      params: params,
      parser: ebay.parseResponseJson    // (default)
    },
    // gets all the items together in a merged array
    function itemsCallback(error, itemsResponse) {
      if (error) throw error;

      var items = itemsResponse.searchResult.item;

      console.log('Found', items.length, 'items');

      var parsedItems = items.map(function(item) {
        var timeLeft = moment.duration(item.sellingStatus.timeLeft);

        if (timeLeft.asMilliseconds() > 60 * 60 * 1000 * hour_gap)
          return false;

        return {
          title: item.title,
          price: item.sellingStatus.currentPrice.amount,
          hoursLeft: timeLeft.asHours(),
          picURL: item.galleryURL,
          url: item.viewItemURL
        }
      }).filter(Boolean);

      console.log(parsedItems)

      sendItems(parsedItems);
    }
  );
}