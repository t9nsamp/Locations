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
        // return new Promise((resolve, reject) => {

          //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.8575872,100.5617152&rankby=distance&keyword=pea&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU

          //apiUrl : https://maps.googleapis.com/maps/api/place/nearbysearch/json

          restClient.get(`${process.env.apiUrl}?location=${event.message.latitude},${event.message.longitude}&rankby=distance&keyword=UOB@&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU`, (data, response) => {

          //restClient.get(`${process.env.apiUrl}?lat=${event.message.latitude}&long=${event.message.longitude}`, (data, response) => {
              
                const locationfetch = data.json();
                replylocation(event.replyToken, {
                  "type": "flex",
                  "altText": "Flex Message",
                  "contents": {
                    "type": "carousel",
                    "contents": [
                      {
                        "type": "bubble",
                        "hero": {
                          "type": "image",
                          "url": `${locationfetch[0].results.name}`,
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
                              "text": `PM 2.5 : ${locationfetch[0].results.name}`,
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
                                  "text": `จุดตรวจวัด : ${locationfetch[0].results.name} ${locationfetch[0].results.name}`,
                                  "flex": 0,
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
                              "text": `อัพเดตเมื่อ : ${locationfetch[0].results.name}`
                            }
                          ]
                        }
                      },
                      {
                        "type": "bubble",
                        "hero": {
                          "type": "image",
                          "url": `${locationfetch[1].results.name}`,
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
                              "text": `PM 2.5 : ${locationfetch[1].results.name}`,
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
                                  "text": `จุดตรวจวัด : ${locationfetch[1].results.name} ${locationfetch[1].results.name}`,
                                  "flex": 0,
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
                              "text": `อัพเดตเมื่อ : ${locationfetch[1].results.name}`
                            }
                          ]
                        }
                      },
                      {
                        "type": "bubble",
                        "hero": {
                          "type": "image",
                          "url": `${locationfetch[2].results.name}`,
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
                              "text": `PM 2.5 : ${locationfetch[2].results.name}`,
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
                                  "text": `จุดตรวจวัด : ${locationfetch[2].results.name} ${locationfetch[2].results.name}`,
                                  "flex": 0,
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
                              "text": `อัพเดตเมื่อ : ${locationfetch[2].results.name}`
                            }
                          ]
                        }
                      },
                      {
                        "type": "bubble",
                        "hero": {
                          "type": "image",
                          "url": `${locationfetch[3].results.name}`,
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
                              "text": `PM 2.5 : ${locationfetch[3].results.name}`,
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
                                  "text": `จุดตรวจวัด : ${locationfetch[3].results.name} ${locationfetch[3].results.name}`,
                                  "flex": 0,
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
                              "text": `อัพเดตเมื่อ : ${locationfetch[3].results.name}`
                            }
                          ]
                        }
                      },
                      {
                        "type": "bubble",
                        "hero": {
                          "type": "image",
                          "url": `${locationfetch[4].results.name}`,
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
                              "text": `PM 2.5 : ${locationfetch[4].results.name}`,
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
                                  "text": `จุดตรวจวัด : ${locationfetch[4].results.name} ${locationfetch[4].results.name}`,
                                  "flex": 0,
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
                              "text": `อัพเดตเมื่อ : ${locationfetch[4].results.name}`
                            }
                          ]
                        }
                      }
                    ]
                  }
                });
              
              // } else {
              //   reject()
              // }
            })
          // })
        
        }
        
        app.set('port', (process.env.PORT || 4000))
        
        app.listen(app.get('port'), function () {
          console.log('run at port', app.get('port'))
        })

          
