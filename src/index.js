/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname + '/.env'});
}*/

const NUM_HOURS = 12;
const TODAY = new Date();

//Lets require/import the HTTP module
const restify = require('restify');
const trim = require('trim');
const request = require('request');
const cheerio = require('cheerio');
const server = restify.createServer({
  name: 'ebay-ending-watcher',
  version: '1.0.0'});
// add any additional custom server configuration

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.get('/ebay-ending-soon/:name', function(req, res, next) {
  const lh_complete = req.params.LH_Complete || 0;
  const lh_sold = req.params.LH_Sold || 0;
  const lh_bin = req.params.LH_BIN || 0;

  const search_url = 'http://www.ebay.com/sch/i.html?_from=R40&_sacat=0&_nkw=' + req.params.name + '&_sop=1&_udlo=' + req.params.price_low + '&_udhi=' + req.params.price_high + '&LH_Complete=' + lh_complete + '&LH_Sold=' + lh_sold + '&LH_BIN=' + lh_bin + '&LH_ItemCondition=1000|1500|3000&_ipg=200&rt=nc';

  console.log(search_url);
  request(search_url, function(error, response, body) {
    if (response.statusCode === 200) {
      const $ = cheerio.load(body);
      const itemsData = Array.from($('.sresult'))
        .filter(function(ebayListing) {
          var timeLeftMs = parseInt($(ebayListing).find('.timeleft .timeMs').attr('timems'));

          if (timeLeftMs) {
            var endingDate = new Date()
            endingDate.setTime(timeLeftMs)
            if (endingDate - TODAY <= 1000 * 60 * 60 * NUM_HOURS)
              return true
          }
          return false
        })
        .map(function(ebayListing) {
          var endTime = new Date();
          endTime.setTime(parseInt($(ebayListing).find('.timeleft .timeMs').attr('timems')));

          return {
            title: trim($(ebayListing).find('h3.lvtitle').text()),
            price: parseFloat(trim($(ebayListing).find('.lvprice').text()).replace(',', '').replace('$','')),
            endsAt: endTime.toString(),
            itemListingUrl: ($(ebayListing).find('.lvtitle a').attr('href')),
            itemPictureUrl: ($(ebayListing).find('.lvpic img').attr('src'))
          }
        });
      res.send(itemsData);
    }
  });
  return next();
});

const port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});