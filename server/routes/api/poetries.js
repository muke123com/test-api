const express = require('express');
const connection = require('./../../c.js');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("接口畅通");
});

router.get('/getPoetries', function(req, res, next) {
    let find_sql = "SELECT a.id, a.title, a.content, b.`name` FROM poetries a LEFT JOIN poets b ON a.poet_id = b.id LIMIT 10";
    connection.query(find_sql, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

module.exports = router;