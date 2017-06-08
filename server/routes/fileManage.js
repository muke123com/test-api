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

//文件列表
router.get('/fileList', function(req, res, next) {
	let path = "./uploads";
	fs.readdir(path, function(err, files) {
		if(err){
			console.log(err);
			return;
		}
		let data = {};
		data.status = true;
		data.msg = "success";
		data.data = files;
		res.send(data);
	})
})

//上传
router.post('/fileUpload', upload.single('files'), function(req, res, next) {
	var data = {
		msg: "上传成功"
	}
  res.send(data);
})

//下载
router.get('/fileDownload/:fileName', function(req, res, next) {
	let fileName = req.params.fileName;
	let path = "./uploads/"+ fileName;
	res.download(path);
})

module.exports = router;
