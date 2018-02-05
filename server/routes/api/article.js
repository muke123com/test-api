const express = require('express');
const request = require('request');
const Crawler = require('crawler');
const connection = require('./../../c.js');

var router = express.Router();

var user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
router.get('/', function(req, res, next) {
    res.send("接口畅通");
});

router.post('/index', function(req, res, next) {
    let cur_page = req.body.cur_page;
    let source_url = "https://www.kuaizhan.com/post/ajax-postlist?site_id=9941853715&param=a891b9bfac46d41ebace9eccf88f5bbb&cur_page="+cur_page+"&jsonpcallback=jsonp1";
    request(source_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let data = {};
            data['body'] = body;
            res.send(data);
        }
    });
});

router.post('/saveArticleList', function(req, res, next) {
    var cur_page = req.body.cur_page;
    var saveData = req.body.saveData;
    saveData = JSON.parse(saveData);
    if(saveData.length == 0){
        return false;
    }
    var check_sql = 'SELECT cur_page FROM m_article WHERE cur_page = ' + cur_page + ' LIMIT 1';
    connection.query(check_sql, function (error, results, fields) {
        if (error) throw error;
        if(results.length == 0){
            for(var i=0;i<saveData.length;i++){
                var sql_insert = 'INSERT INTO m_article (title, img, cur_page, href) VALUES ("'+
                    saveData[i].title+
                    '", "'+saveData[i].img+
                    '", "'+cur_page+
                    '", "'+saveData[i].href+'")';
                console.log(sql_insert);
                connection.query(sql_insert, function (error, results, fields) {
                    if (error) throw error;
                });
            }
        }else{
            console.log("第" + cur_page + "页已有");
        }
    });
});


module.exports = router;
