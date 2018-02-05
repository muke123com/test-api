var http = require('http');
var cheerio = require('cheerio');
var url = "http://www.imooc.com/learn/348";

http.get(url, function (res) {
    var html = "";

    res.on("data", function (data) {
        html += data;
    });

    res.on("end", function () {
        filterChapters(html);
    })
}).on("error", function () {
    console.log("出错");
});

function filterChapters(html) {
    var $ = cheerio.load(html);
    var chapters = $(".chapter-content");
    chapters.each(function (i) {
        console.log(chapters.eq(i).text());
    })
}