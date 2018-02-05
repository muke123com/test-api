var express = require('express');
var fs = require('fs');
// var xml2js = require('xml2js');

var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
	res.render('index', {
	});
});

router.get('/fs', function(req, res, next) {
	fs.readFile('public/sharedStrings.xml', function(err, data){
		if(err){
			console.log(err);
		}else{
			console.log(data.toString().length);
			data = data.toString();
		}
		xml2js.parseString(data, function (err, result) {
			res.render('index', {
				'detail': result
			});
	    });
	});
});

router.get('/webgl', function(req, res, next) {
	res.render('webgl', {
	});
});

router.get('/weight', function(req, res, next) {
	res.render('weight', {
	});
});

router.post('/testApi', function(req, res, next) {
	let name = req.body.name;
	let title = req.body.title;
	var data = {
		name: name,
		title: title
	}
	res.send(data)
});

module.exports = router;