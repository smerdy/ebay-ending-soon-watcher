'use strict'

const trim = require('trim');
const ebay = require('ebay-api');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
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
    keywords: ebayOptions.name.split(' '),
    paginationInput: {
      entriesPerPage: 10
    },
    itemFilter: [
      {name: 'MaxPrice', value: '900'}
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

      for (var i = 0; i < items.length; i++) {
        console.log('- ' + items[i].title);
      }
    }
  );
/*
  request(search_url, function(error, response, body) {
    var TODAY = new Date();

    if (response.statusCode === 200) {
      const $ = cheerio.load(body);
      const itemsData = Array.from($('.sresult'))
        .filter((ebayListing) => {
          var timeLeftMs = $(ebayListing).find('.timeleft .timeMs').attr('timems');
          if (timeLeftMs == undefined) {
            console.log($(ebayListing).html())
          }
          console.log($(ebayListing).find('h3.lvtitle').text());

          if (timeLeftMs) {
            var endingDate = new Date()
            endingDate.setTime(timeLeftMs)
            // console.log(endingDate)
            // console.log((endingDate - TODAY) / 60 / 60 / 1000);
            if (endingDate - TODAY <= 1000 * 60 * 60 * hour_gap) {
              // console.log('Within time bound:');
              return true
            }
          }
          return false
        })
        .map((ebayListing) => {
          var endTime = new Date();
          endTime.setTime(parseInt($(ebayListing).find('.timeleft .timeMs').attr('timems')));
          var timeRemaining = convertMS(endTime - TODAY);
          var timeRemainingStr = timeRemaining.h + 'h ' + timeRemaining.m + 'm';

          return {
            title: trim($(ebayListing).find('h3.lvtitle').text()),
            price: parseFloat(trim($(ebayListing).find('.lvprice').text()).replace(',', '').replace('$','')),
            endsAt: timeRemainingStr,//endTime.toString(),
            itemListingUrl: ($(ebayListing).find('.lvtitle a').attr('href')),
            itemPictureUrl: ($(ebayListing).find('.lvpic img').attr('src'))
          }
        });

      sendItems(itemsData);
    }
  });*/
}