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
    restClient.get(`${process.env.apiUrl}?location=${event.message.latitude},${event.message.longitude}&rankby=distance&name=UOB@&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU0`, (data, response) => {
      if (data) {
        const pinData = data.map(row => ({
          "thumbnailImageUrl": row.results.icon,
          "imageBackgroundColor": "#FFFFFF",
          "title": `PM 2.5: ${row.results.name}`,
          "text": `${row.results.name}, ${row.results.id}`,
          "actions": [
            {
              "type": "uri",
              "label": "ข้อมูลย้อนหลัง",
              "uri": "https://www.uob.co.th/default/index.page"
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

//     restClient.get(`${process.env.apiUrl}?lat=${event.message.latitude}&long=${event.message.longitude}`, (data, response) => {
//       if (data) {
//         const pinData = data.map(row => ({
//           "thumbnailImageUrl": row.aqi.icon,
//           "imageBackgroundColor": "#FFFFFF",
//           "title": `PM 2.5: ${row.aqi.aqi}`,
//           "text": `${row.aqi.param}, ${row.aqi.param}`,
//           "actions": [
//             {
//               "type": "uri",
//               "label": "ข้อมูลย้อนหลัง",
//               "uri": row.historyUrl
//             }
//           ]
//         }))
    
//         var msg = {
//           "type": "template",
//           "altText": "ข้อมูลสถานที่",
//           "template": {
//             "type": "carousel",
//             "columns": pinData,
//             "imageAspectRatio": "rectangle",
//             "imageSize": "cover"
//           }
//         }

//         resolve(client.replyMessage(event.replyToken, msg))
//       } else {
//         reject()
//       }
//     })
//   })
 
// }
//     restClient.get(`${process.env.apiUrl}?location=${event.message.lat},${event.message.lng}&rankby=distance&name=UOB@&key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU0`, (data, response) => {
//       if (data) {
//         const pinData = data.map(row => ({
//           // "thumbnailImageUrl": row.result[icon],
//           // "imageBackgroundColor": "#FFFFFF",
//           // "title": `Branch: 
//           // `${row.result[name]}`
//           // "text": `${row.result[name]}, ${row.result[id]}`,
//           // "actions": [
//           //   {
//           //     "type": "uri",
//           //     "label": "ข้อมูลย้อนหลัง",
//           //     "uri": "https://www.uob.co.th/default/index.page"
//           //   }
//           // ]
//         // }))   
    
//         var msg = {
//           "type": "text",
//           "text": data
//         }

//         resolve(client.replyMessage(event.replyToken, msg))
//       } else {
//         reject()
//       }
//     })
//   })
 
// }

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})