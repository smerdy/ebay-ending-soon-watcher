'use strict'

const ebay = require('ebay-api');
const fs = require('fs');
const moment = require('moment');
const ebayConfig = JSON.parse(fs.readFileSync('src/config.json')).ebay;

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