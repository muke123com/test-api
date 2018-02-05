var express = require('express');
var request = require('request');
var fs = require('fs');

var router = express.Router();

var fileUrl = "public/mp3";
//获取图书列表
router.get('/list', function(req, res, next) {
	var songs = [];
	fs.readdir(fileUrl, function(err, files){
		if(err){
			res.send(err);
		}else{
			files.forEach(function (item) {
				songs.push(item);
	        });
			res.render('index', {
				songs: songs
			})
		}
	})
});

router.get('/song', function(req, res, next) {
	var songName = req.query.songName;
	if(songName != null){
        var rs = fs.createReadStream('../asset/'+songName);
        rs.pipe(res);
        rs.on('end',function(){
            res.end();
            console.log('end call');
        });
    }else{
        console.log("参数为空");
        res.end();
    }
});

module.exports = router;