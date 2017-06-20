var express = require('express');
var request = require('request');
const EventEmitter = require('events');
var router = express.Router();

class MyEmitter extends EventEmitter{}
const myEmitter = new MyEmitter();

var data = {};
//发送消息
router.post('/send', function(req, res, next) {
	const text = req.body.text;
	console.log(text);
	data = {
		status: true,
		msg: "",
		data: {
			"text": text 
		}
	}
	res.end();
	myEmitter.emit('receive');
});

//接收信息
router.post('/receive', function(req, res, next) {
	myEmitter.on('receive', function(){
		next();
	})
});
router.post('/receive', function(req, res, next) {
	res.send(data);		
});

module.exports = router;