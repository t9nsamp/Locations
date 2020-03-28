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
          var x = "77777";
          const pinData = data.results.map(row => ({
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": `${row.name}`,
                  "weight": "bold",
                  "size": "lg",
                  "wrap": true
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ที่อยู่",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": `${row.vicinity}`,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "เวลา",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": test(`${event.message.latitude}`,`${event.message.longitude}`,`${row.geometry.location.lat}`,`${row.geometry.location.lng}`),
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
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
                  "type": "button",
                  "flex": 2,
                  "style": "primary",
                  "color": "#012971",
                  "action": {
                    "type": "uri",
                    "label": "นำทาง",
                    "uri": `https://www.google.com/maps/dir/${event.message.latitude},${event.message.longitude}/${row.geometry.location.lat},${row.geometry.location.lng}`
                  },
                  "height": "sm",
                  "color": "#012971"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "เว็บไซต์",
                    "uri": "https://www.uob.co.th/personal/location/locations-line.page"
                  },
                  "height": "sm",
                  
                },
                {
                  "type": "spacer",
                  "size": "sm"
                }
              ],
              "flex": 0
            }
           
          }))

          var CC = [];

          CC.push(pinData[0],pinData[1],pinData[2])

          var msg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
                "type": "carousel",
                "contents": CC
          }
        }
  
          resolve(client.replyMessage(event.replyToken, msg))
        } else {
          reject()
        }
      })
    })
   
  }

  function calculate(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }

      return dist;

    }
  
  }

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
          var x = "77777";
          const pinData = data.results.map(row => ({
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": `${row.name}`,
                  "weight": "bold",
                  "size": "lg",
                  "wrap": true
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ที่อยู่",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": `${row.vicinity}`,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "เวลา",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": cal(`${event.message.latitude}`,`${event.message.longitude}`,`${row.geometry.location.lat}`,`${row.geometry.location.lng}`),
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
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
                  "type": "button",
                  "flex": 2,
                  "style": "primary",
                  "color": "#012971",
                  "action": {
                    "type": "uri",
                    "label": "นำทาง",
                    "uri": `https://www.google.com/maps/dir/${event.message.latitude},${event.message.longitude}/${row.geometry.location.lat},${row.geometry.location.lng}`
                  },
                  "height": "sm",
                  "color": "#012971"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "เว็บไซต์",
                    "uri": "https://www.uob.co.th/personal/location/locations-line.page"
                  },
                  "height": "sm",
                  
                },
                {
                  "type": "spacer",
                  "size": "sm"
                }
              ],
              "flex": 0
            }
           
          }))

          var CC = [];

          CC.push(pinData[0],pinData[1],pinData[2])

          var msg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
                "type": "carousel",
                "contents": CC
          }
        }
  
          resolve(client.replyMessage(event.replyToken, msg))
        } else {
          reject()
        }
      })
    })
   
  }
  function cal($lat1, $lon1, $lat2, $lon2){
    $R = 6371; // km
    $dLat = toRad($lat2-$lat1);
    $dLon = toRad($lon2-$lon1);
    $lat1 = toRad($lat1);
    $lat2 = toRad($lat2);

    $a = sin($dLat/2) * sin($dLat/2) +sin($dLon/2) * sin($dLon/2) * cos($lat1) * cos($lat2); 
    $c = 2 * atan2(sqrt($a), sqrt(1-$a)); 
    $d = $R * $c;
    return $d+"AA";
}

// Converts numeric degrees to radians
function toRad($Value) 
{
return $Value * pi() / 180;
}


  function calculate(lat1, lon1, lat2, lon2) {
    lat1 = parseFloat(lat1);
    lat2 = parseFloat(lat2);

    lon1 = parseFloat(lon1);
    lon2 = parseFloat(lon2);
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }

      return dist;

    }
  
  }

  function test(text1,text2,text3,text4){
    return text1+"--"+text2+"--"+text3+"--"+text4;
  }

  app.set('port', (process.env.PORT || 4000))
  
  app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'))
  })
       


  function test(text1,text2,text3,text4){
    return text1+"--"+text2+"--"+text3+"--"+text4;
  }

  app.set('port', (process.env.PORT || 4000))
  
  app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'))
  })
       
