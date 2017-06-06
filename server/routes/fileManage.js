var express = require('express');
const fs = require('fs');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage})

var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  fs.readFile("F:/json.json", "utf-8", function(err, fileText){
    if (err) {
      console.log(err);
    }else{
      let data = {};
      data.status = true;
      data.msg = "success";
      data.data = fileText;
      res.send(data);
    }
  })
});

router.post('/fileUpload', upload.single('files'), function(req, res, next) {
  res.send(123);
})

module.exports = router;
