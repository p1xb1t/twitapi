const client = require('cheerio-httpcli');
const fs = require('fs');
const exec = require('child_process').exec;
const cheerio = require('cheerio');

const promiseGetSoundCloud = () => {
  return new Promise((resolve, reject) => {
    const readFile = fs.readFileSync('./sample.html', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      return data;
    });
    const $ = cheerio.load(readFile);
    const dataList = {};
    $('._8mlbc').each((i, elm) => {
      let img = $('img._icyx7', elm).attr('src');
      img = img.substr(0, img.indexOf('?'));
      // const userName = $('.soundTitle__usernameText', elm).text();
      // const userUrl  = $('.soundTitle__username', elm).attr('href');
      // const trackName = $('.soundTitle__title', elm).children('span').text();
      // const trackUrl = $('.soundTitle__title', elm).attr('href');
      const data = {
        'NUMBER': i,
        'URL': img
        // 'USERNAME': userName,
        // 'USERURL': 'https://soundcloud.com' + userUrl,
        // 'TRACK': trackName,
        // 'URL': 'https://soundcloud.com' + trackUrl
      };
      dataList[i] = data;
      fs.writeFile('sample.json', JSON.stringify(dataList, null, '   '));
    });
    resolve(dataList);
  });
};

promiseGetSoundCloud();
