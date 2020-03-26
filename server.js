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
          const pinData = data.results.map(row => ({
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": [
                {
                  "type": "bubble",
                  "hero": {
                    "type": "image",
                    "url": `${row.icon}`,
                    "size": "full",
                    "aspectRatio": "20:13",
                    "aspectMode": "cover"
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": `PM 2.5 : ${row.name}`,
                        "size": "xl",
                        "weight": "bold",
                        "wrap": true
                      },
                      {
                        "type": "box",
                        "layout": "baseline",
                        "contents": [
                          {
                            "type": "text",
                            "text": "จุดตรวจวัด ",
                            
                            "size": "sm",
                            "weight": "bold",
                            "wrap": true
                          }
                        ]
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "text"
                      }
                    ]
                  }
                }
              ]
            }
          }))
          var msg = pinData;
  
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
        // }))

        // var msg = [];

        // msg.push(pinData[0],pinData[1],pinData[2])
            
        //     "type": "flex",
        //     "altText": "Flex Message",
        //     "contents": {
        //       "type": "bubble",
        //       "hero": {
        //         "type": "image",
        //         "url": "https://f.ptcdn.info/289/063/000/ppdkjp4tguIvW8qTx4iU-o.jpg",
        //         "size": "full",
        //         "aspectRatio": "20:13",
        //         "aspectMode": "cover",
        //         "action": {
        //           "type": "uri",
        //           "label": "Line",
        //           "uri": "https://linecorp.com/"
        //         }
        //       },
        //       "body": {
        //         "type": "box",
        //         "layout": "vertical",
        //         "contents": [
        //           {
        //             "type": "text",
        //             "text": `${row.name}`,
        //             "size": "xl",
        //             "weight": "bold"
        //           },
        //           {
        //             "type": "box",
        //             "layout": "baseline",
        //             "margin": "md",
        //             "contents": [
        //               {
        //                 "type": "icon",
        //                 "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
        //                 "size": "sm"
        //               },
        //               {
        //                 "type": "icon",
        //                 "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
        //                 "size": "sm"
        //               },
        //               {
        //                 "type": "icon",
        //                 "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
        //                 "size": "sm"
        //               },
        //               {
        //                 "type": "icon",
        //                 "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
        //                 "size": "sm"
        //               },
        //               {
        //                 "type": "icon",
        //                 "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
        //                 "size": "sm"
        //               },
        //               {
        //                 "type": "text",
        //                 "text": "4.0",
                        
        //                 "margin": "md",
        //                 "size": "sm",
        //                 "color": "#999999"
        //               }
        //             ]
        //           },
        //           {
        //             "type": "box",
        //             "layout": "vertical",
        //             "spacing": "sm",
        //             "margin": "lg",
        //             "contents": [

        //               {
        //                 "type": "box",
        //                 "layout": "baseline",
        //                 "spacing": "sm",
        //                 "contents": [
        //                   {
        //                     "type": "text",
        //                     "text": "Time",
                            
        //                     "size": "sm",
        //                     "color": "#AAAAAA"
        //                   },
        //                   {
        //                     "type": "text",
        //                     "text": "10:00 - 23:00",
                            
        //                     "size": "sm",
        //                     "color": "#666666",
        //                     "wrap": true
        //                   }
        //                 ]
        //               }
        //             ]
        //           }
        //         ]
        //       },
        //       "footer": {
        //         "type": "box",
        //         "layout": "vertical",
                
        //         "spacing": "sm",
        //         "contents": [
        //           {
        //             "type": "button",
        //             "action": {
        //               "type": "uri",
        //               "label": "นำทาง",
        //               "uri": `https://www.google.com/maps/dir/${event.message.latitude},${event.message.longitude}/${row.geometry.location.lat},${row.geometry.location.lng}`
        //             },
        //             "height": "sm",
        //             "style": "link"
        //           },
        //           {
        //             "type": "button",
        //             "action": {
        //               "type": "uri",
        //               "label": "WEBSITE",
        //               "uri": "https://linecorp.com"
        //             },
        //             "height": "sm",
        //             "style": "link"
        //           },
        //           {
        //             "type": "spacer",
        //             "size": "sm"
        //           }
        //         ]
        //       }
        //     }
          

