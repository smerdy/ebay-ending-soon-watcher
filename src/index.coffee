if process.env.NODE_ENV != 'production'
  require('dotenv').config()
#Lets require/import the HTTP module
restify = require('restify')
trim = require('trim')
request = require('request')
cheerio = require('cheerio')
server = restify.createServer(
  name: 'ebay-ending-watcher'
  version: '1.0.0')
# add any additional custom server configuration
server.use restify.acceptParser(server.acceptable)
server.use restify.queryParser()
server.use restify.bodyParser()
server.get '/ebay-ending-soon/:name', (req, res, next) ->
  request "http://www.ebay.com/sch/i.html?_from=R40&_sacat=0&_nkw=#{req.params.name}&_sop=1&_udlo=#{req.params.price_low}&_udhi=#{req.params.price_high}", (error, response, body) ->
    if response.statusCode == 200
      $ = cheerio.load(body)
      itemsData = for ebayListing in $('.sresult')[..5] # take 5 items
          {     
              title: trim($(ebayListing).find('h3.lvtitle').text())
              price: parseFloat(trim($(ebayListing).find('.lvprice').text()).replace(/[\$\,]/, ''))
              endsAt: parseInt($(ebayListing).find('.timeleft .timeMs').attr('timems'))
              itemListingUrl: ($(ebayListing).find('.lvtitle a').attr('href'))
              itemPictureUrl: ($(ebayListing).find('.lvpic img').attr('src'))
          }
      res.send(itemsData)
    return
  next()

port = process.env.PORT or 5000
server.listen port, ->
  console.log '%s listening at %s', server.name, server.url
  return

# ---
# generated by js2coffee 2.2.0

# ---
# generated by js2coffee 2.2.0
# ---
# generated by js2coffee 2.2.0
