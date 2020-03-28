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
          var x = "77777"
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
                          "text":  distance1,
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

  function initMap() {
    async
    defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAagc52SCi1ns7CggOovTSBMTd8YTXRlRU&callback=initMap"
    var distance1 = results[j].distance.text;
    var bounds = new google.maps.LatLngBounds();
    var markersArray = [];
    var origin1 = { lat: event.message.latitude, lng: event.message.longitude };       
    var destinationB = { lat: row.geometry.location.lat, lng: row.geometry.location.lng  };
    var destinationIcon =
      "https://chart.googleapis.com/chart?" +
      "chst=d_map_pin_letter&chld=D|FF0000|000000";
    var originIcon =
      "https://chart.googleapis.com/chart?" +
      "chst=d_map_pin_letter&chld=O|FFFF00|000000";
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 13.736717, lng: 	100.523186 },
      zoom: 10
    });
    var geocoder = new google.maps.Geocoder();

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destinationB],
        travelMode: "DRIVING",
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false, 
        avoidTolls: false
      },
      function(response, status) {
        if (status !== "OK") {
          alert("Error was : " + status);
        } else {
          var originList = response.originAddresses;
          var destinationList = response.destinationAddresses;
          var outputDiv = document.getElementById("output");
          outputDiv.innerHTML = "";
          deleteMarkers(markersArray);

          var showGeocodedAddressOnMap = function(asDestination) {
            var icon = asDestination ? destinationIcon : originIcon;
            return function(results, status) {
              if (status === "OK") {
                map.fitBounds(bounds.extend(results[0].geometry.location));
                markersArray.push(
                  new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: icon
                  })
                );
              } else {
                alert("Geocode was not successful due to: " + status);
              }
            };
          };

          for (var i = 0; i < originList.length; i++) {
            var results = response.rows[i].elements;
            geocoder.geocode(
              { address: originList[i] },
              showGeocodedAddressOnMap(false)
            );
            for (var j = 0; j < results.length; j++) {
              geocoder.geocode(
                { address: destinationList[j] },
                showGeocodedAddressOnMap(true)
              );
              outputDiv.innerHTML +=
              results[j].distance.text;
            }
          }
        }
      }
    );
  }

  function deleteMarkers(markersArray) {
    for (var i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray = [];
  }

  // function calculate(lat1,lon1,lat2,lon2,unit) {
  //  // return "sdsd";
  //   lat1 = parseFloat(lat1);
  //   lat2 = parseFloat(lat2);

  //   lon1 = parseFloat(lon1);
  //   lon2 = parseFloat(lon2);

  //   if ((lat1 == lat2) && (lon1 == lon2)) {
  //     return 0;
  //   }
  //   else {
  //     var radlat1 = Math.PI * lat1/180;
  //     var radlat2 = Math.PI * lat2/180;
  //     var theta = lon1-lon2;
  //     var radtheta = Math.PI * theta/180;
  //     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //     if (dist > 1) {
  //       dist = 1;
  //     }
  //     dist = Math.acos(dist);
  //     dist = dist * 180/Math.PI;
  //     dist = dist * 60 * 1.1515;
  //      if (unit=="K") { dist = dist * 1.609344 }
  //      if (unit=="N") { dist = dist * 0.8684 }

  //     return dist+"SS";

  //   }
  
  // }
  app.set('port', (process.env.PORT || 4000))
  
  app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'))
  })
       
