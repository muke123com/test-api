var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webgl', function(req, res, next) {
  res.render('webgl', { title: 'Webgl' });
});

router.get('/weight', function(req, res, next) {
  res.render('weight', { title: 'Weight' });
});

module.exports = router;
