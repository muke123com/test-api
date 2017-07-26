var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
	console.log(req.session);
  res.render('index', { title: 'Express' });
});

router.get('/webgl', function(req, res, next) {
	console.log(req.session);
  res.render('webgl', { title: 'Webgl' });
});

module.exports = router;
