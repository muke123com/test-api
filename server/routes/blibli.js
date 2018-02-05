const express = require('express');
const request = require('request');

const router = express.Router();

const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(__dirname);
  res.send("bb");
});

router.get('/listUsers', function(req, res, next) {
	fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
    });
});


router.get('/getNetSource', function (req, res, next) {
    res.render('net');
});

//抓取图片
let img_num = 300;
let base_url = "http://cdn.leoh.io/images/base_zero/image_";
let url = "";
let dir = "F:/web_images";
let a = 0;
router.post('/downloadAllImages', function (req, res, next) {
    for(let i=101;i<=img_num;i++){
        url = base_url + i + ".jpg";
        let writeStream = fs.createWriteStream(dir + '/' + i + ".jpg");
        request(url).pipe(writeStream);
        writeStream.on("finish", function () {
            a++;
            if(a == img_num){
                res.send("success");
            }
        });
    }
});

//下载单个图片
router.post('/downloadImage', function (req, res, next) {
    let num = req.body.num;
    url = base_url + num + ".jpg";
    let writeStream = fs.createWriteStream(dir + '/' + num + ".jpg");
    request(url).pipe(writeStream);
    writeStream.on("finish", function () {
        res.send("success");
    });
});

//查看图片
router.post('/viewAllImages', function (req, res, next) {
    fs.readdir(dir, function (err, files) {
        if(err){
            console.log(err);
        }
        res.send(files);
    })
});

module.exports = router;
