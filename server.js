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

    restClient.get(`${process.env.apiUrl}?location=${event.message.latitude},${event.message.longitude}&rankby=distance&keyword=ธนาคารUOB&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU`, (data, response) => {

    //restClient.get(`${process.env.apiUrl}?lat=${event.message.latitude}&long=${event.message.longitude}`, (data, response) => {
        if (data) {
            //const pinData = data.results
          const pinData = data.results.map(row => ({
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "header": {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": `${row.name}`,
                      "size": "sm",
                      "weight": "bold",
                      "color": "#AAAAAA"
                    }
                  ]
                },
                "hero": {
                  "type": "image",
                 "url": "https://lh3.googleusercontent.com/p/AF1QipP4xdrNQYSC-T4aXbBfvUujlyS98Dbz1109JtBL=w1024-k",
                  "size": "full",
                  "aspectRatio": "20:13",
                  "aspectMode": "cover",
                  "action": {
                    "type": "uri",
                    "label": "Action",
                    "uri": "https://linecorp.com/"
                  }
                },
                "body": {
                  "type": "box",
                  "layout": "horizontal",
                  "spacing": "md",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": `${row.name}`,
                          "margin": "md",
                          "size": "xs",
                          "gravity": "top"
                        },
                        {
                          "type": "separator"
                        },
                        {
                          "type": "text",
                          "text": `${row.name}`,
                          "margin": "md",
                          "size": "xs",
                          "gravity": "center"
                        }
                     
                      ]
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "uri",
                        "label": "นำทาง",
                        "uri": "https://www.google.com/maps?q="
                      }
                    }
                  ]
                }
              }
            }
            
             //end fulfillment
             //end result

            // "type": "text",
            // "text": `${row.name}`
))

          var msg = [];

          msg.push(pinData[0],pinData[1],pinData[2])
       
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
