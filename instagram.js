// require modules
const common = require('./common_func');
const fs = require('fs');
const https = require('https');
const ws = require('ws').Server;
// API key
const key = require('./igkey.js');

const url = 'https://api.instagram.com/v1/users/11180556/media/recent?access_token=' + key;

function InstaAPI(url, callback) {
  https.get(url, (res) => {
    let body = '';
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      body += chunk
    });

    res.on('end', (res) => {
      res = JSON.parse(body);
      callback(res);
      //      fs.writeFile('ig.json', JSON.stringify(res, null, '   '));
    });
  }).on('error', (e) => {
    console.log(e.message);
  });
}

// fetch images url
function fetchInstaImg(url) {
  return new Promise((resolve, reject) => {
    InstaAPI(url, (body) => {
      const dataList = {};
      for (const i in body.data) {
        let url = body.data[i].images.standard_resolution.url;
        url = url.substr(0, url.indexOf('?'));
        const data = {
          'url': url
        };
        dataList[i] = data;
      }
      resolve(dataList);
    });
  })
}

// websocket
const server = new ws({
  port: 3000
});

server.on('connection', (ws) => {
  console.log('...connected!');
  ws.on('message', (message) => {
    console.log('received');
    fetchInstaImg(url)
      .then(function(data) {
        common.getImg(data, 'insta_img')
          .then(function(path) {
            const text = JSON.stringify(path);
            ws.send(text, (err) => {});
            console.log('sent');
          })
          .catch(function(err) {
            console.log(err);
          })
      })
      .catch(function(err) {
        console.log(err);
      });
  });
  ws.on('close', () => {
    console.log('disconnected');
  })
})
