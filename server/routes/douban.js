var express = require('express');
var request = require('request');

var router = express.Router();

router.get('/book/series', function(req, res, next) {
  const seriesId = req.query.seriesId;
  request('https://api.douban.com/v2/book/series/' + seriesId + '/books', function (error, response, body) {
    res.send(body);
  });
});

router.get('/movie/top250', function(req, res, next) {
  request('https://api.douban.com/v2/movie/top250', function (error, response, body) {
    res.send(body);
  });
});

module.exports = router;
