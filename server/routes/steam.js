var express = require('express');
var request = require('request');
const EventEmitter = require('events');
const redis = require('redis');
const client = require('./../redis_c.js');
var Crawler = require('crawler');
const connection = require('./../c.js');

var router = express.Router();

class MyEmitter extends EventEmitter {}
//监听器实例
const myEmitter = new MyEmitter();

/* GET home page. */
var user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
let getDataTimes = 5;
router.get('/index', function(req, res, next) {
	client.get('steamData', function(err, data){
		if(err){
			console.error(err)
		}
		res.send({
			status: true,
			msg: 'iii',
			data: data
		})
	});
});
//每页显示数量
let pageSize = 10;
router.get('/steam', function(req, res, next) {
	var totalPage;
	connection.query('SELECT id FROM m_steam', function(error, results, fields){
		totalPage = Math.ceil(results.length/pageSize);		
		res.render('steam', {
			title: 'steam',
			totalPage: totalPage
		})
	})
});

/**
 * 获取数据库数据存入redis 
 */
function insertRedis(){
	let data = "";
	connection.query('SELECT * FROM m_steam', function(error, results, fields){
		data = JSON.stringify(results);		
		client.set('steamData', data, redis.print);
	})
}
insertRedis();

//从redis中取数据
router.get('/getRedisSteam', function(req, res, next) {
	
});

//从数据库中获取数据
router.get('/getSteam', function(req, res, next) {
	let pageNum = req.query.pageNum || 1;
	let data = [];
	connection.query('SELECT * FROM m_steam WHERE id > ('+(pageNum-1)*pageSize+') LIMIT '+pageSize, function(error, results, fields){
		data = results;		
		res.send({
			data: data
		})
	})
});
//更新数据库数据
router.get('/updateSteamData', function(req, res, next) {
	connection.query("truncate table m_steam", function (error, results, fields) {
    	if (error) throw error;
		for(var i=0;i<getDataTimes;i++){
			steamTop(i);
		}
		myEmitter.on('event', () => {
		    console.log('触发了一个事件！');
			let data = {
				state: 1,
				msg: "success"
			}
			res.send(data);
		});
	});
});

module.exports = router;


/**
 * 爬取数据
 * @param {Object} p
 */
function steamTop(p){
	const url = 'http://store.steampowered.com/search/?filter=topsellers&os=win&page='+p;
	let data = [];
	var c = new Crawler({
	    maxConnections : 10,
	    // This will be called for each crawled page
	    callback : function (error, response, done) {
	        if(error){
	            console.log(error);
	        }else{
	            var $ = response.$;
	            // $ is Cheerio by default
	            //a lean implementation of core jQuery designed specifically for the server
	            
	            let names = $("#search_result_container .search_result_row");
	            for (var i=0;i<names.length;i++) {
	            	let allPrice = names.eq(i).find(".search_price").text().trim();
	            	let item = {
	            		game_id: names.eq(i).attr("data-ds-appid"),
	            		name: names.eq(i).find(".title").text(),
	            		discount: names.eq(i).find(".search_discount span").text() || 0,
	            		image: names.eq(i).find(".search_capsule img").attr("src"),
	            		href: names.eq(i).attr("href"),
	            		price: Number(allPrice.split("¥")[1].split(",").join("")),
	            		newPrice: Number(allPrice.split("¥")[2] == null?"":allPrice.split("¥")[2].split(",").join(""))
	            	}
	            	var sql_select = 'SELECT * FROM m_steam WHERE game_id="'+item.game_id+'"';
	            	connection.query(sql_select, function (error, results, fields) {
				    	if (error) throw error;
				    	if(results.length == 0) {
				    		var sql_insert = 'INSERT INTO m_steam (game_id, name, discount, image, href, price, newPrice) VALUES ("'+item.game_id+'", "'+item.name+'", "'+item.discount+'", "'+item.image+'", "'+item.href+'", "'+item.price+'", "'+item.newPrice+'")';
				            connection.query(sql_insert, function (error, results, fields) {
						    	if (error) throw error;
						    	getDataTimes--;
						    	if(getDataTimes == 0){
						    		myEmitter.emit('event');
						    	}
							});
				    	}else{
				    		var sql_update = 'UPDATE m_steam SET name="'+item.name+'", discount="'+item.discount+'", image="'+item.image+'", href="'+item.href+'", price="'+item.price+'", newPrice="'+item.newPrice+'" WHERE game_id="'+item.game_id+'"';
				            connection.query(sql_update, function (error, results, fields) {
						    	if (error) throw error;
						    	getDataTimes--;
						    	if(getDataTimes == 0){
						    		myEmitter.emit('event');
						    	}
							});
				    	}
					});

//	            	var sql = 'INSERT INTO m_steam (game_id, name, discount, image, href) VALUES ("'+item.game_id+'", "'+item.name+'", "'+item.discount+'", "'+item.image+'", "'+item.href+'") ON DUPLICATE KEY UPDATE game_id="'+item.game_id+'"';
//	            	console.log(item.game_id, item.name);
//		            connection.query(sql, function (error, results, fields) {
//				    	if (error) throw error;
//					});
	            	data.push(item);
	            }
	        }
	        done();
	    }
	});
	
	// Queue just one URL, with default callback
	c.queue(url);
	return data;
}

