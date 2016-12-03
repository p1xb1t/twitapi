// require modules
const common = require('./common_func');
const ws = require('ws').Server;
const tw = require('./twkey.js');

// search word
const query = process.argv[2] + ' filter:images exclude:retweets';

// fetch tweets
function fetchTweetImg(word) {
  return new Promise((resolve, reject) => {
    tw.get('search/tweets.json', {
      q: word,
      include_entities: 'true',
      tweet_mode: 'extended'
    }, (error, tweets, response) => {
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

// websocket
const server = new ws({
  port: 3000
});

server.on('connection', (ws) => {
  console.log('...connected!');
  ws.on('message', (message) => {
    console.log('received');
    fetchTweetImg(query)
      .then(function(data) {
        common.getImg(data, 'twitter_img')
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
