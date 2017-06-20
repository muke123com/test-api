var express = require('express');
var router = express.Router();
const session = require('express-session');
const crypto = require('crypto');

var key="asdhjwheru*asd123-123";//加密的秘钥

const account = {
	cipher: function(password, key){
		let cipher = crypto.createCipher('aes192', key);
		var crypted =cipher.update(password,'utf8','hex');
		crypted += cipher.final('hex');
		return crypted;
	},
	deCipher: function(crypted, key){
		var decipher = crypto.createDecipher('aes192',key);
		var dec=decipher.update(crypted,'hex','utf8');
		dec += decipher.final('utf8'); //解密之后的值
		return dec;
	}
}

/*登录*/
router.post('/login', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	try{
		var sess = req.session;
		sess.username = username;
		sess.password = password;
	}catch(e){
		//TODO handle the exception
		console.log(e);
	}
	var data = {};
	data.msg = "登录成功";
	res.send(data);
});

/*注册*/
router.post('/register', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	try{
		password = account.cipher(password, key);
	}catch(e){
		console.log(e);		
	}
	var data = req.body;
	data.msg = '注册成功';
	res.send(data);
});

module.exports = router;
