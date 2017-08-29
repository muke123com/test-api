var express = require('express');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/fs', function(req, res, next) {
	console.log(__dirname);
	res.render('index', {
		title: 'fs'
	});
});

router.get('/webgl', function(req, res, next) {
	res.render('webgl', {
		title: 'Webgl'
	});
});

router.get('/weight', function(req, res, next) {
	res.render('weight', {
		title: 'Weight'
	});
});

router.post('/testApi', function(req, res, next) {
	let name = req.body.name;
	let title = req.body.title;
	console.log(req);
	var data = {
		name: name,
		title: title
	}
	res.send(data)
});

module.exports = router;