var express = require('express');
const redis = require('redis');
const client = require('./../redis_c.js');
const connection = require('./../c.js');

var router = express.Router();

router.get('/index', function(req, res, next) {
	let data = "";
	client.get('itemData', function(err, data){
		if(err){
			console.error(err);
		}
		if(data == null){
			connection.query('SELECT name FROM item_template LIMIT 10', function(error, results, fields){
				data = JSON.stringify(results);		
				client.set('itemData', data, redis.print);
				res.send({
					status: true,
					msg: '数据库',
					data: data
				});
			})
		}else{
			res.send({
				status: true,
				msg: 'redis',
				data: data
			})
		}
	});
});

module.exports = router;