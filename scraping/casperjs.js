var casper = require('casper').create();
var fs = require('fs');

function getHTML() {
  var targetURL = 'https://www.instagram.com/explore/tags/%E3%83%8F%E3%82%A6%E3%82%B9%E3%83%86%E3%83%B3%E3%83%9C%E3%82%B9/?hl=ja';
  casper.options.waitTimeout = 1000;
  casper.start();
  casper.open(targetURL);
  casper.then(function () {
    var html = this.getHTML();
    fs.write('./sample.html', html);
  });
  casper.run();
}

getHTML();
