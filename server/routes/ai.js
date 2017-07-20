var express = require('express');

var router = express.Router();

router.get('/index', function(req, res, next){
	res.render('ai', {});
})

router.get('/ml', function(req, res, next){
	res.send({ml: 123});
})

module.exports = router;