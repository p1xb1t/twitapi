// require modules
const fs = require('fs');
const path = require('path');
const request = require('request');
const URL = require('url');

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

module.exports = {
  // save img from url
  getImg: function(data, dirname) {
    return new Promise((resolve, reject) => {
      const dir = createDir(dirname);
      const filepath = {};
      for (const i in Object.keys(data)) {
        const url = data[i].url;
        const filename = dir + i + '.jpg';
        request(url).pipe(fs.createWriteStream(filename));
        filepath[i] = {
          path: filename
        }
      }
      resolve(filepath);
    });
  }
}
