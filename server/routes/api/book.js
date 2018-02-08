// http://yz4.chaoxing.com/common/pc/book_getBook?size=20&start=0&channelId=1000000036
const express = require('express');
const request = require('request');
const Crawler = require('crawler');
const connection = require('./../../c.js');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("接口畅通");
});

router.get('/test', function(req, res, next) {
    request("http://yz4.chaoxing.com/common/pc/book_getBook?size=100&start=0&channelId=1000000036", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let data = {};
            data['body'] = body;
            res.send(data);
        }
    });
});

module.exports = router;