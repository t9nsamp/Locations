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

      restClient.get(`${process.env.apiUrl}?location=${event.message.latitude},${event.message.longitude}&rankby=distance&keyword=UOB@&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU`, (data, response) => {

      //restClient.get(`${process.env.apiUrl}?lat=${event.message.latitude}&long=${event.message.longitude}`, (data, response) => {
          if (data) {
            const pinData = data.results.map(row => ({
              //const pinData = data.map(row => ({
                                "type": "text", 
                                "text": `${row[0].name}`,
              }))
              

      
              resolve(client.replyMessage(event.replyToken, pinData))
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
