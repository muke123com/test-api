var express = require('express');
var request = require('request');

var router = express.Router();

//获取图书列表
router.get('/book/series', function(req, res, next) {
	const seriesId = req.query.seriesId;
	request('https://api.douban.com/v2/book/series/' + seriesId + '/books', function(error, response, body) {
		res.send(body);
	});
});

//获取电影top250
router.get('/movie/top250', function(req, res, next) {
	request('https://api.douban.com/v2/movie/top250', function(error, response, body) {
		res.send(body);
	});
});

module.exports = router;