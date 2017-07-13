var express = require('express');
var request = require('request');
const EventEmitter = require('events');

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
	res.send({msg: 'iii'})
});
router.get('/git', function(req, res, next) {
	let q = req.query;
	let data = gitSearch(q, 1, res);
});
router.get('/steam', function(req, res, next) {
	res.render('steam', {
		title: 'steam'
	})
});
router.get('/getSteam', function(req, res, next) {
	let data = [];
	connection.query('SELECT * FROM m_steam', function(error, results, fields){
		data = results;		
		res.send({
			data: data
		})
	})
});

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


function searchPage(options, callback){
	request(options, function (error, response, body) {
	  console.log('error:', error); // Print the error if one occurred
	  if(error) throw error;
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  if(response.statusCode == 200){
	  	body = body.replace(/<[^<]*>/g, "");
	  	connection.query('INSERT INTO m_result (content) VALUES ("'+body+'")', function (error, results, fields) {
		  if (error) throw error;
		  
		});
	  }
	});
}
//https://github.com/search?o=desc&q=javascript&s=stars&type=Repositories&utf8=%E2%9C%93
function gitSearch(q, p, res){
	const url = 'https://github.com/search?o=desc&p='+p+'&q='+q+'&s=stars&type=Repositories&utf8=%E2%9C%93'
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
	            
	            let names = $(".v-align-middle");
	            for (var i=0;i<names.length;i++) {
	            	let item = {
	            		id: (p-1)*10+(i+1),
	            		name: names.eq(i).html(),
	            		page: p,
	            		href: names.eq(i).attr("href")
	            	}
	            	data.push(item);
	            }
            	res.send({
					data: data
				})

	        }
	        done();
	    }
	});
	
	// Queue just one URL, with default callback
	c.queue(url);
	return data;
}
/**
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

