const express = require('express')
const line = require('@line/bot-sdk')
const restClient = new (require('node-rest-client').Client)


require('dotenv').config()
const app = express()

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

const client = new line.Client(config);

app.get('/', function (req, res) {
	res.send('03-pm2.5-bot')
})

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch(err => console.log('err', err))
});

function handleEvent(event) {
  if(event.type === 'message' && event.message.type === 'location') {
    return handleLocationEvent(event)
  }else {
    return Promise.resolve(null)
  }
}

function handleLocationEvent(event) {
  return new Promise((resolve, reject) => {

    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.8575872,100.5617152&rankby=distance&keyword=pea&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU

    //apiUrl : https://maps.googleapis.com/maps/api/place/nearbysearch/json

    restClient.get(`${process.env.apiUrl}?location=${event.message.latitude},${event.message.longitude}&rankby=distance&keyword=UOB&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU`, (data, response) => {

    //restClient.get(`${process.env.apiUrl}?lat=${event.message.latitude}&long=${event.message.longitude}`, (data, response) => {
        if (data) {
          // var Carousel = []; // ประกาศ Array สำหรับกล่อง
          // var Str_items = '[]'; // Create String
          // var Json_item = JSON.parse(Str_items); // Convert String to JSON
          // var x = 0;
          // var y = 0;
            //const pinData = data.results
          const pinData = data.results.map(row => ({
            "thumbnailImageUrl": row.icon,
            "imageBackgroundColor": "#FFFFFF",
            "title": `Bank : ${row.name}`,
            "text": `${row.vicinity}`,
            "actions": [
              {
                "type": "uri",
                "label": "ข้อมูลย้อนหลัง",
                "uri": `https://www.google.com/maps/dir/${event.message.latitude},${event.message.longitude}/${row.geometry.location.lat},${row.geometry.location.lng}`
              }
            ]
          }))
      
          var msg = {
            "type": "template",
            "altText": "ข้อมูลสถานที่",
            "template": {
              "type": "carousel",
              "columns": pinData,
              "imageAspectRatio": "rectangle",
              "imageSize": "cover"
            }
          }
  
          resolve(client.replyMessage(event.replyToken, msg))
        } else {
          reject()
        }
      })
    })
   
  }
  
  app.set('port', (process.env.PORT || 4000))
  
  app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'))
  })
