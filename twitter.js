// require modules

const fs = require('fs');
const path = require('path');
const request = require('request');
const URL = require('url');
const util = require('util');

const tw = require('./twkey.js');

// search word
// const query = '#ハウステンボス filter:images exclude:retweets';
const query = process.argv[2] + ' filter:images exclude:retweets';

// create directory
function createDir(dir) {
  const savedir = path.join(__dirname, dir, '/');
  if (fs.existsSync(savedir)) {
    const files = fs.readdirSync(savedir);
    for (const file in files) {
      if ({}.hasOwnProperty.call(files, file)) {
        fs.unlinkSync(savedir + '/' + files[file]);
      }
    }
  } else {
    fs.mkdirSync(savedir);
  }
  return savedir;
}

// get tweets
function getTweetImg(word) {
  return new Promise((resolve, reject) => {
    tw.get('search/tweets.json', {q: word, include_entities: 'true', tweet_mode: 'extended'}, function(error, tweets, response) {
      if (!error) {
        const dataList = {};
        for (const i in tweets.statuses) {
          const data = {
            'url': tweets.statuses[i].entities.media[0].media_url
          };
          dataList[i] = data;
          // create JSON file
          // fs.writeFile('test2.json', JSON.stringify(dataList, null, '  '));

        }
        resolve(dataList);
      }
    });
  })
}

getTweetImg(query)
  .then(function(data) {
      const dir = createDir('img');
      for (const i in Object.keys(data)) {
        const url = data[i].url;
//        const name = URL.parse(url).pathname;
//        const filename = dir + '/' + name.replace(/[^a-zA-Z0-9\.]+/g, '_');
        const filename = dir + '/' + i + '.jpg';
        request(url).pipe(fs.createWriteStream(filename));
      }
    },
    function(err) {
      console.log(err);
    });
